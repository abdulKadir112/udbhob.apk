import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  CreditCard,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  User
} from 'lucide-react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FundProvider } from './src/context/FundContext';
import { ChatProvider, useChat } from './src/context/ChatContext';

import HomeScreen from './src/screens/HomeScreen';
import PaymentMatrixScreen from './src/screens/PaymentMatrixScreen';
import ChatScreen from './src/screens/ChatScreen';
import InvestmentsScreen from './src/screens/InvestmentsScreen';
import AdminScreen from './src/screens/AdminScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { isAdmin } = useAuth();
  const { unreadCount } = useChat();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'হোম',
          tabBarIcon: ({ color, size }) => <Home color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentMatrixScreen}
        options={{
          tabBarLabel: 'পেমেন্ট',
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'চ্যাট',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#059669',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Investments"
        component={InvestmentsScreen}
        options={{
          tabBarLabel: 'বিনিয়োগ',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={22} />,
        }}
      />
      {isAdmin ? (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarLabel: 'এডমিন',
            tabBarIcon: ({ color, size }) => <ShieldCheck color={color} size={22} />,
          }}
        />
      ) : (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'প্রোফাইল',
            tabBarIcon: ({ color, size }) => <User color={color} size={22} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FundProvider>
          <ChatProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <MainTabs />
            </NavigationContainer>
          </ChatProvider>
        </FundProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
