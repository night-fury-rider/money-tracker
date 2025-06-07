import { useColorScheme } from "$/hooks/useColorScheme";
import calmBlueTheme from "$/theme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

import * as SecureStore from "expo-secure-store";

import APP_CONFIG from "$/constants/app.config.constants";
import { useTransactionStore } from "$/stores/transactionStore";
import { loadCategories, useCategoryStore } from "$/stores/useCategoryStore";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("$/../public/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      const storedData = await SecureStore.getItemAsync(
        APP_CONFIG.storage.storageAppData
      );
      if (storedData) {
        const parsed = JSON.parse(storedData);
        useTransactionStore.setState({ data: parsed });
      }
      const loaded = await loadCategories();
      if (loaded) {
        useCategoryStore.setState({ storeCategories: loaded });
      }
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={calmBlueTheme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
