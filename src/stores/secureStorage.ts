import * as SecureStore from "expo-secure-store";
import { StateStorage } from "zustand/middleware";

const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export default secureStorage;
