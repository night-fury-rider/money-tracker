// This file is intended to serve as the single source of truth for all app level configurations.

const APP_CONFIG = {
  categories: [
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
  dateFormats: [
    {
      title: "DD-MMM-YYYY",
      value: "DD-MMM-YYYY",
    },
    {
      title: "YYYY-MM-DD",
      value: "YYYY-MM-DD",
    },
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  decimalPlaces: 2,
  font: {
    family: "IBM Plex Serif",
  },
  icons: ["cart", "car", "home", "flash", "movie", "cash", "heart", "star"],
  languages: [
    {
      title: "English",
      value: "en",
    },
  ],
  numberFormats: [
    {
      title: "Indian Format (en-IN)",
      value: "en-IN",
    },
    {
      title: "US Format (en-US)",
      value: "en-US",
    },
  ],
  routes: {
    home: "/",
    settings: "/settings",
  },
  storage: {
    catgories: "categories",
    storageAppData: "appData",
    storageCurrencyUnit: "currencyUnit",
    storageDateFormat: "dateFormat",
    storageLanguage: "language",
    storageNumberFormat: "numberFormat",
  },
};

export default APP_CONFIG;
