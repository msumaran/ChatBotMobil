import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
  ref,
  onValue,
  query,
  orderByChild,
  update,
  set,
  push,
} from "firebase/database";
import { database } from "../../services/firebaseConfig";
import axios from "axios";
const WHATSAPP_TOKEN =
  "EAAEacTSUVZAQBO8tDAMkwjRfDtOqUFm32sZCeZCiCRzIeyE6yB4ZCt3HJDUs5czofuST2QFZB8zzjYS6bidV46HOlyTqIZC9MJ3WvzMXayuJeJvllcYecpFkAMH2IsUrGvHyHWEJqFAmKc5Mf45UimCDMzxSO0dZCtoqy86zZC5LFq5XjK2RAXke6zN0ApKKa9LFB2wOCpUlOS8PU8So";
const INSTAGRAM_TOKEN =
  "EAAEacTSUVZAQBO7hrQwTvFwRpaGGsPPy8S3GfCYszAWhRP1s7lTNNt9DhiDUC160jfZBxxB7ITDRoW1aV5yXk6BRz8pXzZAaCoUTmRN68NHt9PQFWlNDASZCSe0xhqcmCalHargOzAzI3QE7luk6Acy649gZAcynrcZBpVUYnBuFTzudqMXJsK4dx6FfEWgZBbRL2WcViGmQjlByOjt";

export const subscribeToChats = createAsyncThunk(
  "chats/subscribeToChats",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const chatsRef = ref(database, "chats");
      const queryChats = query(chatsRef, orderByChild("updated"));

      const unsubscribe = onValue(queryChats, (snapshot) => {
        const chats = [];
        snapshot.forEach((childSnapshot) => {
          const chatData = childSnapshot.val();
          const messagesData = chatData.messages || {};
          const messages = Object.keys(messagesData).map((key) => {
            const msg = messagesData[key];
            return {
              id: key,
              message: msg.message,
              agent: msg.agent,
              reply: msg.reply,
              updated: msg.updated,
              timestamp: msg.timestamp,
              isRead: msg.isRead,
            };
          });

          const chat = {
            id: childSnapshot.key,
            name: chatData.name,
            displayName: chatData.displayName,
            email: chatData.email,
            updated: chatData.updated,
            medio: chatData.medio,
            agent: chatData.agent,
            messages: messages,
          };
          chats.push(chat);
        });
        dispatch(chatsLoaded(chats.reverse()));
        return unsubscribe;
      });
      
    } catch (error) {
      return rejectWithValue(error.message || "Unexpected error occurred.");
    }
  }
);

export const toggleChatAgent = createAsyncThunk(
  "chats/toggleChatAgent",
  async (chatId, { getState, dispatch }) => {
    const state = getState();
    const chat = state.chatsReducer.Chats.find((chat) => chat.id === chatId);
    console.log(chat);
    console.log(chatId);
    if (!chat) {
      throw new Error("Chat no encontrado");
    }
    const newAgentState = !chat.agent;

    const chatRef = ref(database, `chats/${chatId}`);
    await update(chatRef, { agent: newAgentState });
  }
);

export const sendMessageToMessenger = ("chatApp/chats/sendMessageToMessenger", async (args, thunkAPI) => {
  const axiosPayload = {
    senderId: args.to,
    messageText: args.messageReply,
    recipientId: args.phoneNumberId,
  };
  try {
    const response = await axios.post(
      "https://us-central1-netjoven-f2aed.cloudfunctions.net/sendFacebookMessage",
      axiosPayload
    );

    if (response.data.success) {
      console.log("Mensaje enviado con éxito");
    } else {
      throw new Error("Error al enviar el mensaje");
    }
  } catch (error) {
    console.error("Error al enviar el mensaje", error);
    throw error; // Lanza el error para que Redux Toolkit lo maneje
  }
});

