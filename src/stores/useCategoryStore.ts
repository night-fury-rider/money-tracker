// stores/useCategoryStore.ts

import APP_CONFIG from "$/constants/app.config.constants";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface Subcategory {
  name: string;
  icon: string;
}

interface Category {
  name: string;
  icon: string;
  subcategories?: Subcategory[];
}

interface NewCategory extends Category {
  parent?: string;
}

interface CategoryStore {
  storeCategories: Category[];
  selectedCategory: { name: string; icon: string } | null;
  setSelectedCategory: (category: { name: string; icon: string }) => void;
  setNewCategory: (newCategory: NewCategory) => void;
}

const saveCategories = (categories: Category[]) =>
  SecureStore.setItemAsync(
    APP_CONFIG.storage.catgories,
    JSON.stringify(categories)
  );

const loadCategories = async () => {
  const stored = await SecureStore.getItemAsync(APP_CONFIG.storage.catgories);
  return stored ? (JSON.parse(stored) as Category[]) : null;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  storeCategories: [
    {
      name: "Groceries",
      icon: "cart",
      subcategories: [
        { name: "Fruits", icon: "apple" },
        { name: "Vegetables", icon: "leaf" },
      ],
    },
    {
      name: "Transport",
      icon: "car",
      subcategories: [
        { name: "Fuel", icon: "gas-station" },
        { name: "Taxi", icon: "taxi" },
      ],
    },
    {
      name: "Entertainment",
      icon: "movie",
      subcategories: [
        { name: "Movies", icon: "film" },
        { name: "Games", icon: "gamepad" },
      ],
    },
    { name: "Rent", icon: "home" },
    { name: "Utilities", icon: "flash" },
  ],
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setNewCategory: (newEntry) => {
    const currentCategories = get().storeCategories;

    if (newEntry.parent) {
      const updatedCategories = currentCategories.map((cat) => {
        if (cat.name === newEntry.parent) {
          const updatedSubcategories = [
            ...(cat.subcategories || []),
            {
              name: newEntry.name,
              icon: newEntry.icon,
            },
          ];
          return { ...cat, subcategories: updatedSubcategories };
        }
        return cat;
      });

      set({ storeCategories: updatedCategories });
      saveCategories(updatedCategories);
    } else {
      set({
        storeCategories: [...currentCategories, newEntry],
      });
    }
  },
}));

export { loadCategories, saveCategories };
