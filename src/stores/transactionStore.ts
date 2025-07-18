import APP_CONFIG from "$/constants/app.config.constants";
import { getDateKey, getMonthKey } from "$/services/DateService";
import { ITransaction, IYearGroup } from "$/types";
import { create } from "zustand";
import StorageService from "./StorageService";

interface ITransactionStore {
  addTransaction: (tx: ITransaction) => void;
  data: IYearGroup[];
  deleteTransaction: (tx: ITransaction) => void;
  updateTransaction: (tx: ITransaction) => void;
}

export const useTransactionStore = create<ITransactionStore>((set, get) => ({
  data: [],

  addTransaction: (tx: ITransaction) => {
    // console.log(`addTransaction transaction: ${JSON.stringify(tx)}`);

    const transactionDate = new Date(tx.dateTimestamp);
    const transactionYear = transactionDate?.getFullYear();
    const transactionMonth = transactionDate?.getMonth() + 1;

    const updatedData = [...get().data];

    // Find or create year group
    let yearGroup = updatedData.find((y) => y.title === tx.date.year);

    if (!yearGroup) {
      yearGroup = {
        amount: 0,
        description: `${transactionYear}`,
        id: `${transactionYear}`,
        months: [],
        title: `${transactionYear}`,
      };
      updatedData.push(yearGroup);
    }

    // Find or create month group
    let monthGroup = yearGroup.months.find((m) => m.title === tx.date.month);
    if (!monthGroup) {
      monthGroup = {
        amount: 0,
        days: [],
        description: `${transactionMonth}`,
        id: getMonthKey(transactionDate),
        title: tx.date.month,
      };
      yearGroup.months.push(monthGroup);
    }

    // Find or create day group
    let dayGroup = monthGroup.days.find((d) => d.title === tx.dateStr);
    if (!dayGroup) {
      dayGroup = {
        amount: 0,
        dateTimestamp: tx.dateTimestamp,
        description: APP_CONFIG.dayNames[transactionDate.getDay()],
        id: getDateKey(transactionDate),
        title: tx.dateStr,
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

    StorageService.setItem(
      APP_CONFIG.storage.storageAppData,
      JSON.stringify(updatedData)
    );
  },
  deleteTransaction: (tx: ITransaction) => {
    // console.log(`deleteTransaction transaction: ${JSON.stringify(tx)}`);

    const transactionDate = new Date(tx.dateTimestamp);
    const transactionYear = transactionDate?.getFullYear();
    const transactionMonth = transactionDate?.getMonth() + 1;

    const updatedData = [...get().data];

    // Find or create year group
    let yearGroup = updatedData.find((y) => y.title === tx.date.year);
    if (!yearGroup) {
      yearGroup = {
        amount: 0,
        description: `${transactionYear}`,
        id: `${transactionYear}`,
        months: [],
        title: `${transactionYear}`,
      };
      updatedData.push(yearGroup);
    }

    // Find or create month group
    let monthGroup = yearGroup.months.find((m) => m.title === tx.date.month);
    if (!monthGroup) {
      monthGroup = {
        amount: 0,
        days: [],
        description: `${transactionMonth}`,
        id: getMonthKey(transactionDate),
        title: tx.date.month,
      };
      yearGroup.months.push(monthGroup);
    }

    // Find or create day group
    let dayIndex = monthGroup.days.findIndex((d) => d.title === tx.dateStr);
    let dayGroup = monthGroup.days[dayIndex];

    if (!dayGroup) {
      dayGroup = {
        amount: 0,
        dateTimestamp: tx.dateTimestamp,
        description: APP_CONFIG.dayNames[transactionDate.getDay()],
        id: getDateKey(transactionDate),
        title: tx.dateStr,
        transactions: [],
      };
      monthGroup.days.push(dayGroup);
    }

    let transactionIndex = dayGroup.transactions.findIndex(
      (obj) => obj.id === tx.id
    );

    let correctionAmount = dayGroup.transactions[transactionIndex].amount;

    dayGroup.transactions.splice(transactionIndex, 1);

    dayGroup.amount -= correctionAmount;
    monthGroup.amount -= correctionAmount;
    yearGroup.amount -= correctionAmount;

    if (dayGroup.transactions.length === 0) {
      monthGroup.days.splice(dayIndex, 1);
    }

    set({ data: updatedData });

    StorageService.setItem(
      APP_CONFIG.storage.storageAppData,
      JSON.stringify(updatedData)
    );
  },
  updateTransaction: (tx: ITransaction) => {
    // console.log(`updateTransaction transaction: ${JSON.stringify(tx)}`);

    const transactionDate = new Date(tx.dateTimestamp);
    const transactionYear = transactionDate?.getFullYear();
    const transactionMonth = transactionDate?.getMonth() + 1;

    const updatedData = [...get().data];

    // Find or create year group
    let yearGroup = updatedData.find((y) => y.title === tx.date.year);
    if (!yearGroup) {
      yearGroup = {
        amount: 0,
        description: `${transactionYear}`,
        id: `${transactionYear}`,
        months: [],
        title: `${transactionYear}`,
      };
      updatedData.push(yearGroup);
    }

    // Find or create month group
    let monthGroup = yearGroup.months.find((m) => m.title === tx.date.month);
    if (!monthGroup) {
      monthGroup = {
        amount: 0,
        days: [],
        description: `${transactionMonth}`,
        id: getMonthKey(transactionDate),
        title: tx.date.month,
      };
      yearGroup.months.push(monthGroup);
    }

    // Find or create day group
    let dayGroup = monthGroup.days.find((d) => d.title === tx.dateStr);

    if (!dayGroup) {
      dayGroup = {
        amount: 0,
        dateTimestamp: tx.dateTimestamp,
        description: APP_CONFIG.dayNames[transactionDate.getDay()],
        id: getDateKey(transactionDate),
        title: tx.dateStr,
        transactions: [],
      };
      monthGroup.days.push(dayGroup);
    }

    let existingTransaction = dayGroup.transactions.find(
      (obj) => obj.id === tx.id
    );

    if (existingTransaction) {
      const difference = tx.amount - existingTransaction.amount;
      dayGroup.amount += difference;
      monthGroup.amount += difference;
      yearGroup.amount += difference;

      existingTransaction.amount = tx.amount;
      existingTransaction.category = tx.category;
      existingTransaction.date = tx.date;
      existingTransaction.description = tx.description;
      existingTransaction.title = tx.title;
    }

    set({ data: updatedData });

    StorageService.setItem(
      APP_CONFIG.storage.storageAppData,
      JSON.stringify(updatedData)
    );
  },
}));
