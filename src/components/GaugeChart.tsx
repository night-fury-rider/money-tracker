import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface GaugeChartProps {
  value: number; // Value to display on the gauge (0-100)
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value }) => {
  const radius = 100; // The radius of the circle
  const strokeWidth = 20; // The width of the stroke
  const center = radius + strokeWidth; // Center of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle

  // Calculate the stroke dashoffset based on the value (0-100)
  const offset = circumference - (value / 100) * circumference;

  // Define the angle (0 to 180 degrees) for the speedometer arc
  const angle = 180;
  const rotationAngle = angle / 2 - 90; // To start from 0 on the left (0 degrees)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speedometer</Text>
      <Svg height={center * 2} width={center * 2}>
        <G rotation={rotationAngle} origin={center}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={value > 50 ? "#00FF00" : "#FF0000"} // Color changes based on value
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </G>
      </Svg>
      <Text style={styles.value}>{value}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  value: {
    fontSize: 30,
    marginTop: 10,
  },
});

export default GaugeChart;
