// components/SectionTitle.js
import React from 'react';
import { View, Text } from 'react-native';

export default function SectionTitle({ colors, icon, label }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
      }}
    >
      {icon}
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: '700',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
