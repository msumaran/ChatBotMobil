// En un archivo como AppNavigator.tsx o en tu archivo App.tsx

import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";
import MenuLeft from './components/MenuLeft';
import { Provider } from 'react-native-paper';

const Stack = createStackNavigator();
export default function HomeScreen() {
  
  return (
    <Provider> 
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MenuLeft}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
        >
          {(props) => <ChatScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
