import { ROUTES } from "$/constants/routes.constants";
import { useCategoryStore } from "$/stores/useCategoryStore";
import { ICategory } from "$/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, List, Text, useTheme } from "react-native-paper";

const initialCategories: ICategory[] = [
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
];

const CategoryListScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setSelectedCategory, storeCategories } = useCategoryStore();

  const [categories, setCategories] = useState<ICategory[]>(initialCategories);

  const handleSelect = (name: string, icon: string) => {
    setSelectedCategory({ name, icon });
    router.back();
  };

  const handleAddCategoryScreen = () => {
    router.push({
      pathname: ROUTES.addCategoryScreen,
      params: {
        existingCategories: JSON.stringify(categories),
      },
    });
  };

  useEffect(() => {
    if (storeCategories) {
      setCategories(storeCategories);
    }
  }, [storeCategories]);

  useFocusEffect(
    useCallback(() => {
      if (params?.newCategory) {
        try {
          const parsedCategory = JSON.parse(
            params.newCategory as string
          ) as ICategory;

          const newCategory = {
            name: parsedCategory.name,
            icon: parsedCategory.icon,
          };

          const alreadyExists = categories.some(
            (c) => c.name.toLowerCase() === parsedCategory.name.toLowerCase()
          );

          if (!alreadyExists) {
            if (parsedCategory.parent) {
              let tmpCategories = JSON.parse(JSON.stringify(categories));
              for (let i = 0; i < tmpCategories.length; i++) {
                if (parsedCategory.parent === tmpCategories[i].name) {
                  if (tmpCategories[i].subcategories?.length > 0) {
                    tmpCategories[i].subcategories?.push(newCategory);
                  } else {
                    tmpCategories[i].subcategories = [newCategory];
                  }
                  break;
                }
              }

              setCategories(tmpCategories);
            } else {
              setCategories((prev) => [...prev, parsedCategory]);
            }
          }
        } catch (e) {
          console.error("Invalid newCategory param:", e);
        }
      }
    }, [params?.newCategory])
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.listWrapper}>
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.card}>
            {/* Category Row */}
            <TouchableOpacity
              style={styles.categoryRow}
              onPress={() => handleSelect(cat.name, cat.icon)}
            >
              <List.Icon icon={cat.icon} style={styles.icon} />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>

            {/* Subcategories */}
            {cat.subcategories?.map((sub, subIdx) => (
              <TouchableOpacity
                key={subIdx}
                style={styles.subcategoryRow}
                onPress={() => handleSelect(sub.name, sub.icon)}
              >
                <List.Icon icon={sub.icon} style={styles.subIcon} />
                <Text style={styles.subcategoryText}>{sub.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* FAB to add new category */}
      <IconButton
        icon="plus"
        size={28}
        mode="contained"
        containerColor={theme.colors.primary}
        iconColor="white"
        style={styles.fab}
        onPress={handleAddCategoryScreen}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  categoryText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  subcategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 36,
    marginTop: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  subcategoryText: {
    fontSize: 15,
    color: "#555",
  },
  icon: {
    marginRight: 8,
  },
  subIcon: {
    marginRight: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
  },
});

export default CategoryListScreen;
