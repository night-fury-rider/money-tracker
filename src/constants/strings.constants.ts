// This file is intended to serve as the single source of truth for all strings/messages which are visible to user (including error messages)
// Prefer keeping strings inside appropriate module objects

const ADD_CATEGORY_SCREEN_STRS = {
  categoryInputLabel: "Category Name",
  iconPickerTitle: "Select an Icon",
  parentCategoryLabel: "Parent Category (optional)",
  primaryBtnLabel: "Add Category",
  title: "Add Category",
  cancel: "Cancel",
};
const ADD_TRANSACTION_SCREEN_STRS = {
  addCategoryOption: {
    categoryExists: "Category already exists",
    enterCategory: "Please enter a category name",
  },
  amount: "Amount",
  category: "Select Category",
  categoryParsingFailedFromParams: "Failed to parse categories from params",
  date: "Date",
  description: "Description",
  save: "Save",
  title: "Add Transaction",
};

const CATEGORY_LIST_SCREEN_STRS = {
  invalidNewCategoryParam: "Invalid newCategory param:",
  title: "Select Category",
};

const COMMON_STRS = {
  colorScheme: {
    light: "light",
    dark: "dark",
  },
  errorsMsg: {
    itemNotFound: "Unable to find the item",
    incorrectEmptySpacesFile: "Unnable to load Empty Spaces File",
  },
  permissions: {
    status: {
      granted: "granted",
      denied: "denied",
      never_ask_again: "never_ask_again",
    },
  },
  uncategorized: "Uncategorized",
};

const HOME_SCREEN_STRS = {
  appbar: {
    title: "Transactions",
  },
  comingSoon: "Dashboard data will appear here.",
  searchBox: {
    placeholder: "Search Item",
    noResults: "No Results",
  },
  noData: "No transactions",
};

const SETTINGS_TAB_STRS = {
  title: "Settings",
  appVersion: "App Version",
};

const VIEW_TRANSACTION_SCREEN_STRS = {
  title: "",
  confirmDelete: {
    cancelBtnLabel: "Cancel",
    deleteBtnLabel: "Delete",
    message: "Are you sure you want to delete this transaction?",
    title: "Delete",
  },
};

export {
  ADD_CATEGORY_SCREEN_STRS,
  ADD_TRANSACTION_SCREEN_STRS,
  CATEGORY_LIST_SCREEN_STRS,
  COMMON_STRS,
  HOME_SCREEN_STRS,
  SETTINGS_TAB_STRS,
  VIEW_TRANSACTION_SCREEN_STRS,
};
