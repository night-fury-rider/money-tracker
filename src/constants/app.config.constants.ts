// This file is intended to serve as the single source of truth for all app level configurations.

const APP_CONFIG = {
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
  decimalPlaces: 2,
  font: {
    family: "IBM Plex Serif",
  },
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
