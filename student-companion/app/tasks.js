// app/tasks.js
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useApp, useThemeColors } from '../context/AppContext';

function FocusTimerCard({ colors }) {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) setSecondsLeft(minutes * 60);
  }, [minutes, running]);

  const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const s = String(secondsLeft % 60).padStart(2, '0');
  const total = Math.max(minutes * 60, 1);
  const progress = Math.min(100, Math.max(0, ((total - secondsLeft) / total) * 100));

  return (
    <GlassCard colors={colors}>
      <SectionTitle
        colors={colors}
        label="Focus Timer"
        icon={<Feather name="target" size={22} color={colors.neonCyan} />}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: colors.textMuted, fontSize: 15 }}>
          Session length (min)
        </Text>
        <TextInput
          keyboardType="numeric"
          value={String(minutes)}
          onChangeText={(v) => setMinutes(Number(v || '1'))}
          style={[
            styles.input,
            {
              width: 80,
              textAlign: 'right',
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'rgba(15,23,42,0.6)',
            },
          ]}
          placeholderTextColor={colors.textMuted}
        />
      </View>
      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: '800',
            color: colors.text,
          }}
        >
          {m}:{s}
        </Text>
      </View>
      <View
        style={{
          height: 8,
          borderRadius: 999,
          backgroundColor: 'rgba(148,163,184,0.3)',
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: colors.neonCyan,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={() => setRunning((v) => !v)}
          style={[
            styles.button,
            { flex: 1, backgroundColor: colors.accent },
          ]}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>
            {running ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setRunning(false);
            setSecondsLeft(minutes * 60);
          }}
          style={[
            styles.button,
            {
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: 'transparent',
            },
          ]}
        >
          <Text
            style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

export default function TasksScreen() {
  const { state, setPart } = useApp();
  const { colors } = useThemeColors();
  const [input, setInput] = useState('');
  const tasks = state.tasks;

  const setTasks = (arr) => setPart('tasks', arr);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      {
        id: Date.now().toString(),
        title: input.trim(),
        due: 'Custom',
        done: false,
      },
      ...tasks,
    ]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}
    >
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Tasks & Deadlines"
          icon={<Feather name="check-square" size={22} color={colors.neonCyan} />}
        />
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TextInput
            placeholder="Add task (e.g. DBMS mini project)"
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: 'rgba(15,23,42,0.6)',
              },
            ]}
          />
          <TouchableOpacity
            onPress={addTask}
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
        {tasks.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            No tasks yet. Add your first one above.
          </Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleTask(item.id)}
                style={{
                  padding: 14,
                  borderRadius: 20,
                  borderWidth: 1,
                  marginBottom: 10,
                  borderColor: item.done ? colors.success : colors.border,
                  backgroundColor: item.done
                    ? 'rgba(34,197,94,0.12)'
                    : 'rgba(15,23,42,0.6)',
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 15,
                    textDecorationLine: item.done ? 'line-through' : 'none',
                    opacity: item.done ? 0.7 : 1,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Due: {item.due} • {item.done ? '✅ Completed' : 'Pending'}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </GlassCard>

      <FocusTimerCard colors={colors} />
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
