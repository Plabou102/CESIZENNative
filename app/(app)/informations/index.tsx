import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius, shadow, spacing } from "../../../constants/theme";
import api from "../../../services/api";

type Information = {
  id: number; title: string; summary: string;
  content: string; category: string; isActive: boolean;
};

export default function InformationsScreen() {
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/informations")
      .then(({ data }) => setInformations(data.filter((i: Information) => i.isActive)))
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
      <Text style={styles.title}>Informations</Text>
      <Text style={styles.subtitle}>Ressources sur la santé mentale et la gestion du stress.</Text>

      {informations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune information disponible.</Text>
        </View>
      ) : (
        informations.map((info) => (
          <TouchableOpacity
            key={info.id}
            style={styles.card}
            onPress={() => router.push(`/(app)/informations/${info.id}` as any)}
            activeOpacity={0.8}
          >
            {info.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{info.category}</Text>
              </View>
            )}
            <Text style={styles.cardTitle}>{info.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={3}>{info.summary}</Text>
            <Text style={styles.readMore}>Lire la suite →</Text>
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
  categoryBadge: {
    alignSelf: "flex-start", backgroundColor: colors.warningBg,
    borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3, marginBottom: spacing.sm,
  },
  categoryText: { fontSize: font.sizeXs, fontWeight: font.weightBold, color: colors.warning, textTransform: "uppercase", letterSpacing: 0.8 },
  cardTitle: { fontSize: font.sizeMd, fontWeight: font.weightSemibold, color: colors.text, marginBottom: spacing.xs },
  cardDescription: { fontSize: font.sizeSm, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.sm },
  readMore: { fontSize: font.sizeSm, color: colors.primary, fontWeight: font.weightSemibold },
});