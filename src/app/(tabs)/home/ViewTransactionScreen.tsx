import APP_CONFIG from "$/constants/app.config.constants";
import { ROUTES } from "$/constants/routes.constants";
import {
  COMMON_STRS,
  VIEW_TRANSACTION_SCREEN_STRS,
} from "$/constants/strings.constants";
import { getCategoryIconMap } from "$/services/CategoryService";
import { formatDate } from "$/services/UtilService";
import { useTransactionStore } from "$/stores/transactionStore";
import { useCategoryStore } from "$/stores/useCategoryStore";
import calmBlueTheme from "$/theme";
import { ICategory, ICategoryIconMap } from "$/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const ViewTransactionScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { selectedCategory, setSelectedCategory, storeCategories } =
    useCategoryStore();
  const { addTransaction, deleteTransaction, updateTransaction } =
    useTransactionStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [category, setCategory] = useState<ICategory | null>(null);
  const [dateFormat, setDateFormat] = useState(APP_CONFIG.dateFormats[0].value);

  const [categoryIconMap, setCategoryIconMap] = useState<ICategoryIconMap>({});

  const [originalData, setOriginalData] = useState({
    amount: "",
    category: {
      name: "",
      icon: "",
    },
    date: new Date(),
    description: "",
  });
  console.log(`params.transaction: ${JSON.stringify(params.transaction)}`);

  console.log(`category: ${JSON.stringify(category)}`);

  useEffect(() => {
    const selectedTransaction = JSON.parse(params.transaction);
    const transactionDate = new Date(selectedTransaction.date.day);

    setDescription(selectedTransaction.description);
    setAmount(String(selectedTransaction.amount));
    setDate(transactionDate);
    setTransactionId(selectedTransaction.id);

    const catName = selectedTransaction.category;
    console.log(`catName: ${catName.toLowerCase()}`);
    const categoryObj = {
      name: catName,
      icon: categoryIconMap[catName.toLowerCase()] || "tag",
    };
    console.log(`categoryObj in 1: ${JSON.stringify(categoryObj)}`);
    setCategory(categoryObj);

    setOriginalData({
      description: selectedTransaction.description,
      amount: String(selectedTransaction.amount),
      category: categoryObj,
      date: transactionDate,
    });
  }, []);

  useEffect(() => {
    const loadFormat = async () => {
      const storedFormat = await SecureStore.getItemAsync(
        APP_CONFIG.storage.storageDateFormat
      );
      if (storedFormat) {
        setDateFormat(storedFormat);
      }
    };
    loadFormat();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (storeCategories) {
      const newCategoryMap = getCategoryIconMap(storeCategories);
      setCategoryIconMap(newCategoryMap);
      updateCategoryDetails(newCategoryMap);
    }
  }, [storeCategories]);

  useEffect(() => {
    if (params?.selectedCategory) {
      const selected = JSON.parse(params.selectedCategory as string);
      setCategory(selected);
    }
  }, [params?.selectedCategory]);

  const updateCategoryDetails = (latestCategoryIconMap: ICategoryIconMap) => {
    const selectedTransaction = JSON.parse(params.transaction);

    const catName = selectedTransaction.category;

    console.log(
      `latestCategoryIconMap 2: ${JSON.stringify(latestCategoryIconMap)}`
    );

    const categoryObj = {
      name: catName,
      icon: latestCategoryIconMap[catName.toLowerCase()] || "tag",
    };

    console.log(`categoryObj 2: ${JSON.stringify(categoryObj)}`);

    setCategory(categoryObj);

    setOriginalData({
      ...originalData,
      category: categoryObj,
    });
  };

  const formattedDate = formatDate({ date, format: dateFormat });

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

  const confirmDelete = () => {
    Alert.alert(
      VIEW_TRANSACTION_SCREEN_STRS.confirmDelete.title,
      VIEW_TRANSACTION_SCREEN_STRS.confirmDelete.message,
      [
        {
          text: VIEW_TRANSACTION_SCREEN_STRS.confirmDelete.cancelBtnLabel,
          style: "cancel",
        },
        {
          text: VIEW_TRANSACTION_SCREEN_STRS.confirmDelete.deleteBtnLabel,
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  };

  const handleDelete = () => {
    deleteTransaction({
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
      id: transactionId,
      title: description,
    });
    router.back();
  };

  const hasChanges = () => {
    return (
      description !== originalData.description ||
      amount !== originalData.amount ||
      category?.name !== originalData.category.name ||
      date.toString() !== originalData.date.toString()
    );
  };

  const handleSave = () => {
    setOriginalData({
      amount,
      category: category as ICategory,
      date,
      description,
    });

    setIsEditMode(false);

    const transactionObj = {
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
      id: transactionId,
      title: description,
    };

    // If date is changed, delete the transaction from old day group.
    if (date.toDateString() !== originalData.date.toDateString()) {
      deleteTransaction({
        ...transactionObj,
        date: {
          year: String(originalData.date.getFullYear()),
          month: originalData.date.toLocaleString("default", { month: "long" }),
          day: originalData.date.toISOString().split("T")[0],
        },
        dateStr:
          formatDate({ date: originalData.date, format: dateFormat }) || "",
        dateTimestamp: new Date(originalData.date).valueOf(),
      });
      addTransaction(transactionObj);
    } else {
      updateTransaction(transactionObj);
    }
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon={isEditMode ? "close" : "pencil"}
            onPress={() => setIsEditMode((prev) => !prev)}
          />
          <IconButton icon="delete" onPress={confirmDelete} />
        </View>
      ),
    });
  }, [isEditMode, category, description]);

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
          mode="outlined"
          style={[styles.input, isEditMode ? {} : styles.inputDisabled]}
          editable={isEditMode}
          onChangeText={setDescription}
        />
        <TextInput
          label="Amount"
          value={amount}
          mode="outlined"
          keyboardType="numeric"
          style={[styles.input, isEditMode ? {} : styles.inputDisabled]}
          editable={isEditMode}
          onChangeText={setAmount}
        />
        <TouchableOpacity
          disabled={!isEditMode}
          onPress={() => setShowDatePicker(true)}
        >
          <TextInput
            label="Date"
            value={formattedDate || ""}
            mode="outlined"
            editable={false}
            style={[styles.input, isEditMode ? {} : styles.inputDisabled]}
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
          disabled={!isEditMode}
          style={[
            styles.categoryButton,
            ,
            isEditMode ? {} : styles.inputDisabled,
          ]}
          onPress={openCategoryList}
        >
          <View style={styles.categoryTextWrapper}>
            {category?.icon ? (
              <IconButton
                icon={category.icon}
                size={28}
                iconColor={calmBlueTheme.colors.primary}
              />
            ) : null}

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

      {/* Save button appears only in edit mode and if values changed */}
      {isEditMode && hasChanges() && (
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
      )}
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
  inputDisabled: {
    backgroundColor: calmBlueTheme.colors.disabledBackground,
    color: calmBlueTheme.colors.disabledText,
  },
  categoryButton: {
    marginBottom: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: calmBlueTheme.colors.outline,
    backgroundColor: calmBlueTheme.colors.surface,
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

export default ViewTransactionScreen;
