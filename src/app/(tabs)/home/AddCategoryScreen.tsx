import { useCategoryStore } from "$/stores/useCategoryStore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  List,
  Modal,
  Provider as PaperProvider,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

// TODO: Move the interface to types.ts
interface Category {
  name: string;
  icon: string;
  parent?: string;
}

const allIcons = [
  "cart",
  "car",
  "home",
  "flash",
  "movie",
  "cash",
  "heart",
  "star",
];

const AddCategoryScreen = () => {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { setNewCategory } = useCategoryStore();

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  useEffect(() => {
    if (params.existingCategories) {
      try {
        const parsed = JSON.parse(
          params.existingCategories as string
        ) as Category[];
        setAllCategories(parsed);
      } catch (e) {
        console.error("Failed to parse categories from params", e);
      }
    }
  }, [params.existingCategories]);

  const handleParentCategoryChange = (text: string) => {
    setParentCategory(text);

    if (text.trim().length === 0) {
      setFilteredCategories([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredCategories(filtered);
    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion: Category) => {
    setParentCategory(suggestion.name);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const openIconPicker = () => setIconPickerVisible(true);

  const selectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setIconPickerVisible(false);
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (
      allCategories.some(
        (c) => c.name.toLowerCase() === categoryName.trim().toLowerCase()
      )
    ) {
      alert("Category already exists");
      return;
    }

    setNewCategory({
      name: categoryName,
      icon: selectedIcon || "label",
      parent: parentCategory.trim() || undefined,
    });

    router.back();
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Category</Text>

        <TextInput
          label="Category Name"
          mode="outlined"
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
          autoCapitalize="words"
        />

        <TextInput
          label="Parent Category (optional)"
          mode="outlined"
          value={parentCategory}
          onChangeText={handleParentCategoryChange}
          style={styles.input}
          onFocus={() => setShowSuggestions(filteredCategories.length > 0)}
        />

        {showSuggestions && filteredCategories.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={filteredCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectSuggestion(item)}
                  style={styles.suggestionItem}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <Button
          mode="outlined"
          icon={selectedIcon || "tag"}
          onPress={openIconPicker}
          style={styles.iconButton}
        >
          {selectedIcon ? `Icon: ${selectedIcon}` : "Select Icon"}
        </Button>

        <Button
          mode="contained"
          onPress={handleAddCategory}
          style={styles.addButton}
        >
          Add Category
        </Button>

        <Portal>
          <Modal
            visible={iconPickerVisible}
            onDismiss={() => setIconPickerVisible(false)}
            contentContainerStyle={styles.iconPickerModal}
          >
            <Text style={styles.iconPickerTitle}>Select an Icon</Text>
            <FlatList
              data={allIcons}
              keyExtractor={(item) => item}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.iconOption}
                  onPress={() => selectIcon(item)}
                >
                  <List.Icon icon={item} />
                </TouchableOpacity>
              )}
            />
            <Button onPress={() => setIconPickerVisible(false)}>Cancel</Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#3A7CA5",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  suggestionsContainer: {
    maxHeight: 120,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 6,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  iconButton: {
    marginBottom: 24,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#3A7CA5",
  },
  iconPickerModal: {
    backgroundColor: "white",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 8,
    maxHeight: "80%",
  },
  iconPickerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#3A7CA5",
  },
  iconOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});

export default AddCategoryScreen;
