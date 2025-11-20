// app/cgpa.js
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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

export default function CGPAScreen() {
  const { appState, setPart, colors } = useAppContext();
  const cgpaData = appState.cgpaData || {
    currentCgpa: '',
    currentCredits: '',
    thisSemSgpa: '',
    thisSemCredits: '',
  };

  const [subjects, setSubjects] = useState([
    { id: '1', name: 'Sub 1', credits: '4', gradePoint: '8' },
    { id: '2', name: 'Sub 2', credits: '4', gradePoint: '9' },
  ]);
  const [sgpa, setSgpa] = useState(null);
  const [overall, setOverall] = useState(null);

  const updateSubject = (id, field, value) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: `Sub ${prev.length + 1}`,
        credits: '4',
        gradePoint: '8',
      },
    ]);
  };

  const calcSgpa = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    subjects.forEach((s) => {
      const c = parseFloat(s.credits || '0');
      const g = parseFloat(s.gradePoint || '0');
      if (c > 0 && g >= 0) {
        totalCredits += c;
        totalPoints += c * g;
      }
    });
    if (!totalCredits) {
      setSgpa(null);
      return;
    }
    const res = totalPoints / totalCredits;
    setSgpa(res.toFixed(2));
    // also push into thisSemSgpa
    setPart('cgpaData', (prev) => ({
      ...prev,
      thisSemSgpa: res.toFixed(2),
      thisSemCredits: String(totalCredits),
    }));
  };

  const calcOverall = () => {
    const currentCgpa = parseFloat(cgpaData.currentCgpa || '0');
    const currentCredits = parseFloat(cgpaData.currentCredits || '0');
    const thisSemSgpa = parseFloat(cgpaData.thisSemSgpa || '0');
    const thisSemCredits = parseFloat(cgpaData.thisSemCredits || '0');

    if (currentCredits + thisSemCredits === 0) {
      setOverall(null);
      return;
    }
    const res =
      (currentCgpa * currentCredits +
        thisSemSgpa * thisSemCredits) /
      (currentCredits + thisSemCredits);
    setOverall(res.toFixed(2));
  };

  const updateCgField = (field, value) => {
    setPart('cgpaData', (prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 18 }}
    >
      {/* Semester SGPA from subjects */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Semester SGPA (Subject-wise)"
          icon={<MaterialIcons name="calculate" size={22} color={colors.neonCyan} />}
        />
        <Text
          style={{ color: colors.textMuted, fontSize: 14, marginBottom: 8 }}
        >
          Enter each subject&apos;s credits and grade point (0–10). We&apos;ll
          compute your semester SGPA.
        </Text>

        {subjects.map((sub) => (
          <View
            key={sub.id}
            style={{
              flexDirection: 'row',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: colors.textMuted, fontSize: 12 }}
              >
                Subject
              </Text>
              <TextInput
                value={sub.name}
                onChangeText={(v) => updateSubject(sub.id, 'name', v)}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: appBackgroundForInput(
                      colors.bgSecondary,
                      colors.bg
                    ),
                  },
                ]}
                placeholder="Subject"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ width: 70 }}>
              <Text
                style={{ color: colors.textMuted, fontSize: 12 }}
              >
                Credits
              </Text>
              <TextInput
                value={sub.credits}
                onChangeText={(v) =>
                  updateSubject(sub.id, 'credits', v)
                }
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: appBackgroundForInput(
                      colors.bgSecondary,
                      colors.bg
                    ),
                  },
                ]}
                placeholder="4"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ width: 80 }}>
              <Text
                style={{ color: colors.textMuted, fontSize: 12 }}
              >
                Grade
              </Text>
              <TextInput
                value={sub.gradePoint}
                onChangeText={(v) =>
                  updateSubject(sub.id, 'gradePoint', v)
                }
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: appBackgroundForInput(
                      colors.bgSecondary,
                      colors.bg
                    ),
                  },
                ]}
                placeholder="8"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <TouchableOpacity
            onPress={addSubject}
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
              name="add-circle-outline"
              size={18}
              color={colors.neonCyan}
            />
            <Text
              style={{
                color: colors.text,
                fontWeight: '700',
                fontSize: 14,
              }}
            >
              Add Subject
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={calcSgpa}
            style={[
              styles.button,
              { flex: 1, backgroundColor: colors.accent },
            ]}
          >
            <Text
              style={{ color: 'white', fontWeight: '700', fontSize: 14 }}
            >
              Calculate SGPA
            </Text>
          </TouchableOpacity>
        </View>

        {sgpa && (
          <View
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.accent,
              backgroundColor: colors.accentSoft,
            }}
          >
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              This Semester SGPA
            </Text>
            <Text
              style={{
                color: colors.neonCyan,
                fontSize: 26,
                fontWeight: '800',
              }}
            >
              {sgpa}
            </Text>
          </View>
        )}
      </GlassCard>

      {/* Overall CGPA */}
      <GlassCard colors={colors}>
        <SectionTitle
          colors={colors}
          label="Overall CGPA"
          icon={<Ionicons name="calculator" size={22} color={colors.neonCyan} />}
        />

        <Text
          style={{ color: colors.textMuted, fontSize: 14, marginBottom: 8 }}
        >
          Enter your current CGPA & total credits, plus this semester&apos;s SGPA
          and credits. We&apos;ll show the new CGPA.
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              Current CGPA
            </Text>
            <TextInput
              value={cgpaData.currentCgpa}
              onChangeText={(v) =>
                updateCgField('currentCgpa', v)
              }
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: appBackgroundForInput(
                    colors.bgSecondary,
                    colors.bg
                  ),
                },
              ]}
              placeholder="8.2"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              Current Credits
            </Text>
            <TextInput
              value={cgpaData.currentCredits}
              onChangeText={(v) =>
                updateCgField('currentCredits', v)
              }
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: appBackgroundForInput(
                    colors.bgSecondary,
                    colors.bg
                  ),
                },
              ]}
              placeholder="60"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              This Sem SGPA
            </Text>
            <TextInput
              value={cgpaData.thisSemSgpa}
              onChangeText={(v) =>
                updateCgField('thisSemSgpa', v)
              }
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: appBackgroundForInput(
                    colors.bgSecondary,
                    colors.bg
                  ),
                },
              ]}
              placeholder="9.0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              This Sem Credits
            </Text>
            <TextInput
              value={cgpaData.thisSemCredits}
              onChangeText={(v) =>
                updateCgField('thisSemCredits', v)
              }
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: appBackgroundForInput(
                    colors.bgSecondary,
                    colors.bg
                  ),
                },
              ]}
              placeholder="20"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={calcOverall}
          style={[
            styles.button,
            { backgroundColor: colors.accent, marginBottom: 8 },
          ]}
        >
          <Text
            style={{ color: 'white', fontWeight: '700', fontSize: 14 }}
          >
            Calculate Overall CGPA
          </Text>
        </TouchableOpacity>

        {overall && (
          <View
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.accent,
              backgroundColor: colors.accentSoft,
            }}
          >
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
            >
              New Overall CGPA
            </Text>
            <Text
              style={{
                color: colors.neonCyan,
                fontSize: 26,
                fontWeight: '800',
              }}
            >
              {overall}
            </Text>
          </View>
        )}
      </GlassCard>
    </ScrollView>
  );
}
