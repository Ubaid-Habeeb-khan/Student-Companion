// app/profile.js
import React, { useState } from 'react';
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

  // NEW: Editing state
  const [isEditing, setIsEditing] = useState(false);

  // NEW: Local temporary profile copy
  const [localData, setLocalData] = useState(profile);

  const onChangeField = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // NEW: Save changes
  const onSave = () => {
    setPart("profile", localData);
    setIsEditing(false);
  };

  // NEW: Cancel changes
  const onCancel = () => {
    setLocalData(profile);
    setIsEditing(false);
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
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>
              {profile.name}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {profile.usn} • {profile.branch} • {profile.semester}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
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
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{label}</Text>
            <TextInput
              value={localData[field]}
              editable={isEditing}   // ★ ONLY editable when editing
              onChangeText={(v) => onChangeField(field, v)}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  opacity: isEditing ? 1 : 0.6,
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

        {/* BUTTONS */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          {!isEditing ? (
            // EDIT BUTTON
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={[
                styles.button,
                {
                  flex: 1,
                  backgroundColor: colors.accentSoft,
                  flexDirection: "row",
                  gap: 6,
                },
              ]}
            >
              <Ionicons name="create" size={18} color={colors.neonCyan} />
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* SAVE BUTTON */}
              <TouchableOpacity
                onPress={onSave}
                style={[
                  styles.button,
                  {
                    flex: 1,
                    backgroundColor: colors.neonCyan,
                  },
                ]}
              >
                <Text
                  style={{ color: "#000", fontWeight: "800", fontSize: 14 }}
                >
                  Save
                </Text>
              </TouchableOpacity>

              {/* CANCEL BUTTON */}
              <TouchableOpacity
                onPress={onCancel}
                style={[
                  styles.button,
                  {
                    flex: 1,
                    backgroundColor: colors.accentSoft,
                  },
                ]}
              >
                <Text
                  style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* THEME TOGGLE */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.button,
              {
                flex: 1,
                backgroundColor: colors.accentSoft,
                flexDirection: "row",
                gap: 6,
              },
            ]}
          >
            <Ionicons
              name={appState.theme === "dark" ? "moon" : "sunny"}
              size={18}
              color={colors.neonCyan}
            />
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>
              Theme: {appState.theme === "dark" ? "Dark" : "Light"}
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
          Changes are stored locally using AsyncStorage.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}
