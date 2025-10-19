import { Alert, Pressable, StyleSheet, TextInput, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { forgotPassword, resetPassword } from "../scripts/userapi";

export default function ForgotPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const tokenParam = params.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  useEffect(() => {
    if (token) {
      setStep(2);
    }
  }, [token]);

  const handleNext = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    console.log("Sending forgot password request for:", email.trim());

    try {
      const message = await forgotPassword(email.trim());
      console.log("Forgot password response:", message);

      Alert.alert("Success", message);
      setStep(2);
    } catch (error: any) {
      console.log("Forgot password error:", error);
      Alert.alert("Error", error.message || "Failed to send reset link.");
    }
  };

  const handleReset = async () => {
  // Password validations
  if (newPassword !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match.");
    return;
  }

  if (newPassword.length < 6) {
    Alert.alert("Error", "Password must be at least 6 characters long.");
    return;
  }

  try {
    console.log("Resetting password with token:", token);

    await resetPassword(token, newPassword);

    Alert.alert("Success", "Your password has been reset successfully!", [
      { text: "OK", onPress: () => router.push("/login") },
    ]);
  } catch (error: any) {
    console.log("Reset password error:", error);
    Alert.alert(
      "Error",
      error.message || "Failed to reset password. The token may have expired."
    );
  }
};


  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <View style={styles.container}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Forgot Password</Text>

            <View style={styles.messages}>
              <Text style={styles.text1}>Enter email address</Text>
              <Text style={styles.text2}>to reset password</Text>
            </View>

            <Image
              source={require("../assets/images/forgotpassword .png")}
              style={styles.forgotpasswordImage}
              resizeMode="contain"
            />

            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              placeholder="Enter Email"
              placeholderTextColor="#999"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Pressable style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Reset Password</Text>

            <Image
              source={require("../assets/images/reset-password.png")}
              style={styles.resetpasswordImage}
              resizeMode="contain"
            />

            <TextInput
              style={styles.input1}
              onChangeText={setNewPassword}
              placeholder="Create new Password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input2}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#999"
            />

            <Pressable style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#470094cb",
  },
  stepContainer: {
    marginBottom: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#ffffff",
    position: "absolute",
    top: 10,
    left: 55,
    textAlign: "center",
  },
  text1: {
    fontSize: 35,
    position: "absolute",
    top: -40,
    left: 25,
    color: "#ffff",
  },
  text2: {
    fontSize: 32,
    position: "absolute",
    top: 10,
    left: 55,
    color: "#ffff",
  },
  messages: {
    position: "absolute",
    top: "15%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "90%",
    width: "100%",
  },

  forgotpasswordImage: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: '60%',
  },

  resetpasswordImage: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: '60%',
  },

  input: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    width: "80%",
    height: 60,
    top: "65%",
    left: 40,
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#ffffff",
    color: "#000000ff",
    borderWidth: 2.5,
    borderColor: "white",
    fontSize: 20,
  },
  input1: {
    position: "absolute",
    textAlign: "center",
    width: "80%",
    height: 60,
    top: "50%",
    left: 40,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    color: "#000",
    borderWidth: 2.5,
    borderColor: "white",
    fontSize: 20,
  },
  input2: {
    position: "absolute",
    textAlign: "center",
    width: "80%",
    height: 60,
    top: "65%",
    left: 40,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    color: "#000",
    borderWidth: 2.5,
    borderColor: "white",
    fontSize: 20,
  },
  button: {
    position: "absolute",
    justifyContent: "center",
    width: 180,
    height: 60,
    backgroundColor: "#4f71fa72",
    top: "90%",
    left: 95,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffff",
  },
  back: {
    position: "absolute",
    top: 25,
    left: 13,
    backgroundColor: "transparent",
  },
});
