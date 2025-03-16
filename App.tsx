import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  ToastAndroid
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GerbangScreen from "./src/screens/Gerbang";
import RegistrasiScreen from './src/screens/Registrasi';
import HomeScreen from './src/screens/Home';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();

const screens = [
  { name: "Home", component: HomeScreen },
  { name: "Gerbang", component: GerbangScreen },
  { name: "Registrasi", component: RegistrasiScreen }
];

const App: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string>('Gerbang');
  const [fontsLoaded] = useFonts({
    Montserrat: require('./assets/font/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/font/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/font/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('./assets/font/Montserrat-SemiBold.ttf'),
    MontserratBlack: require('./assets/font/Montserrat-Black.ttf'),
  });

  // Cek token saat pertama kali aplikasi dijalankan
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setInitialRoute('Home'); // Jika token ada, arahkan ke Home
        }
      } catch (error) {
        console.error('Gagal membaca token:', error);
      }
    };

    checkToken();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1 }}>
              <Stack.Navigator initialRouteName={initialRoute}>
                {screens.map((screen, index) => (
                  <Stack.Screen
                    key={index}
                    name={screen.name}
                    options={{ headerShown: false }}
                  >
                    {(props) => (
                      <HandleBackPress {...props} screenName={screen.name} />
                    )}
                  </Stack.Screen>
                ))}
              </Stack.Navigator>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const HandleBackPress: React.FC<{ navigation: any; screenName: string }> = ({ navigation, screenName }) => {
  const [exitApp, setExitApp] = useState<boolean>(false);

  useEffect(() => {
    const backAction = () => {
      if (screenName === 'Registrasi') {
        navigation.navigate('Gerbang');
        return true;
      } else if (screenName === 'Gerbang') {
        if (exitApp) {
          BackHandler.exitApp();
        } else {
          ToastAndroid.show("Tekan kembali lagi untuk keluar aplikasi", ToastAndroid.SHORT);
          setExitApp(true);
          setTimeout(() => setExitApp(false), 2000);
          return true;
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation, screenName, exitApp]);

  const ScreenComponent = screens.find(screen => screen.name === screenName)?.component;
  return ScreenComponent ? <ScreenComponent /> : <View />;
};

export default App;
