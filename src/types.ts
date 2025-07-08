interface ICategory {
  name: string;
  icon: string;
  parent?: string;
  subcategories?: ISubcategory[];
}

interface ICategoryIconMap {
  [name: string]: string;
}

interface ISubcategory {
  name: string;
  icon: string;
}

export { ICategory, ICategoryIconMap, ISubcategory };
