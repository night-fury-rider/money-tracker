import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ViewTransactionScreen" options={{ title: "" }} />
      <Stack.Screen
        name="AddTransactionScreen"
        options={{ title: "Add Transaction" }}
      />
      <Stack.Screen
        name="CategoryListScreen"
        options={{ title: "Select Category" }}
      />
    </Stack>
  );
}
