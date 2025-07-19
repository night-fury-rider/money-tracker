import APP_CONFIG from "$/constants/app.config.constants";
import { ROUTES } from "$/constants/routes.constants";
import {
  ADD_TRANSACTION_SCREEN_STRS,
  COMMON_STRS,
} from "$/constants/strings.constants";
import { formatDate } from "$/services/DateService";
import StorageService from "$/stores/StorageService";
import { useTransactionStore } from "$/stores/transactionStore";
import { useCategoryStore } from "$/stores/useCategoryStore";
import calmBlueTheme from "$/theme";
import { ICategory, ITransaction } from "$/types";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";

const AddTransactionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { addTransaction, data: transactionData } = useTransactionStore();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<ICategory | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFormat, setDateFormat] = useState(APP_CONFIG.dateFormats[0].value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsCount, setSuggestionsCount] = useState(5);

  const suggestions = useMemo(() => {
    if (!description || description.length < 1) return [];
    const allTransactions: ITransaction[] = transactionData.flatMap((year) =>
      year.months.flatMap((month) =>
        month.days.flatMap((day) => day.transactions)
      )
    );

    const lowerDesc = description.toLowerCase();
    const unique = new Map<string, ITransaction>();

    allTransactions.forEach((tx) => {
      const match = tx.description.toLowerCase().includes(lowerDesc);
      if (match && !unique.has(tx.description)) {
        unique.set(tx.description, tx);
      }
    });

    const result = Array.from(unique.values()).slice(0, 5);

    setSuggestionsCount(result.length >= 5 ? 5 : result.length);

    return result;
  }, [description, transactionData]);

  // Load date format from Storage
  const getDateFormat = async () => {
    const storedFormat = await StorageService.getItem(
      APP_CONFIG.storage.storageDateFormat
    );
    if (storedFormat) {
      setDateFormat(storedFormat);
    } else {
      setDateFormat(APP_CONFIG.dateFormats[0].value);
      await StorageService.setItem(
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
      category: category?.name || COMMON_STRS.uncategorized,
      date: {
        year: String(date.getFullYear()),
        month: date.toLocaleString("default", { month: "long" }),
        day: date.toISOString().split("T")[0],
      },
      dateStr: formattedDate || "",
      dateTimestamp: new Date(date).valueOf(),
      description,
      id: Date.now().toString(),
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
      pathname: ROUTES.categoryListScreen,
      params: {
        description,
        amount,
        date: date.toISOString(),
      },
    });
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    setShowSuggestions(true);
  };

  const handleSuggestionPress = (tx: ITransaction) => {
    setDescription(tx.description);
    setAmount(String(tx.amount));
    setCategory({ name: tx.category, icon: "tag" });
    setShowSuggestions(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <View style={styles.topMargin} />
        <TextInput
          label={ADD_TRANSACTION_SCREEN_STRS.description}
          value={description}
          onChangeText={handleDescriptionChange}
          mode="outlined"
          style={styles.input}
        />
        {showSuggestions && suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item.description}</Text>
                <Text style={styles.suggestionAmount}>
                  {APP_CONFIG.currencies[0].value}
                  {item.amount}
                </Text>
              </TouchableOpacity>
            )}
            style={[
              styles.suggestionList,
              { maxHeight: suggestionsCount * 50 },
            ]}
            keyboardShouldPersistTaps="handled"
          />
        )}
        <TextInput
          label={ADD_TRANSACTION_SCREEN_STRS.amount}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            label={ADD_TRANSACTION_SCREEN_STRS.date}
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
              {category ? category.name : ADD_TRANSACTION_SCREEN_STRS.category}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

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
          {ADD_TRANSACTION_SCREEN_STRS.save}
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
  suggestionList: {
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
    height: 50,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  suggestionAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: calmBlueTheme.colors.primary,
  },
});

export default AddTransactionScreen;
