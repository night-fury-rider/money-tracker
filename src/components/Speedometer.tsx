import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";

interface SpeedometerProps {
  value: number; // The value to display on the gauge (0-100)
}

const Speedometer: React.FC<SpeedometerProps> = ({ value }) => {
  const radius = 100; // Radius of the gauge
  const strokeWidth = 25; // Stroke width of the arc and needle
  const center = radius + strokeWidth; // Center of the circle
  const angleRange = 180; // The angle range of the gauge (from -90 to 90)
  const angleStep = angleRange / 6; // Dividing the 180 degrees into 6 segments

  // Define segment colors (Underweight, Normal, Overweight, etc.)
  const segmentColors = [
    "#00BFFF", // Underweight
    "#00FF00", // Normal
    "#FFFF00", // Overweight
    "#FF8C00", // Obese Category 1
    "#FF4500", // Obese Category 2
    "#FF0000", // Obese Category 3
  ];

  // Calculate the rotation angle of the needle
  const needleAngle = -90 + (value / 100) * angleRange;

  // Function to create a path for each segment (arc)
  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const startX = center + radius * Math.cos((Math.PI / 180) * startAngle);
    const startY = center + radius * Math.sin((Math.PI / 180) * startAngle);
    const endX = center + radius * Math.cos((Math.PI / 180) * endAngle);
    const endY = center + radius * Math.sin((Math.PI / 180) * endAngle);

    return `M ${center},${center} L ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY} Z`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body Mass Index (BMI) Gauge</Text>
      <Svg height={center * 2} width={center * 2}>
        {/* Draw segments */}
        {segmentColors.map((color, index) => {
          const startAngle = index * angleStep - 90;
          const endAngle = (index + 1) * angleStep - 90;
          return (
            <Path
              key={index}
              d={createSegmentPath(startAngle, endAngle)}
              fill={color}
            />
          );
        })}

        {/* Draw the needle */}
        <G rotation={needleAngle} origin={`${center},${center}`}>
          <Path
            d={`M${center},${center} L${center},${
              center - radius - strokeWidth
            }`}
            stroke="#000"
            strokeWidth={5}
            fill="none"
          />
        </G>

        {/* Draw the circle for the gauge */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ddd"
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>

      {/* Value Display */}
      <Text style={styles.value}>{value}</Text>
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
    fontSize: 40,
    marginTop: 20,
  },
});

export default Speedometer;
