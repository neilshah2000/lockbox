import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import { saveUser } from './src/services/userService';
import { MainStackParamList } from './src/types/navigation.types';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PairingScreen from './src/screens/PairingScreen';
import GenerateCodeScreen from './src/screens/GenerateCodeScreen';
import EnterCodeScreen from './src/screens/EnterCodeScreen';
import colors from './src/constants/colors';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      try {
        if (u) {
          await saveUser(u);
        }
      } catch (e) {
        console.error('Auth/saveUser error:', e);
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen />
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {() => <HomeScreen user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="Pairing"
            component={PairingScreen}
            options={{ headerShown: true, title: 'Pair with partner', headerTintColor: colors.primary }}
          />
          <Stack.Screen
            name="GenerateCode"
            component={GenerateCodeScreen}
            options={{ headerShown: true, title: 'Your code', headerTintColor: colors.primary }}
          />
          <Stack.Screen
            name="EnterCode"
            component={EnterCodeScreen}
            options={{ headerShown: true, title: 'Enter code', headerTintColor: colors.primary }}
          />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
