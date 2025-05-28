import { Dimensions, StyleSheet, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const value = 70; // The value to display on the gauge (0-100)

  return (
    <SafeAreaView style={styles.container}>
      {/* <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Yuvraj is working on it</ThemedText>
      </ThemedView> */}
      {/* <BMIChart value={25} /> */}

      {/* Gemini */}
      {/*  <BMIChart
        value={32}
        minValue={15}
        maxValue={50}
        segmentRanges={[18.5, 25, 30, 35, 40]}
        segmentColors={[
          "lightblue",
          "lightgreen",
          "lightcoral",
          "orange",
          "darkorange",
          "red",
        ]}
        segmentLabels={[
          "Underweight",
          "Normal",
          "Overweight",
          "Obese Cat 1",
          "Obese Cat 2",
          "Obese Cat 3",
        ]}
      /> */}

      <Text>dad</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
