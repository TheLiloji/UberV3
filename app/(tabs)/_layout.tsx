import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView 
              tint="light"
              intensity={100}
              style={[StyleSheet.absoluteFill, styles.blurView]}
            />
          ) : (
            <View style={styles.androidTabBar} />
          )
        ),
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Restaurants',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    left: 10,
    right: 10,
    height: 60,
    borderRadius: 30,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'white',
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  androidTabBar: {
    backgroundColor: 'white',
    borderRadius: 30,
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  blurView: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
  },
  tabBarLabel: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 12,
    fontWeight: '600',
  },
});
