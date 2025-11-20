HEAD
// app/_layout.js
import React from 'react';
import { StatusBar, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppProvider, useThemeColors } from '../context/AppContext';

function TabsInner() {
  const { theme, colors } = useThemeColors();

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? ['#020617', '#020617', '#0f172a']
          : ['#e0f2fe', '#f5f3ff', '#f9fafb']
      }
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor:
              theme === 'dark'
                ? 'rgba(15,23,42,0.96)'
                : 'rgba(255,255,255,0.96)',
            borderTopWidth: 0,
            elevation: 12,
            shadowColor: colors.neonPink,
            shadowOpacity: 0.3,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -4 },
            height: 74,
          },
          tabBarIcon: ({ focused }) => {
            let icon;
            if (route.name === 'index') {
              icon = (
                <Ionicons
                  name="home"
                  size={26}
                  color={focused ? colors.neonCyan : colors.textMuted}
                />
              );
            } else if (route.name === 'attendance') {
              icon = (
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={26}
                  color={focused ? colors.neonCyan : colors.textMuted}
                />
              );
            } else if (route.name === 'tasks') {
              icon = (
                <Feather
                  name="check-square"
                  size={26}
                  color={focused ? colors.neonCyan : colors.textMuted}
                />
              );
            } else if (route.name === 'cgpa') {
              icon = (
                <Ionicons
                  name="calculator"
                  size={26}
                  color={focused ? colors.neonCyan : colors.textMuted}
                />
              );
            } else if (route.name === 'timetable') {
              icon = (
                <Ionicons
                  name="calendar"
                  size={26}
                  color={focused ? colors.neonCyan : colors.textMuted}
                />
              );
            } else if (route.name === 'profile') {
              icon = (
                <Ionicons
                  name="person-circle"
                  size={28}
                  color={focused ? colors.neonCyan : colors.textMuted}
                />
              );
            }

            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: focused ? colors.accentSoft : 'transparent',
                }}
              >
                {icon}
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="cgpa" options={{ title: 'CGPA' }} />
        <Tabs.Screen name="timetable" options={{ title: 'Timetable' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </LinearGradient>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <TabsInner />
    </AppProvider>
  );
}
