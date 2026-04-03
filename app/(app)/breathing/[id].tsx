import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius, spacing } from "../../../constants/theme";
import api from "../../../services/api";

type BreathingExercise = {
  id: number; label: string; description: string;
  inhaleDuration: number; holdDuration: number;
  exhaleDuration: number; totalDuration: number;
};

type Phase = "idle" | "inhale" | "hold" | "exhale" | "done";

const PHASE_COLORS: Record<Phase, string> = {
  idle:   colors.primary,
  inhale: colors.primary,
  hold:   colors.warning,
  exhale: colors.primaryLight,
  done:   colors.primary,
};

export default function BreathingDetailScreen() {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<BreathingExercise | null>(null);
  const [loading, setLoading]   = useState(true);
  const [phase, setPhase]       = useState<Phase>("idle");
  const [phaseLabel, setPhaseLabel] = useState("Prêt ?");
  const [timeLeft, setTimeLeft] = useState(0);
  const scale      = useRef(new Animated.Value(1)).current;
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef= useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.get(`/breathing-exercises/${id}`)
      .then(({ data }) => setExercise(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id]);

  const startCountdown = (duration: number, onEnd: () => void) => {
    setTimeLeft(duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => { if (prev <= 1) { clearInterval(intervalRef.current!); return 0; } return prev - 1; });
    }, 1000);
    timerRef.current = setTimeout(onEnd, duration * 1000);
  };

  const runCycle = (ex: BreathingExercise, elapsed: number) => {
    if (elapsed >= ex.totalDuration) {
      setPhase("done"); setPhaseLabel("Terminé !"); scale.setValue(1); return;
    }
    setPhase("inhale"); setPhaseLabel("Inspirez");
    Animated.timing(scale, { toValue: 1.8, duration: ex.inhaleDuration * 1000, useNativeDriver: true }).start();
    startCountdown(ex.inhaleDuration, () => {
      if (ex.holdDuration > 0) {
        setPhase("hold"); setPhaseLabel("Retenez");
        startCountdown(ex.holdDuration, () => {
          setPhase("exhale"); setPhaseLabel("Expirez");
          Animated.timing(scale, { toValue: 1, duration: ex.exhaleDuration * 1000, useNativeDriver: true }).start();
          startCountdown(ex.exhaleDuration, () => runCycle(ex, elapsed + ex.inhaleDuration + ex.holdDuration + ex.exhaleDuration));
        });
      } else {
        setPhase("exhale"); setPhaseLabel("Expirez");
        Animated.timing(scale, { toValue: 1, duration: ex.exhaleDuration * 1000, useNativeDriver: true }).start();
        startCountdown(ex.exhaleDuration, () => runCycle(ex, elapsed + ex.inhaleDuration + ex.exhaleDuration));
      }
    });
  };

  const handleStart = () => { if (exercise) runCycle(exercise, 0); };
  const handleStop  = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("idle"); setPhaseLabel("Prêt ?"); scale.setValue(1);
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!exercise) return <View style={styles.centered}><Text style={{ color: colors.textMuted }}>Exercice introuvable.</Text></View>;

  const circleColor = PHASE_COLORS[phase];
  const isRunning = phase === "inhale" || phase === "hold" || phase === "exhale";

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{exercise.label}</Text>
      <Text style={styles.description}>{exercise.description}</Text>

      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { backgroundColor: circleColor, transform: [{ scale }] }]}>
          <Text style={styles.phaseLabel}>{phaseLabel}</Text>
          {isRunning && <Text style={styles.timer}>{timeLeft}s</Text>}
        </Animated.View>
      </View>

      {phase === "idle" && (
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Démarrer</Text>
        </TouchableOpacity>
      )}
      {isRunning && (
        <TouchableOpacity style={styles.buttonStop} onPress={handleStop} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Arrêter</Text>
        </TouchableOpacity>
      )}
      {phase === "done" && (
        <TouchableOpacity style={styles.button} onPress={handleStop} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Recommencer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, alignItems: "center" },
  back: { alignSelf: "flex-start", marginTop: spacing.xxl, marginBottom: spacing.md },
  backText: { fontSize: font.sizeMd, color: colors.primary, fontWeight: font.weightSemibold },
  title: { fontSize: font.sizeXl, fontWeight: font.weightBold, color: colors.text, textAlign: "center", marginBottom: spacing.xs },
  description: { fontSize: font.sizeSm, color: colors.textMuted, textAlign: "center", marginBottom: spacing.xxl },
  circleContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  circle: {
    width: 160, height: 160, borderRadius: 80,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#1A1A2E", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  phaseLabel: { color: "white", fontSize: font.sizeLg, fontWeight: font.weightSemibold },
  timer: { color: "white", fontSize: font.sizeXl, fontWeight: font.weightBold, marginTop: spacing.xs },
  button: {
    backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md,
    alignItems: "center", width: "100%", marginBottom: spacing.xl,
  },
  buttonStop: {
    backgroundColor: colors.danger, padding: spacing.md, borderRadius: radius.md,
    alignItems: "center", width: "100%", marginBottom: spacing.xl,
  },
  buttonText: { color: "white", fontSize: font.sizeMd, fontWeight: font.weightSemibold },
});