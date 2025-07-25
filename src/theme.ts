import { MD3LightTheme } from "react-native-paper";

const calmBlueTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    disabledBackground: "#F0F0F0",
    disabledText: "#999999",
    primary: "#3A7CA5", // Main blue
    onPrimary: "#FFFFFF",
    background: "#F0F4F8", // Screen background
    surface: "#FFFFFF", // Card background
    surfaceVariant: "#E6EEF5", // input background in MD3
    onSurface: "#1E293B", // Input text color
    outline: "#B0BEC5", // Input border
    elevation: {
      level2: "#E1ECF4",
    },
    topTabs: {
      activeColor: "#6200ee",
      backgroundColor: "snow",
      inactiveColor: "#222",
      indicatorBackgroundColor: "#6200ee",
    },
  },
};

export default calmBlueTheme;
