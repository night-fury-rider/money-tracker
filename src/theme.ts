import { MD3LightTheme } from "react-native-paper";

const calmBlueTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
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
  },
};

export default calmBlueTheme;
