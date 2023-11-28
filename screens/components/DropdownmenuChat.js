import React, { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { StyleSheet, View, Modal, Text, Pressable } from "react-native";
import { selectChat, toggleChatAgent } from "../../redux/Slices/chatsSlice";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../../redux/store";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export function DropdownMenu({ navigation, chatId }) {
  const [visible, setVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const showProfileModal = () => {
    setProfileModalVisible(true);
  };

  const hideProfileModal = () => {
    setProfileModalVisible(false);
  };

  const dispatch = useAppDispatch();

  const chat = useSelector((state: RootState) => selectChat(state, chatId));
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <View
      style={{
        paddingTop: 0,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
       <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={hideProfileModal} // Esto es requerido en Android
      >
        <StyledView className="flex-1 justify-center items-center mt-5">
          <StyledView className="m-5 bg-white rounded-xl p-9 items-center shadow-lg">
            <StyledText className="mb-4 text-left text-md">Nombre: {chat?.displayName}</StyledText>
            <StyledText className="mb-4 text-left text-md">Correo: {chat?.email}</StyledText>
            <StyledPressable
              className="rounded-xl p-2 mt-4 bg-blue-500"
              onPress={hideProfileModal}
            >
              <StyledText className="text-white font-bold text-center">Cerrar</StyledText>
            </StyledPressable>
          </StyledView>
        </StyledView>
      </Modal>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton icon="dots-vertical" size={24} onPress={openMenu} />
        }
        contentStyle={styles.contentStyle} // Estilo aplicado al contenedor del menú
      >
        <Menu.Item
          leadingIcon="account"
          onPress={() => {
            console.log("Option 1 pressed");
            showProfileModal();
            closeMenu();
          }}
          title="Perfil"
          style={styles.menuItem} // Estilo aplicado a este ítem de menú
        />
        {chat?.agent ? (
          <Menu.Item
            leadingIcon="account-check"
            onPress={() => {
              dispatch<any>(toggleChatAgent(chatId));
              closeMenu();
            }}
            title="Asignar AI"
            style={styles.menuItem} // Estilo aplicado a este ítem de menú
          />
        ) : (
          <Menu.Item
            leadingIcon="account-check"
            onPress={() => {
              dispatch<any>(toggleChatAgent(chatId));
              closeMenu();
            }}
            title="Tomar chat"
            style={styles.menuItem} // Estilo aplicado a este ítem de menú
          />
        )}
        <Menu.Item
          leadingIcon="account-arrow-right"
          onPress={() => {
            console.log("Option 2 pressed");
            closeMenu();
          }}
          title="Asignar"
          style={styles.menuItem} // Estilo aplicado a este ítem de menú
        />
        {/* Agrega aquí más opciones según necesites */}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Cambia esto a tu color preferido
  },
  menuItem: {
    backgroundColor: "white", // Cambia esto a tu color preferido
  },
});
