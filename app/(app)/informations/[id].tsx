import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius, spacing } from "../../../constants/theme";
import api from "../../../services/api";

type Information = { id: number; title: string; summary: string; content: string; category: string };

export default function InformationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [information, setInformation] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/informations/${id}`)
      .then(({ data }) => setInformation(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!information) return (
    <View style={styles.centered}>
      <Text style={{ color: colors.textMuted }}>Information introuvable.</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      {information.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{information.category}</Text>
        </View>
      )}
      <Text style={styles.title}>{information.title}</Text>
      <Text style={styles.summary}>{information.summary}</Text>
      <View style={styles.divider} />
      <Text style={styles.content}>{information.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  container: { padding: spacing.lg, backgroundColor: colors.bg, flexGrow: 1 },
  back: { marginTop: spacing.xxl, marginBottom: spacing.lg },
  backText: { fontSize: font.sizeMd, color: colors.primary, fontWeight: font.weightSemibold },
  categoryBadge: {
    alignSelf: "flex-start", backgroundColor: colors.warningBg,
    borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3, marginBottom: spacing.md,
  },
  categoryText: { fontSize: font.sizeXs, fontWeight: font.weightBold, color: colors.warning, textTransform: "uppercase", letterSpacing: 0.8 },
  title: { fontSize: font.sizeXl, fontWeight: font.weightBold, color: colors.text, marginBottom: spacing.md },
  summary: { fontSize: font.sizeMd, color: colors.textMuted, lineHeight: 24, fontStyle: "italic", marginBottom: spacing.lg },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  content: { fontSize: font.sizeMd, color: colors.text, lineHeight: 26 },
});