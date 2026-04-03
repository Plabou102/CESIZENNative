import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius, shadow, spacing } from "../../../constants/theme";
import api from "../../../services/api";

type BreathingExercise = {
  id: number; label: string; description: string;
  inhaleDuration: number; holdDuration: number; exhaleDuration: number;
  totalDuration: number; isActive: boolean;
};

export default function BreathingListScreen() {
  const [exercises, setExercises] = useState<BreathingExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/breathing-exercises")
      .then(({ data }) => setExercises(data.filter((e: BreathingExercise) => e.isActive)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Exercices de respiration</Text>
      <Text style={styles.subtitle}>Pratiquez la cohérence cardiaque pour réduire votre stress.</Text>

      {exercises.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun exercice disponible.</Text>
        </View>
      ) : (
        exercises.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={styles.card}
            onPress={() => router.push(`/(app)/breathing/${ex.id}` as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardTitle}>{ex.label}</Text>
            <Text style={styles.cardDescription}>{ex.description}</Text>
            <View style={styles.pills}>
              {[
                { label: `${ex.inhaleDuration}s`, hint: "Inspiration" },
                { label: `${ex.holdDuration}s`,   hint: "Apnée" },
                { label: `${ex.exhaleDuration}s`, hint: "Expiration" },
              ].map(({ label, hint }) => (
                <View key={hint} style={styles.pill}>
                  <Text style={styles.pillLabel}>{label}</Text>
                  <Text style={styles.pillHint}>{hint}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.duration}>Durée totale : {ex.totalDuration}s</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  container: { padding: spacing.lg, backgroundColor: colors.bg, flexGrow: 1 },
  title: { fontSize: font.sizeXl, fontWeight: font.weightBold, color: colors.text, marginTop: spacing.xxl, marginBottom: spacing.xs },
  subtitle: { fontSize: font.sizeSm, color: colors.textMuted, marginBottom: spacing.xl },
  empty: { alignItems: "center", marginTop: spacing.xl },
  emptyText: { color: colors.textLight, fontSize: font.sizeMd },
  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, ...shadow.sm,
  },
  cardTitle: { fontSize: font.sizeMd, fontWeight: font.weightSemibold, color: colors.text, marginBottom: spacing.xs },
  cardDescription: { fontSize: font.sizeSm, color: colors.textMuted, marginBottom: spacing.md },
  pills: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm, flexWrap: "wrap" },
  pill: {
    backgroundColor: colors.primaryDim, borderRadius: radius.md,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, alignItems: "center",
  },
  pillLabel: { fontSize: font.sizeSm, fontWeight: font.weightBold, color: colors.primary },
  pillHint: { fontSize: font.sizeXs, color: colors.primaryLight },
  duration: { fontSize: font.sizeXs, color: colors.textLight, marginTop: spacing.xs },
});