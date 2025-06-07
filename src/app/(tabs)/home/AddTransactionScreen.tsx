import APP_CONFIG from "$/constants/app.config.constants";
import { formatDate } from "$/services/UtilService";
import { useTransactionStore } from "$/stores/transactionStore";
import { useCategoryStore } from "$/stores/useCategoryStore";
import calmBlueTheme from "$/theme";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";

interface Category {
  name: string;
  icon: string;
}

const AddTransactionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { addTransaction } = useTransactionStore();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<Category | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFormat, setDateFormat] = useState(APP_CONFIG.dateFormats[0].value);

  // Load date format from SecureStore
  const getDateFormat = async () => {
    const storedFormat = await SecureStore.getItemAsync(
      APP_CONFIG.storage.storageDateFormat
    );
    if (storedFormat) {
      setDateFormat(storedFormat);
    } else {
      setDateFormat(APP_CONFIG.dateFormats[0].value);
      await SecureStore.setItemAsync(
        APP_CONFIG.storage.storageDateFormat,
        APP_CONFIG.dateFormats[0].value
      );
    }
  };

  useEffect(() => {
    getDateFormat();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (params?.selectedCategory) {
      const selected = JSON.parse(params.selectedCategory as string);
      setCategory(selected);
    }
  }, [params?.selectedCategory]);

  const formattedDate = formatDate({ date, format: dateFormat });

  const handleSave = () => {
    addTransaction({
      amount: parseFloat(amount),
      category: selectedCategory?.name || "Uncategorized",
      date: {
        year: String(date.getFullYear()),
        month: date.toLocaleString("default", { month: "long" }),
        day: date.toISOString().split("T")[0],
      },
      description,
      title: description,
    });

    setSelectedCategory(null);
    router.back();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const openCategoryList = () => {
    router.push({
      pathname: "/(tabs)/home/CategoryListScreen",
      params: {
        description,
        amount,
        date: date.toISOString(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <View style={styles.topMargin} />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            label="Date"
            value={formattedDate || ""}
            mode="outlined"
            editable={false}
            style={styles.input}
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Category Select */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            {
              backgroundColor: calmBlueTheme.colors.surface,
              borderColor: calmBlueTheme.colors.outline,
            },
          ]}
          onPress={openCategoryList}
        >
          <View style={styles.categoryTextWrapper}>
            <IconButton
              icon={category ? category.icon : "tag"}
              size={28}
              iconColor={calmBlueTheme.colors.primary}
            />
            <Text
              style={[
                styles.categoryText,
                { color: calmBlueTheme.colors.onSurface },
              ]}
            >
              {category ? category.name : "Select Category"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <View style={styles.saveButtonWrapper}>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!description || !amount || !category}
          style={[
            styles.saveButton,
            (!description || !amount || !category) && styles.disabledButton,
          ]}
        >
          Save
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: calmBlueTheme.colors.background,
    paddingHorizontal: 20,
  },
  topMargin: {
    height: 15,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 15,
    backgroundColor: calmBlueTheme.colors.surfaceVariant,
    borderRadius: 8,
    height: 55,
  },
  categoryButton: {
    marginBottom: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  categoryTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  saveButtonWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    borderRadius: 8,
    backgroundColor: calmBlueTheme.colors.primary,
  },
  disabledButton: {
    backgroundColor: calmBlueTheme.colors.outline,
  },
});

export default AddTransactionScreen;
