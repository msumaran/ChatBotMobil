import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { styled } from "nativewind";
import { getIconForChat } from "../utils";
import {
  subscribeToChats,
  selectChats,
  selectLoading,
} from "../redux/Slices/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";

const StyledScrollView = styled(ScrollView, "flex-1 bg-gray-100");
const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledView = styled(View);

function ChatList({navigation}) {
  const dispatch = useAppDispatch();
  const loading = useSelector(selectLoading);

  const chats = useSelector(selectChats);
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToChats());
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [dispatch]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const formatDate = (timestamp) => {
    // Crear un objeto de fecha a partir del timestamp (milisegundos)
    const date = new Date(timestamp);

    // Opciones de formato de fecha y hora
    // Opciones de formato de fecha y hora
    const options = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "America/Lima", // o tu zona horaria específica
    };

    // Formatear la fecha y hora según la configuración regional y las opciones
    return new Intl.DateTimeFormat("es-ES", options).format(date);
  };

  return (
    <StyledScrollView>
      <StyledView className="container justify-center items-center p-4">
        {chats.map((chat) => {
          return (
            <TouchableOpacity
              key={chat.id}
              style={{ width: "100%" }} // Asegura que TouchableOpacity sea tan ancho como su contenedor
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Chat", {
                  chatId: chat.id,
                  name: chat.name,
                })
              }
            >
              <StyledView className="mb-2 p-4 bg-white rounded-lg shadow w-full flex-row border-gray-500">
              {getIconForChat(chat.medio)} 
              <StyledView className="flex-col w-full">
                <StyledText className="font-bold ml-2 text-gray-600">{chat.displayName}</StyledText>
                {chat.agent && (
                  <StyledView  className="bg-rose-600 justify-end flex-start ml-auto mr-8 rounded-lg p-1">
                    <StyledText className="font-bold text-white text-xs">Agente</StyledText> 
                    
                  </StyledView>
                )}
                <StyledText className="text-xs text-gray-400 ml-2 justify-end text-right pr-6 mt-3">
                  {formatDate(chat.updated)}
                </StyledText>
                </StyledView>
              </StyledView>
            </TouchableOpacity>
          );
        })}
          
      </StyledView>
    </StyledScrollView>
  );
}

export default ChatList;
