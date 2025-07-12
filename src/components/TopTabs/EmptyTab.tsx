import { HOME_SCREEN_STRS } from "$/constants/strings.constants";
import { StyleSheet, Text, View } from "react-native";

const EmptyTab = () => {
  return (
    <View style={styles.center}>
      <Text>{HOME_SCREEN_STRS.noData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmptyTab;
