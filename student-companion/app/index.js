// app/index.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useApp, useThemeColors } from '../context/AppContext';

function calcOverall(subjects) {
  let a = 0;
  let t = 0;
  subjects.forEach((s) => {
    a += s.attended;
    t += s.total;
  });
  return t === 0 ? 0 : Math.round((a / t) * 100);
}

function getAttendanceInsights(subjects) {
  if (!subjects.length) return null;
  const sorted = [...subjects].sort(
    (x, y) => x.attended / (x.total || 1) - y.attended / (y.total || 1)
  );
  const lowest = sorted[0];
  const pct =
    lowest.total === 0
      ? 0
      : Math.round((lowest.attended / lowest.total) * 100);
  return { lowest, pct };
}

export default function HomeScreen() {
  const { state, toggleTheme, setPart } = useApp();
  const { colors, theme } = useThemeColors();
  const overall = calcOverall(state.subjects);
  const insights = getAttendanceInsights(state.subjects);
  const pendingTasks = state.tasks.filter((t) => !t.done).length;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}
    >
      {/* Top Greeting + Theme Toggle */}
      <GlassCard colors={colors}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
                letterSpacing: 3,
              }}
            >
              STUDENT COMPANION
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 26,
                fontWeight: '800',
                marginTop: 6,
              }}
            >
              Hi, {state.profile.name}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              One place for attendance, tasks, focus, CGPA & timetable.
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: colors.accentSoft,
            }}
          >
            <Ionicons
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={18}
              color={colors.neonCyan}
            />
            <Text style={{ color: colors.text, fontSize: 13 }}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 18,
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 20,
              backgroundColor: 'rgba(15,23,42,0.5)',
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Overall Attendance
            </Text>
            <Text
              style={{
                color: overall < 75 ? colors.danger : colors.success,
                fontSize: 30,
                fontWeight: '800',
                marginTop: 4,
              }}
            >
              {overall}%
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 20,
              backgroundColor: 'rgba(15,23,42,0.5)',
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Pending Tasks
            </Text>
            <Text
              style={{
                color: colors.neonCyan,
                fontSize: 30,
                fontWeight: '800',
                marginTop: 4,
              }}
            >
              {pendingTasks}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Smart Study Assistant */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Smart Study Assistant"
          icon={
            <Ionicons name="sparkles" size={22} color={colors.neonCyan} />
          }
        />
        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 6 }}>
          Simple smart tips based on your attendance & tasks. Later you can
          plug real AI API here.
        </Text>

        <Text style={{ color: colors.text, fontSize: 15, marginTop: 4 }}>
          📊 Your overall attendance is{' '}
          <Text
            style={{
              color: overall < 75 ? colors.danger : colors.success,
              fontWeight: '700',
            }}
          >
            {overall}%
          </Text>
          .
        </Text>

        {insights && (
          <Text style={{ color: colors.text, fontSize: 15, marginTop: 4 }}>
            ⚠ Most risky subject:{' '}
            <Text
              style={{ color: colors.neonPink, fontWeight: '700' }}
            >
              {insights.lowest.name}
            </Text>{' '}
            at {insights.pct}% – give it some extra love today.
          </Text>
        )}

        <Text style={{ color: colors.text, fontSize: 15, marginTop: 4 }}>
          ✅ You have{' '}
          <Text
            style={{ color: colors.neonCyan, fontWeight: '700' }}
          >
            {pendingTasks}
          </Text>{' '}
          pending tasks. Finish at least{' '}
          <Text style={{ fontWeight: '700' }}>one important</Text> item
          before you touch Instagram 😈.
        </Text>

        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
          Future: send your data to `/ai-plan` backend and show a generated
          daily study plan.
        </Text>
      </GlassCard>

      {/* Quick Timetable Glance */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Quick Timetable Glance"
          icon={
            <Ionicons name="calendar" size={22} color={colors.neonCyan} />
          }
        />
        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 10 }}>
          First two slots from each day. Edit full timetable in the Timetable
          tab.
        </Text>
        {Object.entries(state.timetable).map(([day, slots]) => (
          <View key={day} style={{ marginBottom: 8 }}>
            <Text
              style={{
                color: colors.text,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              {day}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {slots.length === 0
                ? 'No classes saved.'
                : slots.slice(0, 2).join(' • ')}
            </Text>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
  );
}
