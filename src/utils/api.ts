import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const DEFAULT_BASE_URL =
  (process.env.API_URL as string) || "http://localhost:5000";
const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 10000,
});

let inMemoryToken: string | null = null;
let initialized = false;

export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

const readStoredToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.localStorage.getItem(TOKEN_KEY);
    }
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Failed to read token from storage", e);
    return null;
  }
};

const writeStoredToken = async (token?: string) => {
  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
      return;
    }
    if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
    else await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Failed to write token to storage", e);
  }
};

export const setAuthToken = async (token?: string) => {
  inMemoryToken = token ?? null;

  if (inMemoryToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${inMemoryToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }

  await writeStoredToken(inMemoryToken ?? undefined);
};

export const clearAuthToken = async () => {
  inMemoryToken = null;
  delete api.defaults.headers.common["Authorization"];
  await writeStoredToken(undefined);
};

// Initialize token from storage once at app start (optional, but recommended)
export const initAuthFromStorage = async () => {
  if (initialized) return;
  initialized = true;
  const token = await readStoredToken();
  if (token) {
    inMemoryToken = token;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Request interceptor — attach token from memory (or storage on first use)
api.interceptors.request.use(
  async (config) => {
    try {
      if (!inMemoryToken) {
        const stored = await readStoredToken();
        if (stored) inMemoryToken = stored;
      }
      if (inMemoryToken) {
        config.headers = config.headers || {};
        if (
          !(
            (config.headers as any)["Authorization"] ||
            (config.headers as any)["authorization"]
          )
        ) {
          (config.headers as any)["Authorization"] = `Bearer ${inMemoryToken}`;
        }
      }
    } catch (e) {
      // proceed without token
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — clear token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      // token invalid or expired — clear cached token so app can re-authenticate
      try {
        inMemoryToken = null;
        delete api.defaults.headers.common["Authorization"];
        await writeStoredToken(undefined);
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  },
);

export default api;
