interface ICategory {
  name: string;
  icon: string;
  parent?: string;
  subcategories?: string[];
}

export { ICategory };
