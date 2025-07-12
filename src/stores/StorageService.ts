import LoggerService from "$/services/LoggerService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

const StorageService: StateStorage = {
  getItem: async (itemKey: string): Promise<string | null> => {
    let value;
    try {
      value = await AsyncStorage.getItem(itemKey);
    } catch (e) {
      LoggerService.error(`Error in reading data: `, e);
    }
    return value ?? null;
  },
  setItem: async (itemKey: string, itemValue: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(itemKey, itemValue);
    } catch (e) {
      LoggerService.error(`Error in storing data: `, e);
    }
  },
  removeItem: async (itemKey: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(itemKey);
    } catch (e) {
      LoggerService.error(`Error in removing stored data: `, e);
    }
  },
};

export default StorageService;
