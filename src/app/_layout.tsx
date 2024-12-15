import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeDatabase } from '../database/initializeDatabase';
import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function RootLayout() {
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <SQLiteProvider databaseName="woodifyDatabase.db" onInit={initializeDatabase}>
          <Stack></Stack>
        </SQLiteProvider>
      </ThemeProvider>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
