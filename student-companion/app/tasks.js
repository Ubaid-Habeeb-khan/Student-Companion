// app/tasks.js
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
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

function appBackgroundForInput(secondary, bg) {
  return Platform.OS === 'ios' ? secondary : bg;
}

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
  const progress = Math.min(
    100,
    Math.max(0, ((total - secondsLeft) / total) * 100)
  );

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
          marginBottom: 8,
        }}
      >
        <Text style={{ color: colors.textMuted, fontSize: 14 }}>
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
              backgroundColor: appBackgroundForInput(
                colors.bgSecondary,
                colors.bg
              ),
            },
          ]}
          placeholderTextColor={colors.textMuted}
        />
      </View>
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Text
          style={{
            fontSize: 34,
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
          marginBottom: 10,
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
          <Text
            style={{ color: 'white', fontWeight: '700', fontSize: 14 }}
          >
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
  const { appState, setPart, colors } = useAppContext();
  const [input, setInput] = useState('');

  const tasks = appState.tasks;

  const addTask = () => {
    if (!input.trim()) return;
    setPart('tasks', (prev) => [
      {
        id: Date.now().toString(),
        title: input.trim(),
        due: 'Custom',
        done: false,
      },
      ...prev,
    ]);
    setInput('');
  };

  const toggleTask = (id) => {
    setPart('tasks', (prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 18 }}
    >
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Tasks & Deadlines"
          icon={<Feather name="check-square" size={22} color={colors.neonCyan} />}
        />
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
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
                backgroundColor: appBackgroundForInput(
                  colors.bgSecondary,
                  colors.bg
                ),
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
            <Text
              style={{ color: 'white', fontWeight: '700', fontSize: 14 }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            No tasks yet. Add your first one above and stop storing everything
            in your brain 🧠.
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
                  marginBottom: 8,
                  borderColor: item.done ? colors.success : colors.border,
                  backgroundColor: item.done
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(15,23,42,0.45)',
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 15,
                    textDecorationLine: item.done
                      ? 'line-through'
                      : 'none',
                    opacity: item.done ? 0.7 : 1,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{ color: colors.textMuted, fontSize: 12 }}
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
