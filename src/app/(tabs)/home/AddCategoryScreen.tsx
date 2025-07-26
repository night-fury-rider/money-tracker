import APP_CONFIG from "$/constants/app.config.constants";
import {
  ADD_CATEGORY_SCREEN_STRS,
  ADD_TRANSACTION_SCREEN_STRS,
} from "$/constants/strings.constants";
import { useCategoryStore } from "$/stores/useCategoryStore";
import { ICategory } from "$/types";
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

const AddCategoryScreen = () => {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { setNewCategory } = useCategoryStore();

  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  useEffect(() => {
    if (params.existingCategories) {
      try {
        const parsed = JSON.parse(
          params.existingCategories as string
        ) as ICategory[];
        setAllCategories(parsed);
      } catch (e) {
        console.error(
          ADD_TRANSACTION_SCREEN_STRS.categoryParsingFailedFromParams,
          e
        );
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

  const selectSuggestion = (suggestion: ICategory) => {
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
      alert(ADD_TRANSACTION_SCREEN_STRS.addCategoryOption.enterCategory);
      return;
    }

    if (
      allCategories.some(
        (c) => c.name.toLowerCase() === categoryName.trim().toLowerCase()
      )
    ) {
      alert(ADD_TRANSACTION_SCREEN_STRS.addCategoryOption.categoryExists);
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
        <TextInput
          label={ADD_CATEGORY_SCREEN_STRS.categoryInputLabel}
          mode="outlined"
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
          autoCapitalize="words"
        />

        <TextInput
          label={ADD_CATEGORY_SCREEN_STRS.parentCategoryLabel}
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
          {ADD_CATEGORY_SCREEN_STRS.primaryBtnLabel}
        </Button>

        <Portal>
          <Modal
            visible={iconPickerVisible}
            onDismiss={() => setIconPickerVisible(false)}
            contentContainerStyle={styles.iconPickerModal}
          >
            <Text style={styles.iconPickerTitle}>
              {ADD_CATEGORY_SCREEN_STRS.iconPickerTitle}
            </Text>
            <FlatList
              data={APP_CONFIG.icons}
              keyExtractor={(item) => item}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.iconOption}
                  onPress={() => selectIcon(item)}
                >
                  <List.Icon icon={item} style={styles.icon} />
                </TouchableOpacity>
              )}
            />
            <Button onPress={() => setIconPickerVisible(false)}>
              {ADD_CATEGORY_SCREEN_STRS.cancel}
            </Button>
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
  icon: {
    marginVertical: 0,
    transform: [{ scale: 1.5 }],
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
