interface ICategory {
  name: string;
  icon: string;
  parent?: string;
  subcategories?: ISubcategory[];
}

interface ISubcategory {
  name: string;
  icon: string;
}

export { ICategory, ISubcategory };
