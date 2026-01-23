import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Link, useRouter } from "expo-router";

import { getCategories, type Category } from "@/constants/api";
import CategoryCard from "@/components/CategoryCard";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getCategories();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Error cargando categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 pt-8">
      {/* Header */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2">
              <View className="h-10 w-10 rounded-2xl bg-slate-900 items-center justify-center">
                <View className="h-2 w-2 rounded-full bg-white" />
              </View>
              <View>
                <View className="flex-row items-center">
                  <Pressable onPress={load}>{/* título */}</Pressable>
                </View>
              </View>
            </View>

            <View className="mt-3">
              <View className="flex-row items-end justify-between">
                <View>
                  <View className="flex-row items-center">
                    <View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                    <View>
                      <TextTitle>RepoMovil</TextTitle>
                      <TextSubtitle>
                        Links multimedia por categorías
                      </TextSubtitle>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={load}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <TextBtn>Recargar</TextBtn>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="mt-4 flex-row gap-2">
          <Link href="/search" asChild>
            <Pressable className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 active:opacity-90">
              <TextBtn className="text-white text-center">Buscar</TextBtn>
            </Pressable>
          </Link>

          <Pressable
            onPress={load}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 active:opacity-90"
          >
            <TextBtn>↻</TextBtn>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <TextMuted className="mt-3">Cargando…</TextMuted>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-5">
            <TextTitle className="text-rose-700">Error</TextTitle>
            <TextMuted className="mt-2 text-rose-700">{error}</TextMuted>
            <TextMuted className="mt-3 text-slate-600">
              Verifica que el backend esté corriendo y que BASE_URL tenga tu IP
              del PC (ej: 192.168.100.10).
            </TextMuted>
          </View>
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <TextTitle>No hay categorías</TextTitle>
            <TextMuted className="mt-2">
              Crea categorías desde el panel admin o agrega datos de prueba.
            </TextMuted>
          </View>
        </View>
      ) : (
        <View className="gap-3">
          {items.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onPress={() => router.push(`/category/${c.id}`)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Helpers simples para texto (no dependen de ThemedText)
 * Así evitas conflictos con estilos y confirmas Tailwind.
 */
import { Text } from "react-native";

function TextTitle({ children, className = "" }: any) {
  return (
    <Text className={`text-2xl font-bold text-slate-900 ${className}`}>
      {children}
    </Text>
  );
}

function TextSubtitle({ children, className = "" }: any) {
  return (
    <Text className={`text-sm text-slate-600 ${className}`}>{children}</Text>
  );
}

function TextMuted({ children, className = "" }: any) {
  return (
    <Text className={`text-sm text-slate-600 ${className}`}>{children}</Text>
  );
}

function TextBtn({ children, className = "" }: any) {
  return (
    <Text className={`text-sm font-semibold text-slate-900 ${className}`}>
      {children}
    </Text>
  );
}
