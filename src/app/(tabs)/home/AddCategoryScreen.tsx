import APP_CONFIG from "$/constants/app.config.constants";
import { ADD_CATEGORY_SCREEN_STRS } from "$/constants/strings.constants";
import { useCategoryStore } from "$/stores/useCategoryStore";
import calmBlueTheme from "$/theme";
import { ICategory } from "$/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  IconButton,
  Modal,
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
  const [selectedParent, setSelectedParent] = useState<ICategory | null>(null);
  const [showParentPicker, setShowParentPicker] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState<string>("label");
  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  useEffect(() => {
    if (params.existingCategories) {
      try {
        const parsed = JSON.parse(
          params.existingCategories as string
        ) as ICategory[];
        setAllCategories(parsed);
      } catch (e) {
        console.error("Failed to parse existing categories", e);
      }
    }
  }, [params.existingCategories]);

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      alert("Please enter category name");
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
      name: categoryName.trim(),
      icon: selectedIcon || "label",
      parent: selectedParent?.name,
    });

    router.back();
  };

  /**
   * New category name should not be
   *  - same as existing one.
   *  - less than 3 characters
   */
  const hasValidCategoryName = () => {
    // New category name should not be same as existing one.
    for (const category of allCategories) {
      if (category.name === categoryName) {
        return false;
      }
    }

    return categoryName.length > 2;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.inputWrapper}>
            <IconButton
              icon={selectedIcon}
              size={28}
              onPress={() => setIconPickerVisible(true)}
              style={styles.iconButton}
            />
            <TextInput
              label={ADD_CATEGORY_SCREEN_STRS.categoryInputLabel}
              mode="outlined"
              value={categoryName}
              onChangeText={setCategoryName}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[styles.dropdown, {}]}
            onPress={() => setShowParentPicker(true)}
          >
            <Text variant="bodyLarge">
              {selectedParent
                ? selectedParent.name
                : ADD_CATEGORY_SCREEN_STRS.parentCategoryLabel}
            </Text>

            {selectedParent ? (
              <IconButton
                icon={"close"}
                size={24}
                onPress={() => setSelectedParent(null)}
                style={[styles.iconButton, styles.iconClose]}
              />
            ) : (
              <IconButton
                icon={"chevron-down"}
                size={24}
                style={styles.iconButton}
              />
            )}
          </TouchableOpacity>

          {/* Save button appears only in edit mode and if values changed */}
          {
            <Button
              mode="contained"
              onPress={handleAddCategory}
              disabled={!hasValidCategoryName()}
              style={[
                styles.saveButton,
                !hasValidCategoryName() && styles.disabledButton,
              ]}
            >
              {ADD_CATEGORY_SCREEN_STRS.primaryBtnLabel}
            </Button>
          }
        </Card.Content>
      </Card>

      {/* Parent Category Modal */}
      <Portal>
        <Modal
          visible={showParentPicker}
          onDismiss={() => setShowParentPicker(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            {ADD_CATEGORY_SCREEN_STRS.parentCategoryModalLabel}
          </Text>
          <FlatList
            data={allCategories}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setSelectedParent(item);
                  setShowParentPicker(false);
                }}
              >
                <IconButton
                  icon={item.icon || "label"}
                  size={20}
                  style={styles.iconButtonInModal}
                />
                <Text style={{ marginLeft: 10 }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
      </Portal>

      {/* Icon Picker */}
      <Portal>
        <Modal
          visible={iconPickerVisible}
          onDismiss={() => setIconPickerVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            {ADD_CATEGORY_SCREEN_STRS.iconPickerTitle}
          </Text>
          <FlatList
            data={APP_CONFIG.icons}
            numColumns={4}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.iconGridItem}
                onPress={() => {
                  setSelectedIcon(item);
                  setIconPickerVisible(false);
                }}
              >
                <IconButton icon={item || "label"} size={30} />
              </TouchableOpacity>
            )}
          />
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  previewIcon: {
    marginRight: 10,
    color: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  iconButton: {
    marginVertical: 10,
    borderWidth: 2,
  },
  iconButtonInModal: {
    borderWidth: 2,
  },
  iconClose: {
    borderWidth: 0,
  },
  addButton: {
    marginTop: 20,
  },
  modal: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    marginBottom: 10,
    fontWeight: "600",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconGridItem: {
    flex: 1 / 4,
    alignItems: "center",
    marginVertical: 12,
  },

  saveButton: {
    borderRadius: 8,
    backgroundColor: calmBlueTheme.colors.primary,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: calmBlueTheme.colors.outline,
  },
});

export default AddCategoryScreen;
