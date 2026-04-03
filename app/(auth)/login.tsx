import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, font, radius, spacing } from "../../constants/theme";
import api from "../../services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post("/auth/login", { email, password });
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      router.replace("/(app)");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoArea}>
        <Image
          source={require("../../assets/images/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>CESIZen</Text>
        <Text style={styles.subtitle}>L'application de votre santé mentale</Text>
      </View>

      <View style={styles.form}>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}

        <Text style={styles.label}>Adresse e-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="vous@example.com"
          placeholderTextColor={colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/(auth)/register" as any)}
        >
          <Text style={styles.registerText}>
            Pas encore de compte ?{" "}
            <Text style={styles.registerTextBold}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: spacing.sm,
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
    letterSpacing: 0.3,
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
  registerLink: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  registerText: {
    color: colors.textMuted,
    fontSize: font.sizeSm,
  },
  registerTextBold: {
    color: colors.primary,
    fontWeight: font.weightSemibold,
  },
});