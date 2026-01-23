import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getItemsByCategory, type Item } from "@/constants/api";

export default function CategoryItemsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const categoryId = useMemo(() => String(id || ""), [id]);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getItemsByCategory(categoryId);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Error cargando items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (categoryId) load();
  }, [categoryId]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.btn}>
          <ThemedText type="defaultSemiBold">← Volver</ThemedText>
        </Pressable>
        <ThemedText type="title" style={{ marginTop: 10 }}>
          Links
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <ThemedText style={{ marginTop: 10 }}>Cargando…</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText type="subtitle">Error</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>{error}</ThemedText>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <ThemedText>No hay links en esta categoría.</ThemedText>
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
                {!!it.description && (
                  <ThemedText style={styles.desc}>{it.description}</ThemedText>
                )}
                <ThemedText style={styles.meta}>
                  {it.type} • {new Date(it.createdAt).toLocaleDateString()}
                </ThemedText>
              </View>
              <ThemedText style={styles.arrow}>↗</ThemedText>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable style={[styles.btn, { marginTop: 14 }]} onPress={load}>
        <ThemedText type="defaultSemiBold">Recargar</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  header: { marginBottom: 14 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: "flex-start",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { gap: 10 },
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  desc: { marginTop: 6, opacity: 0.8 },
  meta: { marginTop: 8, opacity: 0.7, fontSize: 12 },
  arrow: { fontSize: 18, opacity: 0.6 },
});
