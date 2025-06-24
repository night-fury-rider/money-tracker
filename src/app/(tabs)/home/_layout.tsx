import {
  ADD_CATEGORY_SCREEN_STRS,
  ADD_TRANSACTION_SCREEN_STRS,
  CATEGORY_LIST_SCREEN_STRS,
  VIEW_TRANSACTION_SCREEN_STRS,
} from "$/constants/strings.constants";
import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="ViewTransactionScreen"
        options={{ title: VIEW_TRANSACTION_SCREEN_STRS.title }}
      />
      <Stack.Screen
        name="AddTransactionScreen"
        options={{ title: ADD_TRANSACTION_SCREEN_STRS.title }}
      />
      <Stack.Screen
        name="CategoryListScreen"
        options={{ title: CATEGORY_LIST_SCREEN_STRS.title }}
      />

      <Stack.Screen
        name="AddCategoryScreen"
        options={{ title: ADD_CATEGORY_SCREEN_STRS.title }}
      />
    </Stack>
  );
}
