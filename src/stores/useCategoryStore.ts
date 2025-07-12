import { create } from "zustand";

import APP_CONFIG from "$/constants/app.config.constants";
import { ICategory } from "$/types";
import StorageService from "./StorageService";

interface CategoryStore {
  storeCategories: ICategory[];
  selectedCategory: { name: string; icon: string } | null;
  setSelectedCategory: (category: { name: string; icon: string }) => void;
  setNewCategory: (newCategory: ICategory) => void;
}

const saveCategories = (categories: ICategory[]) =>
  StorageService.setItem(
    APP_CONFIG.storage.catgories,
    JSON.stringify(categories)
  );

const loadCategories = async () => {
  const stored = await StorageService.getItem(APP_CONFIG.storage.catgories);
  return stored ? (JSON.parse(stored) as ICategory[]) : null;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  storeCategories: APP_CONFIG.categories,
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
