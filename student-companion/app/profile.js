// app/profile.js
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 9 : 8,
    fontSize: 14,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function appBackgroundForInput(secondary, bg) {
  return Platform.OS === 'ios' ? secondary : bg;
}

export default function ProfileScreen() {
  const { appState, setPart, toggleTheme, colors } = useAppContext();
  const profile = appState.profile;

  const onChangeField = (field, value) => {
    setPart('profile', (prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 18 }}
    >
      <GlassCard colors={colors}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15,23,42,0.7)',
              borderWidth: 2,
              borderColor: colors.neonCyan,
            }}
          >
            <Ionicons name="person" size={36} color={colors.neonCyan} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 22,
                fontWeight: '800',
              }}
            >
              {profile.name}
            </Text>
            <Text
              style={{ color: colors.textMuted, fontSize: 13 }}
            >
              {profile.usn} • {profile.branch} • {profile.semester}
            </Text>
            <Text
              style={{ color: colors.textMuted, fontSize: 13 }}
            >
              {profile.college}
            </Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Profile Details"
          icon={<Ionicons name="id-card" size={22} color={colors.neonCyan} />}
        />
        {[
          ['name', 'Name'],
          ['usn', 'USN'],
          ['branch', 'Branch'],
          ['semester', 'Semester'],
          ['college', 'College'],
        ].map(([field, label]) => (
          <View key={field} style={{ marginBottom: 10 }}>
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              {label}
            </Text>
            <TextInput
              value={profile[field]}
              onChangeText={(v) => onChangeField(field, v)}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: appBackgroundForInput(
                    colors.bgSecondary,
                    colors.bg
                  ),
                },
              ]}
              placeholder={label}
              placeholderTextColor={colors.textMuted}
            />
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.button,
              {
                flex: 1,
                backgroundColor: colors.accentSoft,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              },
            ]}
          >
            <Ionicons
              name={appState.theme === 'dark' ? 'moon' : 'sunny'}
              size={18}
              color={colors.neonCyan}
            />
            <Text
              style={{
                color: colors.text,
                fontWeight: '700',
                fontSize: 14,
              }}
            >
              Theme: {appState.theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 8,
          }}
        >
          All changes are stored locally using AsyncStorage. Later you can hook
          this to Firebase or your own backend for cloud sync.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}
