import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the shape of our form state
interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function RegisterScreen() {
  // Initialize Expo Router for navigation
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation errors for each field
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  // Validation helpers
  const validateName = (name: string): string | undefined => {
    const trimmed = name.trim();
    if (!trimmed) return "Name is required.";
    if (trimmed.length < 2) return "Please enter a valid name.";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    const trimmed = email.toLowerCase().trim();
    if (!trimmed) return "Email is required.";
    // Simple email regex — good for basic validation
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!re.test(trimmed)) return "Please enter a valid email address.";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    // Optionally require a number
    if (!/\d/.test(password))
      return "Password should include at least one number.";
    return undefined;
  };

  // Helper to grab the Expo Push Token for the AI Cron Job
  const getPushTokenAsync = async (): Promise<string | null> => {
    let token = null;

    // On web, Expo Push Notifications require a `notification.vapidPublicKey` in app.json.
    // Avoid requesting a token here so we don't trigger a CodedError when running in a browser.
    // If you want web push, add the vapidPublicKey to app.json per Expo docs.
    if (Platform.OS === "web") {
      console.log(
        "Skipping push token request on web. To enable web push set notification.vapidPublicKey in app.json",
      );
      return null;
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        try {
          // In Expo SDK 50+, projectId is strictly required if you use EAS build.
          // If you get an error here, pass { projectId: 'your-project-id-from-app-json' }
          const tokenData = await Notifications.getExpoPushTokenAsync();
          token = tokenData.data;
        } catch (e) {
          console.warn("Failed to get push token", e);
        }
      } else {
        Alert.alert(
          "Notice",
          "You disabled notifications. You will miss out on Flash Deals!",
        );
      }
    } else {
      console.log("Must use a physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  const handleRegister = async () => {
    // Run validations and show inline errors
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ name: nameError, email: emailError, password: passwordError });

    if (nameError || emailError || passwordError) {
      Alert.alert(
        "Invalid input",
        "Please fix the highlighted fields and try again.",
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Request Permission & Grab Token
      const pushToken = await getPushTokenAsync();

      // 2. Build Payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        expoPushToken: pushToken, // Will be a string or null
      };
      console.log(payload);
      // 3. Send to Node Backend
      // IMPORTANT: Replace this IP with your computer's actual local IPv4 address!
      // (e.g., 192.168.1.5 or 10.0.0.12). Do NOT use localhost.
      const API_URL = "http://192.168.X.X:5000/api/users/register";

      const response = await axios.post(API_URL, payload);

      if (response.status === 201) {
        Alert.alert("Success!", "Welcome to GreenLogic!");

        // 4. Navigate to the main app/deals feed (assuming you create an app/deals.tsx next)
        // router.push('/deals');

        // For now, let's just go back to the home screen
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong during registration.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Join GreenLogic</Text>
        <Text style={styles.subtext}>
          Get instant alerts for smart grocery deals.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              const err = validateName(text);
              setErrors((prev) => ({ ...prev, name: err }));
            }}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              const err = validateEmail(text);
              setErrors((prev) => ({ ...prev, email: err }));
            }}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              const err = validatePassword(text);
              setErrors((prev) => ({ ...prev, password: err }));
            }}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={
              isLoading || !!errors.name || !!errors.email || !!errors.password
            }
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up & Enable Alerts</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Uses Expo Router to go back to the previous screen
        >
          <Text style={styles.backButtonText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 13,
    marginTop: 6,
    marginBottom: -6,
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 24,
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
});
