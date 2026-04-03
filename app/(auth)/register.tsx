import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors, font, radius, spacing } from "../../constants/theme";
import api from "../../services/api";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      router.replace("/(auth)/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Erreur lors de l'inscription.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: keyof typeof form; label: string; secure?: boolean; keyboard?: any }[] = [
    { key: "firstName", label: "Prénom" },
    { key: "lastName",  label: "Nom" },
    { key: "email",     label: "Email", keyboard: "email-address" },
    { key: "password",  label: "Mot de passe", secure: true },
    { key: "confirmPassword", label: "Confirmer le mot de passe", secure: true },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez CESIZen</Text>

        <View style={styles.form}>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          {fields.map(({ key, label, secure, keyboard }) => (
            <View key={key}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={label}
                placeholderTextColor={colors.textLight}
                value={form[key]}
                onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                secureTextEntry={secure}
                keyboardType={keyboard}
                autoCapitalize={keyboard === "email-address" ? "none" : "sentences"}
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
          <Text style={styles.loginText}>
            Déjà un compte ?{" "}
            <Text style={styles.loginTextBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.bg,
  },
  title: {
    fontSize: font.sizeXl,
    fontWeight: font.weightBold,
    textAlign: "center",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: font.sizeSm,
    textAlign: "center",
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: font.sizeSm,
    fontWeight: font.weightSemibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 4,
    fontSize: font.sizeMd,
    color: colors.text,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  buttonText: {
    color: "white",
    fontSize: font.sizeMd,
    fontWeight: font.weightSemibold,
  },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(192,57,43,.15)",
  },
  errorText: {
    color: colors.danger,
    fontSize: font.sizeSm,
  },
  loginLink: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  loginText: {
    color: colors.textMuted,
    fontSize: font.sizeSm,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: font.weightSemibold,
  },
});