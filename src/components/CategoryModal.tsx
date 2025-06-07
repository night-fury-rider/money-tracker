import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Divider,
  List,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (category: string) => void;
}

const categories = [
  { label: "Groceries", icon: "cart" },
  { label: "Transport", icon: "car" },
  { label: "Rent", icon: "home" },
  { label: "Utilities", icon: "flash" },
  { label: "Entertainment", icon: "movie" },
];

const CategoryModal: React.FC<Props> = ({ visible, onDismiss, onSelect }) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
          Select Category
        </Text>
        <Divider />
        <ScrollView>
          {categories.map((item) => (
            <List.Item
              key={item.label}
              title={item.label}
              left={() => (
                <List.Icon icon={item.icon} color={theme.colors.primary} />
              )}
              onPress={() => {
                onSelect(item.label);
                onDismiss();
              }}
            />
          ))}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    alignSelf: "center",
  },
});

export default CategoryModal;
