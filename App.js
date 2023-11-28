import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { auth } from "./services/firebaseConfig"; // Importa también el tipo 'User'
import LoginScreen from "./screens/LoginScreen"; // Asume que este es tu componente de pantalla de inicio de sesión
import HomeScreen from "./screens/HomeScreen";
import { Provider } from "react-redux";
import store from "./redux/store"; // Importa tu store configurado
import AuthContext from "./services/AuthContext"; // Asegúrate de usar la ruta correcta
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const loadFonts = async () => {
    try {
      await SplashScreen.preventAutoHideAsync(); // Prevenir que la pantalla de carga se oculte automáticamente
      await Font.loadAsync({
        PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
        Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
        PoppinsExtraBold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading fonts", error);
    } finally {
      await SplashScreen.hideAsync(); // Ocultar la pantalla de carga una vez que las fuentes estén cargadas
    }
  };
  useEffect(() => {
    loadFonts();
  }, []);

  const onUserSignOut = () => {
    setUser(null); // Esto debería causar que tu aplicación muestre la pantalla de inicio de sesión
  };

  useEffect(() => {
    // Verificar si el token está almacenado en AsyncStorage al iniciar la aplicación
    const checkToken = async () => {
      try {
        //const token = await AsyncStorage.getItem("userToken");
        const token = await AsyncStorage.getItem("userToken");
        console.log(token);
        if (token) {
          // Si el token existe, asumimos que el usuario está autenticado
          // Aquí podrías validar el token con Firebase si es necesario
          setUser({}); // Establecer un valor temporal, ya que estamos asumiendo que el usuario está autenticado
        }
        setLoading(false); // Finalizar la carga, ya que ahora sabemos si el usuario está autenticado o no
      } catch (error) {
        console.error("Error checking token", error);
        setLoading(false); // Asegurarse de que la carga finalice en caso de error
      }
    };

    checkToken();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  if (loading || !fontsLoaded) {
    // Si la aplicación está en el proceso de verificación del estado de inicio de sesión o las fuentes aún no están cargadas, muestra un indicador de carga
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Si el usuario está autenticado, renderiza la pantalla principal, de lo contrario, renderiza la pantalla de inicio de sesión
  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ onUserSignOut }}>
        <View style={{ flex: 1 }}>
          {user ? <HomeScreen /> : <LoginScreen />}
        </View>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;