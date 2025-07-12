import TopTabs from "$/components/TopTabs/TopTabs";
import { ROUTES } from "$/constants/routes.constants";
import { HOME_SCREEN_STRS } from "$/constants/strings.constants";
import calmBlueTheme from "$/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Appbar, FAB, Provider as PaperProvider } from "react-native-paper";

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleAddTransaction = () => {
    router.push(ROUTES.addTransactionScreen);
  };

  return (
    <PaperProvider theme={calmBlueTheme}>
      <View style={styles.screen}>
        <Appbar.Header elevated>
          <Appbar.Content
            title={HOME_SCREEN_STRS.appbar.title}
            titleStyle={{ fontWeight: "600" }}
          />
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon="calendar" onPress={() => {}} />
        </Appbar.Header>

        <TopTabs />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleAddTransaction}
          color="#fff"
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { padding: 16, paddingBottom: 100 },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardDescription: { fontSize: 13, color: "#6B7280" },
  amountText: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 16,
    alignSelf: "center",
  },
  transactionList: { paddingHorizontal: 12, paddingBottom: 12 },
  txTitle: { fontSize: 15, fontWeight: "500" },
  txDescription: { fontSize: 12, color: "#6B7280" },
  txAmount: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",
    marginRight: 12,
  },
  loadingText: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#3A7CA5",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

export default HomeScreen;
