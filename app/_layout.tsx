import { Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/(auth)/login");
      }
    };
    checkAuth();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}