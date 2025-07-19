interface ICategory {
  name: string;
  icon: string;
  parent?: string;
  subcategories?: ISubcategory[];
}

interface ICategoryIconMap {
  [name: string]: string;
}

interface IDayGroup {
  amount: number;
  dateTimestamp: number;
  description: string;
  id: string;
  title: string;
  transactions: ITransaction[];
}

interface IMonthGroup {
  amount: number;
  days: IDayGroup[];
  description: string;
  id: string;
  title: string;
}

interface ISubcategory {
  name: string;
  icon: string;
}

interface ITransaction {
  amount: number;
  category: string;
  date: ITransactionDate;
  dateStr: string;
  dateTimestamp: number;
  description: string;
  id: string;
  title: string;
}

interface ITransactionDate {
  year: string;
  month: string;
  day: string;
}

interface IYearGroup {
  amount: number;
  description: string;
  id: string;
  months: IMonthGroup[];
  title: string;
}

export {
  ICategory,
  ICategoryIconMap,
  IMonthGroup,
  ISubcategory,
  ITransaction,
  IYearGroup,
};
