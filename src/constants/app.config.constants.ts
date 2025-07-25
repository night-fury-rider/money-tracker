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
  currencies: [
    {
      title: "INR",
      value: "₹",
    },
    {
      title: "USD",
      value: "$",
    },
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
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  decimalPlaces: 2,
  font: {
    family: "IBM Plex Serif",
  },
  icons: [
    "car",
    "movie",
    "cash",
    "star",
    "hands-pray",
    "heart",
    "food-apple",
    "meditation",
    "hand-heart",
    "silverware-fork-knife",
    "cow",
    "hamburger",
    "gas-station",
    "cart",
    "ice-cream",
    "cookie",
    "fridge-outline",
    "cupcake",
    "silverware",
    "coffee",
    "carrot",
    "water",
    "doctor",
    "weight-lifter",
    "stethoscope",
    "shield-plus",
    "ambulance",
    "microscope",
    "hand-wash",
    "pill",
    "soccer",
    "home",
    "hammer-wrench",
    "lamp",
    "sofa",
    "screwdriver",
    "cog",
    "broom",
    "flash",
    "cube-outline",
    "wall",
  ],
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
  yearRange: 5,
};

export default APP_CONFIG;
