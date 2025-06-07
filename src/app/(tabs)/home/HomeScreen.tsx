import { useTransactionStore } from "$/stores/transactionStore";
import calmBlueTheme from "$/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Card,
  FAB,
  List,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";

const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case "groceries":
      return "cart";
    case "transport":
      return "car";
    case "rent":
      return "home";
    case "utilities":
      return "flash";
    case "entertainment":
      return "movie";
    default:
      return "cash";
  }
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [monthData, setMonthData] = useState<IMonth | null>(null);
  const { data } = useTransactionStore();

  useEffect(() => {
    console.log(`New Data: ${JSON.stringify(data)}`);
    const now = new Date();
    const currentMonthName = now.toLocaleString("default", { month: "long" });
    const currentYear = now.getFullYear().toString();

    const yearData = (data as any[]).find((year) => year.title === currentYear);
    const thisMonth = yearData?.months.find(
      (month: IMonth) => month.title === currentMonthName
    );

    console.log(`yearData: ${JSON.stringify(yearData)}`);

    if (thisMonth) {
      const sortedDays = [...thisMonth.days].sort(
        (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
      );

      const sortedDaysWithSortedTx = sortedDays.map((day) => ({
        ...day,
        transactions: [...day.transactions].sort(
          (a, b) =>
            new Date(b.date.day).getTime() - new Date(a.date.day).getTime()
        ),
      }));

      setMonthData({
        ...thisMonth,
        days: sortedDaysWithSortedTx,
      });
    }
  }, [data]);

  const handleAddTransaction = () => {
    router.push("/(tabs)/home/AddTransactionScreen");
  };

  return (
    <PaperProvider theme={calmBlueTheme}>
      <View style={styles.screen}>
        <Appbar.Header elevated>
          <Appbar.Content
            title="Transactions"
            titleStyle={{ fontWeight: "600" }}
          />
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon="calendar" onPress={() => {}} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.container}>
          {monthData?.days.map((day) => (
            <Card key={day.title} style={styles.card} mode="elevated">
              <List.Item
                title={day.title}
                description={day.description}
                titleStyle={styles.cardTitle}
                descriptionStyle={styles.cardDescription}
                right={() => (
                  <Text
                    style={[
                      styles.amountText,
                      { color: calmBlueTheme.colors.primary },
                    ]}
                  >
                    ₹{day.amount}
                  </Text>
                )}
              />
              <View style={styles.transactionList}>
                {day.transactions.map((tx, idx) => (
                  <List.Item
                    key={idx}
                    title={tx.category}
                    description={tx.description}
                    titleStyle={styles.txTitle}
                    descriptionStyle={styles.txDescription}
                    left={() => (
                      <List.Icon icon={getCategoryIcon(tx.category)} />
                    )}
                    right={() => (
                      <Text
                        style={[
                          styles.txAmount,
                          { color: calmBlueTheme.colors.primary },
                        ]}
                      >
                        ₹{tx.amount}
                      </Text>
                    )}
                  />
                ))}
              </View>
            </Card>
          ))}
        </ScrollView>

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
