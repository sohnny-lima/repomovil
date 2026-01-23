import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { searchItems } from "@/constants/api";

export default function SearchScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const qq = q.trim();
    if (!qq) return;

    try {
      setError(null);
      setLoading(true);
      const data = await searchItems(qq);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Error en búsqueda");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.btn}>
          <ThemedText type="defaultSemiBold">← Volver</ThemedText>
        </Pressable>
        <ThemedText type="title" style={{ marginTop: 10 }}>
          Buscar
        </ThemedText>
      </View>

      <View style={styles.row}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Busca por título, descripción o url…"
          placeholderTextColor="#777"
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={run}
        />
        <Pressable style={styles.btn} onPress={run}>
          <ThemedText type="defaultSemiBold">Ir</ThemedText>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <ThemedText style={{ marginTop: 10 }}>Buscando…</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText type="subtitle">Error</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>{error}</ThemedText>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <ThemedText>Escribe algo y busca.</ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((it) => (
            <Pressable
              key={it.id}
              style={styles.card}
              onPress={() => Linking.openURL(it.url)}
            >
              <View style={{ flex: 1 }}>
                <ThemedText type="subtitle">{it.title}</ThemedText>
                <ThemedText style={styles.meta}>
                  {it.type} • {it.category?.name || "Sin categoría"}
                </ThemedText>
              </View>
              <ThemedText style={styles.arrow}>↗</ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  header: { marginBottom: 14 },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { marginTop: 14, gap: 10 },
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  meta: { marginTop: 6, opacity: 0.7, fontSize: 12 },
  arrow: { fontSize: 18, opacity: 0.6 },
});
