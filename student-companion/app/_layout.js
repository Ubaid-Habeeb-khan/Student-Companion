// app/_layout.js
import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppProvider, useAppContext } from '../context/AppContext';

function RootTabs() {
  const { appState, colors, hydrated } = useAppContext();

  if (!hydrated) {
    return (
      <LinearGradient
        colors={
          appState.theme === 'dark'
            ? ['#020617', '#020617', '#0f172a']
            : ['#e0f2fe', '#f5f3ff', '#f9fafb']
        }
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <StatusBar
          barStyle={
            appState.theme === 'dark' ? 'light-content' : 'dark-content'
          }
        />
        <ActivityIndicator size="large" color={colors.neonCyan} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        appState.theme === 'dark'
          ? ['#020617', '#020617', '#0f172a']
          : ['#e0f2fe', '#f5f3ff', '#f9fafb']
      }
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={
          appState.theme === 'dark' ? 'light-content' : 'dark-content'
        }
      />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor:
              appState.theme === 'dark'
                ? 'rgba(15,23,42,0.96)'
                : 'rgba(255,255,255,0.96)',
            borderTopWidth: 0,
            elevation: 12,
            shadowColor: colors.neonPink,
            shadowOpacity: 0.35,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -6 },
            height: 72,
          },
          tabBarIcon: ({ focused }) => {
            let icon;
            const color = focused ? colors.neonCyan : colors.textMuted;

            switch (route.name) {
              case 'index':
                icon = (
                  <Ionicons name="home" size={26} color={color} />
                );
                break;
              case 'attendance':
                icon = (
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={26}
                    color={color}
                  />
                );
                break;
              case 'tasks':
                icon = (
                  <Feather name="check-square" size={26} color={color} />
                );
                break;
              case 'cgpa':
                icon = (
                  <Ionicons
                    name="calculator"
                    size={26}
                    color={color}
                  />
                );
                break;
              case 'timetable':
                icon = (
                  <Ionicons
                    name="calendar"
                    size={26}
                    color={color}
                  />
                );
                break;
              case 'profile':
                icon = (
                  <Ionicons
                    name="person-circle"
                    size={28}
                    color={color}
                  />
                );
                break;
              default:
                icon = (
                  <Ionicons name="ellipse" size={24} color={color} />
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
                  backgroundColor: focused
                    ? colors.accentSoft
                    : 'transparent',
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
      <RootTabs />
    </AppProvider>
  );
}
