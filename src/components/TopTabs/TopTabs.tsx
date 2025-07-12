import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Card, List } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";

import APP_CONFIG from "$/constants/app.config.constants";
import { ROUTES } from "$/constants/routes.constants";
import { getCategoryIconMap } from "$/services/CategoryService";
import { getMonthKey } from "$/services/DateService";
import { useTransactionStore } from "$/stores/transactionStore";
import { useCategoryStore } from "$/stores/useCategoryStore";
import calmBlueTheme from "$/theme";
import EmptyTab from "./EmptyTab";
import { generateRoutesForPastYears } from "./TopTabsService";

const TopTabs = () => {
  const layout = useWindowDimensions();
  const router = useRouter();
  const todayDate = new Date();

  const { data } = useTransactionStore();
  const { storeCategories } = useCategoryStore();
  const categoryIconMap = useMemo(
    () => getCategoryIconMap(storeCategories),
    [storeCategories]
  );

  const routes = useMemo(
    () => generateRoutesForPastYears(APP_CONFIG.yearRange),
    []
  );
  const currentMonthKey = getMonthKey(todayDate);
  const initialIndex = routes.findIndex((r) => r.key === currentMonthKey);
  const [index, setIndex] = useState(
    initialIndex >= 0 ? initialIndex : routes.length - 1
  );

  const currency = APP_CONFIG.currencies[0].value;

  const renderScene = ({ route }: { route: { key: string } }) => {
    const [yearStr, monthStr] = route.key.split("-");
    const yearGroup = data.find((y) => y.title === yearStr);
    const monthName = APP_CONFIG.monthNames[parseInt(monthStr, 10) - 1];
    const monthGroup = yearGroup?.months.find((m) => m.title === monthName);

    if (!monthGroup) {
      return <EmptyTab />;
    }

    const sortedDays = [...monthGroup.days]
      .sort((a, b) => b.dateTimestamp - a.dateTimestamp)
      .map((day) => ({
        ...day,
        transactions: [...day.transactions].sort(
          (a, b) => b.dateTimestamp - a.dateTimestamp
        ),
      }));

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedDays.map((day) => (
          <Card key={day.title} style={styles.card} mode="elevated">
            <List.Item
              title={day.title}
              description={day.description}
              titleStyle={styles.cardTitle}
              descriptionStyle={styles.cardDescription}
              right={() => (
                <Text style={styles.amountText}>
                  {currency}
                  {day.amount}
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
                    <List.Icon
                      icon={categoryIconMap[tx.category.toLowerCase()]}
                    />
                  )}
                  right={() => (
                    <Text
                      style={[
                        styles.txAmount,
                        { color: calmBlueTheme.colors.primary },
                      ]}
                    >
                      {currency}
                      {tx.amount}
                    </Text>
                  )}
                  onPress={() =>
                    router.push({
                      pathname: ROUTES.viewTransactionScreen,
                      params: {
                        transaction: JSON.stringify(tx),
                      },
                    })
                  }
                />
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled
      lazy
      style={{ flex: 1 }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={{
            backgroundColor:
              calmBlueTheme.colors.topTabs.indicatorBackgroundColor,
          }}
          style={{
            backgroundColor: calmBlueTheme.colors.topTabs.backgroundColor,
          }}
          activeColor={calmBlueTheme.colors.topTabs.activeColor}
          inactiveColor={calmBlueTheme.colors.topTabs.inactiveColor}
          tabStyle={{ width: layout.width / 3 }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
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
});

export default TopTabs;
