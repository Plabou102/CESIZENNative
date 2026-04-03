import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius, shadow, spacing } from "../../constants/theme";

const CARDS = [
  {
    route: "/informations",
    icon: "information-circle-outline" as const,
    title: "Informations",
    description: "Accédez à des ressources sur la santé mentale et la gestion du stress.",
    accent: colors.warning,
    accentBg: colors.warningBg,
  },
  {
    route: "/breathing",
    icon: "leaf-outline" as const,
    title: "Exercices de respiration",
    description: "Pratiquez des exercices de cohérence cardiaque pour réduire votre stress.",
    accent: colors.primary,
    accentBg: colors.primaryDim,
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CESIZen</Text>
        <Text style={styles.subtitle}>L'application de votre santé mentale</Text>
      </View>

      {/* Welcome banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Bienvenue sur CESIZen, votre espace dédié à la gestion du stress et au bien-être mental.
        </Text>
      </View>

      {/* Cards */}
      <Text style={styles.sectionLabel}>Que souhaitez-vous faire ?</Text>

      {CARDS.map((card) => (
        <TouchableOpacity
          key={card.route}
          style={styles.card}
          onPress={() => router.push(card.route as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: card.accentBg }]}>
            <Ionicons name={card.icon} size={26} color={card.accent} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.bg,
    flexGrow: 1,
  },
  header: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: font.sizeXxl,
    fontWeight: font.weightBold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: font.sizeSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  banner: {
    backgroundColor: colors.primaryDim,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  bannerText: {
    fontSize: font.sizeSm + 1,
    color: colors.primary,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: font.sizeXs,
    fontWeight: font.weightBold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    ...shadow.sm,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: font.sizeMd,
    fontWeight: font.weightSemibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: font.sizeSm,
    color: colors.textMuted,
    lineHeight: 18,
  },
});