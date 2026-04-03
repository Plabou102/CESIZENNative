import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from "react-native";
import { colors, font, radius, spacing } from "../../constants/theme";
import api from "../../services/api";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

export default function AccountScreen() {
  const [user, setUser]         = useState<User | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      setForm({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: "" });
    } catch {
      Alert.alert("Erreur", "Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const payload: Record<string, string> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };
      if (form.password) payload.passwordHash = form.password;
      await api.patch(`/users/${user?.id}`, payload);
      await fetchMe();
      setEditing(false);
    } catch {
      Alert.alert("Erreur", "Impossible de modifier le profil.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    router.replace("/(auth)/login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Avatar initials
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Fields */}
      <View style={styles.card}>
        {[
          { key: "firstName", label: "Prénom" },
          { key: "lastName",  label: "Nom" },
          { key: "email",     label: "Email", keyboard: "email-address" },
        ].map(({ key, label, keyboard }, i, arr) => (
          <View key={key} style={[styles.field, i < arr.length - 1 && styles.fieldBorder]}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form[key as keyof typeof form]}
                onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                keyboardType={keyboard as any}
                autoCapitalize={keyboard === "email-address" ? "none" : "sentences"}
                placeholderTextColor={colors.textLight}
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.[key as keyof User] as string}</Text>
            )}
          </View>
        ))}

        {editing && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nouveau mot de passe <Text style={styles.optional}>(optionnel)</Text></Text>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
              secureTextEntry
              placeholder="Laisser vide pour ne pas changer"
              placeholderTextColor={colors.textLight}
            />
          </View>
        )}
      </View>

      {/* Actions */}
      {editing ? (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginRight: spacing.sm }]}
            onPress={handleSave}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>Enregistrer</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonOutline, { flex: 1 }]}
            onPress={() => setEditing(false)}
          >
            <Text style={styles.buttonOutlineText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setEditing(true)} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Modifier mes informations</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  container: { padding: spacing.lg, backgroundColor: colors.bg, flexGrow: 1 },
  avatarWrap: {
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 72, height: 72, borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { color: "white", fontSize: font.sizeXl, fontWeight: font.weightBold },
  fullName: { fontSize: font.sizeLg, fontWeight: font.weightBold, color: colors.text },
  email: { fontSize: font.sizeSm, color: colors.textMuted, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  field: { padding: spacing.md },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  fieldLabel: {
    fontSize: font.sizeXs,
    fontWeight: font.weightBold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  fieldValue: { fontSize: font.sizeMd, color: colors.text },
  optional: { fontWeight: font.weightRegular, color: colors.textLight },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    fontSize: font.sizeMd,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: "row", marginBottom: spacing.md },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  buttonText: { color: "white", fontSize: font.sizeMd, fontWeight: font.weightSemibold },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  buttonOutlineText: { color: colors.primary, fontSize: font.sizeMd, fontWeight: font.weightSemibold },
  logoutButton: {
    padding: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.danger,
    marginBottom: spacing.xl,
  },
  logoutText: { color: colors.danger, fontSize: font.sizeMd, fontWeight: font.weightSemibold },
});