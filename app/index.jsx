// import { useEffect, useState } from "react";
// import { Text, View, Button, Alert } from "react-native";
// import * as LocalAuthentication from "expo-local-authentication";

// export default function Index() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     checkBiometricSupport();
//   }, []);

//   const checkBiometricSupport = async () => {
//     const compatible = await LocalAuthentication.hasHardwareAsync(); //check with the phone support biometric authentication
//     const enrolled = await LocalAuthentication.isEnrolledAsync();
//     console.error(compatible)
//     if (!compatible || !enrolled) {
//       setIsBiometricAvailable(false);
//       setErrorMessage("Biometric authentication is not available");
//     } else {
//       setIsBiometricAvailable(true);
//     }
//   };

//   const authenticateUser = async () => {
//     try {
//       const result = await LocalAuthentication.authenticateAsync({
//         promptMessage: "Authenticate to proceed",
//         fallbackLabel: "Use passcode",
//         cancelLabel: "Cancel",
//       });
      
//       if (result.success) {
//         setIsAuthenticated(true);
//         setErrorMessage("");
//       } else {
//         setIsAuthenticated(false);
//         setErrorMessage("Authentication failed. Please try again.");
//       }
//     } catch (error) {
//       Alert.alert("Authentication Error", error.message);
//       setErrorMessage(error.message);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       {isAuthenticated ? (
//         <Text style={{ fontSize: 18, color: "green" }}>✅ You are authenticated!</Text>
//       ) : (
//         <Text style={{ fontSize: 18, color: "red" }}>❌ You are not authenticated</Text>
//       )}

//       {!isBiometricAvailable && (
//         <Text style={{ color: "orange", marginTop: 10 }}>{errorMessage}</Text>
//       )}

//       {isBiometricAvailable && (
//         <Button title="Authenticate" onPress={authenticateUser} />
//       )}
//     </View>
//   );
// }


import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  Text, 
  Button, 
  ActivityIndicator, 
  StyleSheet 
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware) {
      setErrorMessage("❌ Biometric authentication is not supported on this device.");
      return;
    }

    if (!enrolled) {
      setErrorMessage("⚠️ No biometric data found. Please set up fingerprint or Face ID.");
      return;
    }

    setIsBiometricAvailable(true);
  };

  const authenticateUser = async () => {
    setIsLoading(true); // Show loader while authenticating

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        setErrorMessage("");
      } else {
        setErrorMessage("❌ Authentication failed. Try again.");
      }
    } catch (error) {
      setErrorMessage("❌ An error occurred: " + error.message);
    }

    setIsLoading(false); // Hide loader after authentication
  };

  return (
    <View style={styles.container}>
       <StatusBar style="dark" />
      {isAuthenticated ? (
        <Text style={styles.successText}>✅ Authenticated Successfully!</Text>
      ) : (
        <>
          <Text style={styles.errorText}>❌ Not Authenticated</Text>
          {errorMessage && <Text style={styles.warningText}>{errorMessage}</Text>}
          {isBiometricAvailable && <Button title="Authenticate" onPress={authenticateUser} />}
        </>
      )}

      {/* Full-screen Loader */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Authenticating...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successText: {
    fontSize: 20,
    color: "green",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  warningText: {
    color: "orange",
    marginVertical: 10,
    textAlign: "center",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
  },
});
