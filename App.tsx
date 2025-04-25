import React, { useCallback, useEffect, useState, useRef } from 'react'
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import GerbangScreen from './src/screens/Gerbang'
import RegistrasiScreen from './src/screens/Registrasi'
import HomeScreen from './src/screens/Home'
import ProfilScreen from './src/screens/Profil'
import DetailData from './src/screens/DetailData'
import HospitalMap from './src/screens/HospitalMaps'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const Stack = createStackNavigator()

const screens = [
  { name: 'Home', component: HomeScreen },
  { name: 'Gerbang', component: GerbangScreen },
  { name: 'Registrasi', component: RegistrasiScreen },
  { name: 'Profil', component: ProfilScreen },
  { name: 'Data', component: DetailData },
  { name: 'HospitalMap', component: HospitalMap }
]

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Montserrat: require('./assets/font/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/font/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/font/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('./assets/font/Montserrat-SemiBold.ttf'),
    MontserratBlack: require('./assets/font/Montserrat-Black.ttf')
  })

  const navigationRef = useRef<any>(null)

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        if (token && navigationRef.current) {
          navigationRef.current.navigate('Home')
        } else if (navigationRef.current) {
          navigationRef.current.navigate('Gerbang')
        }
      } catch (error) {
        console.error('Gagal membaca token:', error)
      }
    }

    checkToken()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName='Gerbang'>
            {screens.map((screen, index) => (
              <Stack.Screen
                key={index}
                name={screen.name}
                component={screen.component}
                options={{ headerShown: false }}
              />
            ))}
          </Stack.Navigator>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  )
}

export default App
