// app/cgpa.js
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import { useApp, useThemeColors } from '../context/AppContext';

function calcSemesterGpa(subjects) {
  let totalCredits = 0;
  let weighted = 0;
  subjects.forEach((s) => {
    const c = parseFloat(s.credits || '0');
    const g = parseFloat(s.grade || '0');
    if (!isNaN(c) && !isNaN(g)) {
      totalCredits += c;
      weighted += c * g;
    }
  });
  if (totalCredits === 0) return { gpa: null, credits: 0 };
  return { gpa: weighted / totalCredits, credits: totalCredits };
}

export default function CGPAScreen() {
  const { state, setPart } = useApp();
  const { colors } = useThemeColors();
  const [local, setLocal] = useState(state.cgpaData);
  const [semResult, setSemResult] = useState(null);
  const [overallResult, setOverallResult] = useState(null);

  const updateAndStore = (next) => {
    setLocal(next);
    setPart('cgpaData', next);
  };

  const updateSubjectField = (id, field, value) => {
    const subjects = local.subjects.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    updateAndStore({ ...local, subjects });
  };

  const addSubject = () => {
    const newSub = {
      id: Date.now().toString(),
      name: '',
      credits: '',
      grade: '',
    };
    updateAndStore({ ...local, subjects: [...local.subjects, newSub] });
  };

  const calculate = () => {
    const { gpa, credits } = calcSemesterGpa(local.subjects);
    if (!gpa || credits === 0) {
      setSemResult(null);
      setOverallResult(null);
      return;
    }
    setSemResult({ gpa: gpa.toFixed(2), credits });

    const existingCg = parseFloat(local.existingCgpa || '0');
    const existingCr = parseFloat(local.existingCredits || '0');

    if (existingCr === 0 && credits === 0) {
      setOverallResult(null);
      return;
    }

    const newOverall =
      (existingCg * existingCr + gpa * credits) / (existingCr + credits);

    setOverallResult({
      cgpa: newOverall.toFixed(2),
      totalCredits: existingCr + credits,
    });
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}
    >
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="CGPA Planner"
          icon={<Ionicons name="calculator" size={24} color={colors.neonCyan} />}
        />
        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 10 }}>
          Enter your **existing overall CGPA & credits**, then add subjects of
          this sem with their **credits & grade points**. We’ll show:
          {'\n'}• Semester GPA{'\n'}• Updated overall CGPA
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Existing Overall CGPA
            </Text>
            <TextInput
              value={local.existingCgpa}
              onChangeText={(v) =>
                updateAndStore({ ...local, existingCgpa: v })
              }
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'rgba(15,23,42,0.6)',
                },
              ]}
              placeholder="e.g. 8.2"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Existing Total Credits
            </Text>
            <TextInput
              value={local.existingCredits}
              onChangeText={(v) =>
                updateAndStore({ ...local, existingCredits: v })
              }
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'rgba(15,23,42,0.6)',
                },
              ]}
              placeholder="e.g. 60"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>
      </GlassCard>

      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Current Semester (subject-wise)"
          icon={
            <MaterialIcons
              name="menu-book"
              size={24}
              color={colors.neonCyan}
            />
          }
        />
        <Text style={{ color: colors.textMuted, fontSize: 14, marginBottom: 10 }}>
          For each subject, fill:
          {'\n'}• Name (optional, just for you){'\n'}• Credits (e.g. 3, 4){'\n'}
          • Grade point (e.g. 10, 9, 8 etc.)
        </Text>

        {local.subjects.map((s) => (
          <View
            key={s.id}
            style={{
              padding: 14,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: 'rgba(15,23,42,0.7)',
              marginBottom: 10,
            }}
          >
            <TextInput
              placeholder="Subject name (e.g. DSA)"
              placeholderTextColor={colors.textMuted}
              value={s.name}
              onChangeText={(v) => updateSubjectField(s.id, 'name', v)}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'rgba(15,23,42,0.7)',
                  marginBottom: 8,
                },
              ]}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                  Credits
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={s.credits}
                  onChangeText={(v) => updateSubjectField(s.id, 'credits', v)}
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: 'rgba(15,23,42,0.7)',
                    },
                  ]}
                  placeholder="e.g. 4"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                  Grade Point
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={s.grade}
                  onChangeText={(v) => updateSubjectField(s.id, 'grade', v)}
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: 'rgba(15,23,42,0.7)',
                    },
                  ]}
                  placeholder="e.g. 9"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={addSubject}
          style={[
            styles.button,
            {
              backgroundColor: colors.accentSoft,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            },
          ]}
        >
          <Ionicons name="add" size={18} color={colors.neonCyan} />
          <Text
            style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}
          >
            Add another subject
          </Text>
        </TouchableOpacity>
      </GlassCard>

      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Results"
          icon={<MaterialIcons name="insights" size={24} color={colors.neonCyan} />}
        />
        <TouchableOpacity
          onPress={calculate}
          style={[
            styles.button,
            { backgroundColor: colors.accent, marginBottom: 12 },
          ]}
        >
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>
            Calculate semester & overall CGPA
          </Text>
        </TouchableOpacity>

        {semResult && (
          <View
            style={{
              padding: 14,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.accent,
              backgroundColor: colors.accentSoft,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              This semester GPA
            </Text>
            <Text
              style={{
                color: colors.neonCyan,
                fontSize: 26,
                fontWeight: '800',
              }}
            >
              {semResult.gpa} ({semResult.credits} credits)
            </Text>
          </View>
        )}

        {overallResult && (
          <View
            style={{
              padding: 14,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.success,
              backgroundColor: 'rgba(22,163,74,0.15)',
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Updated overall CGPA
            </Text>
            <Text
              style={{
                color: colors.success,
                fontSize: 26,
                fontWeight: '800',
              }}
            >
              {overallResult.cgpa}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
              Total credits considered: {overallResult.totalCredits}
            </Text>
          </View>
        )}

        {!semResult && !overallResult && (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            Fill subject credits + grade points and hit **Calculate** to see
            semester GPA and overall CGPA.
          </Text>
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
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
