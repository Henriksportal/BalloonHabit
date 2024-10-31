import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import GlobalProvider from "../context/GlobalProvider";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import "./../global.css"



// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    'bubbleFont': require('../assets/font/bubbleFontTwo.ttf'),
    'balloonFont' : require('../assets/font/balloonFont.otf'),
    'fatFont' : require('../assets/font/fatFont.ttf'),
    'fattextFont' : require('../assets/font/fattextFont.ttf'),
    'textFontBase' : require('../assets/font/textFontBase.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!loaded && !error) {
    return null;
  }
  return (
   
      <GlobalProvider>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GlobalProvider>
 
  );
};

export default RootLayout;
