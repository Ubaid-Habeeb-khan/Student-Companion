// app/index.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';

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
    (a, b) => a.attended / (a.total || 1) - b.attended / (b.total || 1)
  );
  const lowest = sorted[0];
  const curPct =
    lowest.total === 0 ? 0 : Math.round((lowest.attended / lowest.total) * 100);
  return { lowest, curPct };
}

export default function HomeScreen() {
  const { appState, colors, toggleTheme } = useAppContext();
  const overall = calcOverall(appState.subjects);
  const insights = getAttendanceInsights(appState.subjects);
  const pendingCount = appState.tasks.filter((t) => !t.done).length;

  const mainSubject = insights?.lowest?.name || 'your core subject';

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 18 }}
    >
      <GlassCard colors={colors}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 12,
                letterSpacing: 3,
              }}
            >
              STUDENT COMPANION
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 24,
                fontWeight: '800',
                marginTop: 6,
              }}
            >
              Hi, {appState.profile.name}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Everything for your semester – attendance, tasks, CGPA & timetable
              in one neon dashboard.
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
              name={appState.theme === 'dark' ? 'moon' : 'sunny'}
              size={18}
              color={colors.neonCyan}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              {appState.theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 18,
            gap: 10,
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
              {pendingCount}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Smart Study Assistant card */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Smart Study Assistant"
          icon={<Ionicons name="sparkles" size={22} color={colors.neonCyan} />}
        />

        <Text
          style={{
            color: colors.textMuted,
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          This is local logic. Later you can hook it to a real AI API and send
          attendance + tasks for smarter plans.
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

        <Text style={{ color: colors.text, fontSize: 15, marginTop: 4 }}>
          🎯 Today, put extra focus on{' '}
          <Text
            style={{
              color: colors.neonPink,
              fontWeight: '700',
            }}
          >
            {mainSubject}
          </Text>
          . Even 45 minutes of solid revision can save your internals.
        </Text>

        <Text style={{ color: colors.text, fontSize: 15, marginTop: 4 }}>
          ✅ You have{' '}
          <Text
            style={{
              color: colors.neonCyan,
              fontWeight: '700',
            }}
          >
            {pendingCount}
          </Text>{' '}
          pending task(s). Finish at least{' '}
          <Text style={{ fontWeight: '700' }}>one major</Text> item before
          sleeping.
        </Text>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 10,
          }}
        >
          (Future idea) – call a backend route like{' '}
          <Text style={{ fontWeight: '600' }}>/ai-plan</Text> that returns a
          daily plan for you.
        </Text>
      </GlassCard>

      {/* Quick timetable glance */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Timetable Glance"
          icon={<Ionicons name="calendar" size={22} color={colors.neonCyan} />}
        />
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 13,
            marginBottom: 8,
          }}
        >
          First two slots of each day. Edit full timetable in the Timetable tab.
        </Text>

        {Object.entries(appState.timetable).map(([day, slots]) => (
          <View key={day} style={{ marginBottom: 6 }}>
            <Text
              style={{
                color: colors.text,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              {day}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
              }}
            >
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
