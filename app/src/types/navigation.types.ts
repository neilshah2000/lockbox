// Navigation-related TypeScript types

import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack (Auth + Main App)
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
};

// Main App Stack
export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
};

// Navigation props type helpers
export type RootStackNavigationProp = any; // Will be properly typed when we set up navigation
export type AuthStackNavigationProp = any;
export type MainStackNavigationProp = any;
