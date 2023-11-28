import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from "@react-navigation/stack";
import ChatList from "../ChatList";
import { auth } from "../../services/firebaseConfig";
import AuthContext from '../../services/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function CustomDrawerContent(props) {
    const { onUserSignOut } = useContext(AuthContext);
    const handleSignOut = async () => {

        await auth.signOut();
        //await AsyncStorage.removeItem('userToken'); 
        onUserSignOut();
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="Salir"
                icon={({ color, size }) => (
                    <Icon
                        name="sign-out"  // el nombre del ícono que deseas usar para "Salir"
                        size={size}
                        color={color}
                    />
                )}
                onPress={handleSignOut}
            />
        </DrawerContentScrollView>
    );
}

function MenuLeft({ route, navigation }) {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Mis chats" component={ChatList} options={{
                drawerIcon: ({ color, size }) => (
                    <Icon
                        name="comments"  // el nombre del ícono que deseas usar
                        size={size}
                        color={color}
                    />
                )
            }} />
            <Drawer.Screen name="Dashboard" component={ChatList} options={{
                drawerIcon: ({ color, size }) => (
                    <Icon
                        name="bar-chart"  // el nombre del ícono que deseas usar
                        size={size}
                        color={color}
                    />
                )
            }} />
        </Drawer.Navigator>
    )
};

export default MenuLeft;