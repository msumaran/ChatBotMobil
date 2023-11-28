import React, { useState } from "react";
import { Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Asegúrate de importar AsyncStorage
import Logo from '../assets/icon.svg';

import { auth } from "../services/firebaseConfig";
import { TextInput, Pressable, View, Text } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      let errorMessage = "";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case "auth/user-disabled":
          errorMessage = "Este usuario ha sido desactivado.";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo electrónico.";
          break;
        case "auth/wrong-password":
          errorMessage = "La contraseña es incorrecta.";
          break;
        default:
          errorMessage = "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.";
      }
      Alert.alert("Error de inicio de sesión", errorMessage);
    }
    setLoading(false);

  };

  return (
    <View className="font-poppins flex-1 justify-center items-center bg-gray-100">
      <Logo width="180" height="180" />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        className="font-poppins mb-4 p-4 w-3/4 bg-white border border-gray-300 rounded-lg mt-12"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        className="font-poppins mb-4 p-4 w-3/4 bg-white border border-gray-300 rounded-lg"
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable className="font-poppins w-3/4 bg-blue-500 p-4 rounded-lg" onPress={handleLogin} disabled={loading}>
        <Text className="font-poppins w-full text-white text-center font-bold">
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </Text>
      </Pressable>
      <Text className="text-gray-500 mt-8">¿Olvido contraseña?</Text>
    </View>
  );
};

export default LoginScreen;
