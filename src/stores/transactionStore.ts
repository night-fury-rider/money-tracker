import APP_CONFIG from "$/constants/app.config.constants";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface ITransactionDate {
  year: string;
  month: string;
  day: string;
}
export interface ITransaction {
  amount: number;
  category: string;
  date: ITransactionDate;
  description: string;
  title: string;
}

export interface IDayGroup {
  amount: number;
  description: string;
  title: string;
  transactions: ITransaction[];
}

export interface IMonthGroup {
  amount: number;
  days: IDayGroup[];
  description: string;
  title: string;
}

export interface IYearGroup {
  amount: number;
  description: string;
  months: IMonthGroup[];
  title: string;
}

interface ITransactionStore {
  addTransaction: (tx: ITransaction) => void;
  data: IYearGroup[];
}

export const useTransactionStore = create<ITransactionStore>((set, get) => ({
  data: [],

  addTransaction: (tx: ITransaction) => {
    const updatedData = [...get().data];

    // Find or create year group
    let yearGroup = updatedData.find((y) => y.title === tx.date.year);
    if (!yearGroup) {
      yearGroup = {
        amount: 0,
        description: "Yearly Summary",
        months: [],
        title: tx.date.year,
      };
      updatedData.push(yearGroup);
    }

    // Find or create month group
    let monthGroup = yearGroup.months.find((m) => m.title === tx.date.month);
    if (!monthGroup) {
      monthGroup = {
        amount: 0,
        days: [],
        description: "Monthly Summary",
        title: tx.date.month,
      };
      yearGroup.months.push(monthGroup);
    }

    // Find or create day group
    let dayGroup = monthGroup.days.find((d) => d.title === tx.date.day);
    if (!dayGroup) {
      dayGroup = {
        amount: 0,
        description: "Day Summary",
        title: tx.date.day,
        transactions: [],
      };
      monthGroup.days.push(dayGroup);
    }

    // Add transaction and update totals
    dayGroup.transactions.push(tx);
    dayGroup.amount += tx.amount;
    monthGroup.amount += tx.amount;
    yearGroup.amount += tx.amount;

    set({ data: updatedData });
    SecureStore.setItemAsync(
      APP_CONFIG.storage.storageAppData,
      JSON.stringify(updatedData)
    );
  },
}));
