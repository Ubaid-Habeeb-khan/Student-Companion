// app/timetable.js
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useApp, useThemeColors } from '../context/AppContext';

export default function TimetableScreen() {
  const { state, setPart } = useApp();
  const { colors } = useThemeColors();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [newSlot, setNewSlot] = useState('');

  const days = Object.keys(state.timetable);

  const setTimetable = (tt) => setPart('timetable', tt);

  const addSlot = () => {
    if (!newSlot.trim()) return;
    setTimetable({
      ...state.timetable,
      [selectedDay]: [...state.timetable[selectedDay], newSlot.trim()],
    });
    setNewSlot('');
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}
    >
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Timetable"
          icon={<Ionicons name="calendar" size={24} color={colors.neonCyan} />}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDay(d)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor:
                    selectedDay === d ? colors.neonCyan : colors.border,
                  backgroundColor:
                    selectedDay === d
                      ? 'rgba(34,211,238,0.15)'
                      : 'rgba(15,23,42,0.7)',
                }}
              >
                <Text
                  style={{
                    color:
                      selectedDay === d ? colors.neonCyan : colors.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 8 }}>
          Add class slots like <Text>“9–10 DSA”</Text>, <Text>“10–11 DBMS”</Text>.
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TextInput
            placeholder="e.g. 9–10 DSA"
            placeholderTextColor={colors.textMuted}
            value={newSlot}
            onChangeText={setNewSlot}
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: 'rgba(15,23,42,0.7)',
              },
            ]}
          />
          <TouchableOpacity
            onPress={addSlot}
            style={[
              styles.button,
              { backgroundColor: colors.accent, paddingHorizontal: 18 },
            ]}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {state.timetable[selectedDay].length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            No slots yet. Add above.
          </Text>
        ) : (
          state.timetable[selectedDay].map((slot, idx) => (
            <View
              key={idx.toString()}
              style={{
                padding: 12,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: 'rgba(15,23,42,0.7)',
                marginBottom: 8,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 15 }}>{slot}</Text>
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
