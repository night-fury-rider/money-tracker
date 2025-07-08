import { ICategory, ICategoryIconMap } from "$/types";

const getCategoryIconMap = (categories: ICategory[]): ICategoryIconMap => {
  const categoryIcons: ICategoryIconMap = {};

  for (const category of categories) {
    categoryIcons[category.name.toLowerCase()] = category.icon;

    if (category.subcategories) {
      for (const subCategory of category.subcategories) {
        categoryIcons[subCategory.name.toLowerCase()] = subCategory.icon;
      }
    }
  }
  return categoryIcons;
};

export { getCategoryIconMap };
