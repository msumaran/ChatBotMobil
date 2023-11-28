import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMessages,
  selectChat,
  selectLoading,
  selectLoadingMessage,
  sendMessageToWhatsapp,
} from "../redux/Slices/chatsSlice";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Importa FontAwesome
import { RootState } from "../redux/store";
import { DropdownMenu } from "./components/DropdownmenuChat";
import { getIconForChat } from "../utils";
import { useAppDispatch } from "../redux/store";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyleTextInput = styled(TextInput);
const StyleButton = styled(Button);

function ChatScreen({ route, navigation }) {
  const { chatId, name } = route.params;
  const dispatch = useAppDispatch();
  const [messageText, setMessageText] = useState("");

  const chat = useSelector((state) => selectChat(state, chatId));

  useEffect(() => {
    // Establecer opciones de navegación dinámicamente
    navigation.setOptions({
      headerRight: () => (
        <DropdownMenu navigation={navigation} chatId={chatId} />
      ),
    });
  }, [navigation, chatId]);
  

  const messages = useSelector((state) =>
    selectMessages(state, chatId)
  );

  const loading = useSelector(selectLoading);
  const loadingMessage = useSelector(selectLoadingMessage);

  const scrollViewRef = useRef(null);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "America/Lima",
    };
    return new Intl.DateTimeFormat("es-ES", options).format(date);
  };
  const handleSend = () => {
    if (messageText.trim() === "") return;
    const messages = chat?.messages || [];
    const chatLast = messages[messages.length - 1];

    switch (chat?.medio) {
      case "Messenger":
        break;
      case "WhatsApp":
        console.log("WhatsApp");
        dispatch(
          sendMessageToWhatsapp({
            messageId: chatLast?.id,
            phoneNumberId: chat.id,
            to: chat.id,
            messageReply: messageText,
          })
        );
        break;
    }

    setMessageText(""); // Limpiar el campo después de enviar
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100); // Ajusta el retraso si es necesario
  
    return () => clearTimeout(timer); // Limpiar el timer al desmontar
  }, [messages]);
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Ajusta este valor según sea necesario
    >
      <StyledView className="flex-1 p-4 bg-gray-100 shadow-sm">
        
        <StyledView className="flex-row items-center mb-4">
          {getIconForChat(chat?.medio)}
          <StyledText className="text-lg font-bold ml-2">
            Chat: {name}{" "}
          </StyledText>
          {chat?.agent && (
            <StyledView className="bg-rose-600 justify-end flex-start ml-auto mr-8 rounded-lg p-1">
              <StyledText className="font-bold text-white text-md">
                Agente
              </StyledText>
            </StyledView>
          )}
        </StyledView>
        <StyledScrollView
          className="grow bg-gray-100"
          ref={scrollViewRef}
          onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => {
            const alignmentStyle = msg.reply ? "items-end" : "items-start";
            const messageBackgroundStyle = msg.reply
              ? "bg-blue-100"
              : "bg-white";

            return (
              <StyledView
                key={msg.id}
                className={`flex-col ${alignmentStyle} mb-4`}
              >
                <StyledView
                  className={`p-3 rounded-lg shadow border-gray-300 ${messageBackgroundStyle}`}
                >
                  <StyledText className="text-gray-800">
                    {msg.message}
                  </StyledText>
                </StyledView>
                <StyledText className="text-xs text-gray-400 ml-2 mt-1">
                  {formatDate(msg.updated)}
                </StyledText>
              </StyledView>
            );
          })}
        </StyledScrollView>
        {chat?.agent && (
          <StyledView className="flex-row justify-start items-center w-full">
            <StyleTextInput
              className="p-4 bg-white border border-gray-300 rounded-lg flex-auto w-64"
              placeholder="Escribe un mensaje..."
              value={messageText}
              multiline
              onChangeText={setMessageText}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={{ marginLeft: 10, padding: 10 }}
              disabled={loadingMessage}
            >
              {loadingMessage ? (
                <ActivityIndicator size="small" color="#841584" /> // spinner
              ) : (
                <FontAwesome name="send" size={20} color="#841584" /> // ícono de envío
              )}
            </TouchableOpacity>
          </StyledView>
        )}
      </StyledView>
    </KeyboardAvoidingView>
  );
}

export default ChatScreen;
