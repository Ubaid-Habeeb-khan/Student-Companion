// components/GlassCard.js
import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GlassCard({ colors, children, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[
          colors.bgSecondary,
          Platform.OS === 'ios'
            ? 'rgba(148,163,184,0.18)'
            : 'rgba(15,23,42,0.8)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.neonCyan,
          shadowOpacity: 0.4,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        }}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
}
