// app/index.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import Svg, { Circle } from 'react-native-svg';


// RING PROGRESS COMPONENT
function Ring({ size = 90, stroke = 10, progress = 0, color = "#00eaff", bg = "#1e293b" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          stroke={bg}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
      </Svg>
    </View>
  );
}

// CALCULATE ATTENDANCE %
function calcOverall(subjects) {
  let a = 0, t = 0;
  subjects.forEach((s) => {
    a += s.attended;
    t += s.total;
  });
  return t === 0 ? 0 : Math.round((a / t) * 100);
}

export default function HomeScreen() {
  const { appState, colors, toggleTheme } = useAppContext();
  const overallAttendance = calcOverall(appState.subjects);
  const pendingCount = appState.tasks.filter((t) => !t.done).length;

  // REAL ADVICE
  const getAdvice = () => {
    let lines = [];

    if (overallAttendance < 75) {
      lines.push("⚠️ Your attendance is below 75%. Try not to miss the next few classes.");
    } else if (overallAttendance < 85) {
      lines.push("📘 Your attendance is okay, but avoid unnecessary absences.");
    } else {
      lines.push("💯 Excellent attendance. Keep it steady.");
    }

    if (pendingCount > 5) {
      lines.push("📝 You have many pending tasks. Try completing at least 2 today.");
    } else if (pendingCount > 0) {
      lines.push("🗂️ Clear your pending tasks to reduce pressure.");
    } else {
      lines.push("✨ No pending tasks. Great job staying ahead.");
    }

    return lines;
  };

  const adviceLines = getAdvice();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 18 }}
    >
      <GlassCard colors={colors}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12, letterSpacing: 3 }}>
              STUDENT COMPANION
            </Text>

            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 6 }}>
              Hi, {appState.profile.name}
            </Text>

            <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>
              Quick summary of your semester in one place.
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              flexDirection: 'row',
              gap: 6,
              backgroundColor: colors.accentSoft,
            }}
          >
            <Ionicons
              name={appState.theme === 'dark' ? 'moon' : 'sunny'}
              size={18}
              color={colors.neonCyan}
            />
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              {appState.theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ONLY ATTENDANCE RING */}
        <View style={{ flexDirection: 'row', marginTop: 18, gap: 12 }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              padding: 14,
              borderRadius: 20,
              backgroundColor: 'rgba(15,23,42,0.5)',
            }}
          >
            <Ring
              progress={overallAttendance}
              size={90}
              stroke={10}
              color={overallAttendance < 75 ? colors.danger : colors.success}
              bg="#1e293b"
            />
            <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>
              Attendance
            </Text>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>
              {overallAttendance}%
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* STUDY ASSISTANT */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Study Assistant"
          icon={<Ionicons name="sparkles" size={22} color={colors.neonCyan} />}
        />

        {adviceLines.map((line, index) => (
          <Text
            key={index}
            style={{
              color: colors.text,
              fontSize: 15,
              marginBottom: 6,
              lineHeight: 20,
            }}
          >
            {line}
          </Text>
        ))}
      </GlassCard>

      {/* TIMETABLE */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Timetable Glance"
          icon={<Ionicons name="calendar" size={22} color={colors.neonCyan} />}
        />
        <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 8 }}>
          First two slots of each day.
        </Text>

        {Object.entries(appState.timetable).map(([day, slots]) => (
          <View key={day} style={{ marginBottom: 6 }}>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>
              {day}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              {slots.length === 0 ? 'No classes saved.' : slots.slice(0, 2).join(' • ')}
            </Text>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
  );
}