export const sendMessageToWhatsapp = createAsyncThunk("chatApp/chats/sendMessageToWhatsapp", async (args, thunkAPI) => {
  try {
    console.log("sendMessageToWhatsapp");
    const json = {
      messaging_product: "whatsapp",
      to: args.to,
    };
    if (
      args.interactive &&
      args.interactive.buttonTexts &&
      args.interactive.buttonTexts.length
    ) {
      json.type = "interactive";
      json.interactive = {
        type: "button",
        body: {
          text: args.messageReply,
        },
        action: {
          buttons: args.interactive.buttonTexts.map((text, index) => ({
            type: "reply",
            reply: {
              id: `BUTTON_ID_${index}`,
              title: text,
            },
          })),
        },
      };
    } else {
      json.text = { body: args.messageReply };
    }

    console.log(json);

    const url = `https://graph.facebook.com/v12.0/115855841614449/messages?access_token=${WHATSAPP_TOKEN}`;

    await thunkAPI.dispatch(
      registerMessageInDb({
        messageId: args.messageId,
        message: args.messageReply,
        timestamp: Date.now(),
        from: args.to,
        reply: true,
      })
    );
    console.log("registerMessageInDb");
    console.log(json);
    return await axios.post(url, json, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Manejo de errores de la solicitud
    console.error("Error al enviar el mensaje a WhatsApp:", error);

    // Aquí puedes acceder a la respuesta de error de axios
    if (error.response) {
      // La solicitud fue hecha y el servidor respondió con un estado fuera del rango de 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error("No response received:", error.request);
    } else {
      // Algo sucedió en la configuración de la solicitud y se lanzó un Error
      console.error("Error message:", error.message);
    }

    // Si deseas seguir propagando el error para manejarlo más adelante (por ejemplo, en un reducer)
    return thunkAPI.rejectWithValue(
      error.message || "Error al enviar el mensaje a WhatsApp"
    );
  }
});

export const registerMessageInDb = createAsyncThunk("chatApp/chats/registerMessageInDb", async (args, thunkAPI) => {
  try {
    if (args.timestamp.toString().length < 13) {
      args.timestamp *= 1000;
    }
    const messageData = {
      messageId: args.messageId,
      message: args.message,
      timestamp: args.timestamp,
      updated: args.timestamp,
      medio: "WhatsApp",
      isRead: false,
      reply: args.reply,
      agent: false,
    };
    const messageRef = ref(database, `chats/${args.from}/messages`);
    const newChatRef = push(messageRef);
    await set(newChatRef, messageData); // Usa set con newChatRef
    const userRef = ref(database, `chats/${args.from}`);

    const updateData = args.profileName
      ? {
        displayName: args.profileName,
        isRead: false,
        medio: "WhatsApp",
        updated: args.timestamp,
      }
      : {
        isRead: false,
        medio: "WhatsApp",
        updated: args.timestamp,
      };

    await update(userRef, updateData); // Modifica esta línea
  } catch (er) {
    console.log("Error adding message to DB:", er);
  }
});



const chatsSlice = createSlice({
  name: "AppChats",
  initialState: {
    loading: false,
    loadingMessage: false,
    error: null,
    Chats: [],
    unsubscribeFunction: undefined,
  },
  reducers: {
    chatsLoaded(state, action) {
      state.Chats = action.payload;
    },
    setUnsubscriber(state, action) {
      state.unsubscribeFunction = action.payload;
    },
    messagesReceived(state, action) {
      const { chatId, messages } = action.payload;

      const chatIndex = state.Chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.Chats[chatIndex].messages = messages;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToWhatsapp.pending, (state) => {
        state.loadingMessage = true;
      })
      .addCase(sendMessageToWhatsapp.fulfilled, (state, action) => {
        state.loadingMessage = false;
      })
      .addCase(sendMessageToWhatsapp.rejected, (state, action) => {
        state.loadingMessage = false;
      })
      .addCase(registerMessageInDb.pending, (state) => {
        // Por ejemplo, puedes configurar un flag que indique que el mensaje está siendo registrado
        state.loadingMessage = true;
      })
      .addCase(registerMessageInDb.fulfilled, (state, action) => {
        state.loadingMessage = false;
      })
      .addCase(registerMessageInDb.rejected, (state, action) => {
        // Aquí manejas el fallo del registro
        state.loadingMessage = false;
      })
      .addCase(subscribeToChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToChats.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(subscribeToChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar los chats.";
      });
  },
});

// Exporta las acciones y el reducer
export const { messagesReceived, chatsLoaded } = chatsSlice.actions; // Asegúrate de exportar la acción
export default chatsSlice.reducer;
export const selectChats = (state) => state.chatsReducer.Chats;
export const selectMessages = (state, chatId) => {
  const chat = state.chatsReducer.Chats.find((chat) => chat.id === chatId);
  return chat?.messages || [];
};
export const selectChat = (
  state,
  chatId
) => {
  return state.chatsReducer.Chats.find((chat) => chat.id === chatId);
};

export const selectLoading = (state) => state.chatsReducer.loading;
export const selectLoadingMessage = (state) => state.chatsReducer.loadingMessage;
export const { setUnsubscriber } = chatsSlice.actions; // Asegúrate de exportar la acción
