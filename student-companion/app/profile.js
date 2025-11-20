// app/profile.js
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useApp, useThemeColors } from '../context/AppContext';

export default function ProfileScreen() {
  const { state, setPart, toggleTheme } = useApp();
  const { colors, theme } = useThemeColors();
  const [syncStatus, setSyncStatus] = useState('Not synced yet');

  const profile = state.profile;
  const docs = state.docs;

  const setProfile = (p) => setPart('profile', p);
  const setDocs = (d) => setPart('docs', d);

  const onChangeProfile = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const pickDocs = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: '*/*',
      });

      if (res.canceled) return;

      const now = new Date().toLocaleString();
      const files = res.assets || [res];

      const newDocs = files.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random()
          .toString(36)
          .slice(2)}`,
        name: file.name,
        size: file.size || 0,
        uploadedAt: now,
        tag: 'General',
      }));

      setDocs([...newDocs, ...docs]);
    } catch (e) {
      console.log('Document pick error', e);
    }
  };

  const removeDoc = (id) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  const fakeCloudSync = () => {
    setSyncStatus('Syncing...');
    setTimeout(() => {
      setSyncStatus('Last sync: just now (demo only, no real cloud yet)');
    }, 900);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}
    >
      <GlassCard colors={colors}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <LinearGradient
            colors={[colors.neonCyan, colors.neonPink]}
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={40} color="white" />
          </LinearGradient>
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
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {profile.usn} • {profile.branch} • {profile.semester}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {profile.college}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 16, gap: 10 }}>
          {[
            ['name', 'Name'],
            ['usn', 'USN'],
            ['branch', 'Branch'],
            ['semester', 'Semester'],
            ['college', 'College'],
          ].map(([field, label]) => (
            <View key={field}>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                {label}
              </Text>
              <TextInput
                value={profile[field]}
                onChangeText={(v) => onChangeProfile(field, v)}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: 'rgba(15,23,42,0.7)',
                  },
                ]}
                placeholderTextColor={colors.textMuted}
              />
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
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
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={18}
              color={colors.neonCyan}
            />
            <Text
              style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}
            >
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={fakeCloudSync}
            style={[
              styles.button,
              {
                flex: 1,
                backgroundColor: colors.accent,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              },
            ]}
          >
            <Ionicons name="cloud-upload" size={18} color="white" />
            <Text
              style={{ color: 'white', fontWeight: '700', fontSize: 14 }}
            >
              Cloud Sync (demo)
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 6 }}>
          {syncStatus}
        </Text>
      </GlassCard>

      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Documents Manager"
          icon={<Feather name="folder" size={22} color={colors.neonCyan} />}
        />
        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 8 }}>
          Upload notes / PDFs / question papers. Right now we only keep metadata
          offline. Real version can push to Firebase Storage.
        </Text>
        <TouchableOpacity
          onPress={pickDocs}
          style={[
            styles.button,
            {
              backgroundColor: colors.accentSoft,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 10,
            },
          ]}
        >
          <Ionicons name="document-text" size={18} color={colors.neonCyan} />
          <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
            Pick Documents
          </Text>
        </TouchableOpacity>

        {docs.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            No documents yet. Upload your first PDF / file.
          </Text>
        ) : (
          docs.map((doc) => (
            <View
              key={doc.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: 'rgba(15,23,42,0.7)',
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {doc.name}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 12,
                  }}
                >
                  {doc.tag} • {Math.round(doc.size / 1024) || 0} KB •{' '}
                  {doc.uploadedAt}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeDoc(doc.id)}>
                <Ionicons
                  name="trash"
                  size={20}
                  color={colors.danger}
                  style={{ padding: 6 }}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
