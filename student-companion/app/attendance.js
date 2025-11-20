// app/attendance.js
import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

function getInsights(subjects) {
  if (!subjects.length) return null;
  const sorted = [...subjects].sort(
    (x, y) => x.attended / (x.total || 1) - y.attended / (y.total || 1)
  );
  const lowest = sorted[0];
  const target = 75;
  const pct =
    lowest.total === 0
      ? 0
      : Math.round((lowest.attended / lowest.total) * 100);

  // How many more classes must attend in worst subject
  let need = 0;
  let A = lowest.attended;
  let T = lowest.total;
  const ratio = target / 100;
  while (T > 0 && Math.round((A / T) * 100) < target && need < 200) {
    A += 1;
    T += 1;
    need += 1;
  }

  return { lowest, pct, need };
}

function bunkOrAttendMessage(subject, colors) {
  const A = subject.attended;
  const T = subject.total;
  if (T === 0) return 'No classes marked yet — attend *something* first 😅';

  const pct = Math.round((A / T) * 100);
  const target = 75;
  const ratio = target / 100;

  // Max total such that attendance still >= 75
  const maxTotal = Math.floor(A / ratio);
  const bunkable = maxTotal - T;

  if (pct < target) {
    // classes needed to reach 75
    let need = 0;
    let a = A;
    let t = T;
    while (t > 0 && Math.round((a / t) * 100) < target && need < 200) {
      a += 1;
      t += 1;
      need += 1;
    }
    return `Bro, shortage alert 🔥 Attend around ${need} ${need === 1 ? 'class' : 'classes'} in a row for ${subject.name}.`;
  }

  if (bunkable <= 0) {
    return `Barely safe zone ⚠️ Please attend next few ${subject.name} classes, don’t test your luck.`;
  }

  if (bunkable <= 2) {
    return `You are safe-ish 😎 You *can* bunk about ${bunkable} ${bunkable === 1 ? 'class' : 'classes'}, but don’t go full villain.`;
  }

  return `Absolute chad attendance 💪 You can bunk ~${bunkable} ${bunkable === 1 ? 'class' : 'classes'} for ${subject.name} and still stay above 75%.`;
}

export default function AttendanceScreen() {
  const { state, setPart } = useApp();
  const { colors } = useThemeColors();
  const [newSub, setNewSub] = useState('');
  const subjects = state.subjects;

  const overall = calcOverall(subjects);
  const insights = useMemo(() => getInsights(subjects), [subjects]);

  const updateSubjects = (arr) => setPart('subjects', arr);

  const addSubject = () => {
    if (!newSub.trim()) return;
    updateSubjects([
      ...subjects,
      { id: Date.now().toString(), name: newSub.trim(), attended: 0, total: 0 },
    ]);
    setNewSub('');
  };

  const mark = (id, present) => {
    updateSubjects(
      subjects.map((s) =>
        s.id === id
          ? {
              ...s,
              total: s.total + 1,
              attended: s.attended + (present ? 1 : 0),
            }
          : s
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
          label="Attendance Overview"
          icon={
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color={colors.neonCyan}
            />
          }
        />
        <Text style={{ color: colors.textMuted, fontSize: 15, marginBottom: 10 }}>
          Tap{' '}
          <Text style={{ color: colors.success, fontWeight: '600' }}>
            Present
          </Text>{' '}
          /{' '}
          <Text style={{ color: colors.danger, fontWeight: '600' }}>
            Absent
          </Text>{' '}
          after each class. Let the app handle shortage panic 😌.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Overall Attendance
            </Text>
            <Text
              style={{
                color: overall < 75 ? colors.danger : colors.success,
                fontSize: 32,
                fontWeight: '800',
              }}
            >
              {overall}%
            </Text>
          </View>
          {insights && (
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Most risky subject
              </Text>
              <Text
                style={{
                  color: colors.neonPink,
                  fontWeight: '700',
                  fontSize: 16,
                }}
              >
                {insights.lowest.name}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                Needs ~
                <Text
                  style={{
                    color: colors.neonCyan,
                    fontWeight: '700',
                  }}
                >
                  {insights.need}
                </Text>{' '}
                back-to-back classes to reach 75%.
              </Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <TextInput
            placeholder="Add subject (e.g. DAA)"
            placeholderTextColor={colors.textMuted}
            value={newSub}
            onChangeText={setNewSub}
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
            onPress={addSubject}
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
      </GlassCard>

      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Subjects"
          icon={<Ionicons name="book" size={22} color={colors.neonCyan} />}
        />
        {subjects.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            No subjects yet. Add one above.
          </Text>
        ) : (
          subjects.map((s) => {
            const pct = s.total
              ? Math.round((s.attended / s.total) * 100)
              : 0;
            const isLow = s.total > 0 && pct < 75;

            return (
              <View
                key={s.id}
                style={{
                  padding: 14,
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 12,
                  backgroundColor: 'rgba(15,23,42,0.6)',
                }}
              >
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: '700',
                      fontSize: 16,
                    }}
                  >
                    {s.name}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    {s.attended}/{s.total} classes
                  </Text>
                </View>

                <View
                  style={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: 'rgba(148,163,184,0.3)',
                    marginTop: 10,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: 999,
                      backgroundColor: isLow ? colors.danger : colors.success,
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      color: isLow ? colors.danger : colors.success,
                      fontSize: 13,
                    }}
                  >
                    {bunkOrAttendMessage(s, colors)}
                  </Text>
                  <Text
                    style={{ color: colors.textMuted, fontSize: 13, marginLeft: 8 }}
                  >
                    {pct}%
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => mark(s.id, true)}
                    style={[
                      styles.button,
                      { flex: 1, backgroundColor: colors.success },
                    ]}
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: '700',
                        fontSize: 14,
                      }}
                    >
                      Present
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => mark(s.id, false)}
                    style={[
                      styles.button,
                      {
                        flex: 1,
                        borderWidth: 1,
                        borderColor: colors.danger,
                        backgroundColor: 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: colors.danger,
                        fontWeight: '700',
                        fontSize: 14,
                      }}
                    >
                      Absent
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
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
