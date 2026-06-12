import { Href, useRouter } from "expo-router";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen: React.FC = () => {
  // Initialize the Expo Router
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />

      {/* Hero Content Section */}
      <View style={styles.heroContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🌱</Text>
        </View>
        <Text style={styles.brandName}>GreenLogic</Text>
        <Text style={styles.tagline}>Smart Discounts. Zero Waste.</Text>
        <Text style={styles.description}>
          Discover real-time, AI-driven price drops on fresh groceries near you
          before they expire. Save money, rescue food.
        </Text>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.actionContainer}>
        {/* Route pushes to the file named "register.tsx" in the app folder */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register" as Href)}
        >
          <Text style={styles.registerButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Route pushes to the file named "login.tsx" in the app folder */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login" as Href)}
        >
          <Text style={styles.loginButtonText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  heroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoIcon: {
    fontSize: 40,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
    marginTop: 6,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  actionContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    color: "#1976d2",
    fontWeight: "700",
  },
});

export default WelcomeScreen;
