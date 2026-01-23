import React from "react";
import { Pressable, View, Text } from "react-native";
import { type Category } from "@/constants/api";

export default function CategoryCard({
  category,
  onPress,
}: {
  category: Category;
  onPress: () => void;
}) {
  const initial = (category.name?.trim()?.[0] || "C").toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl border border-slate-200 bg-white px-4 py-4 flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      }}
    >
      {/* Avatar / Icon */}
      <View className="h-12 w-12 rounded-2xl bg-slate-900 items-center justify-center">
        <Text className="text-white font-bold text-lg">{initial}</Text>
      </View>

      {/* Content */}
      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-slate-900">
          {category.name}
        </Text>

        {!!category.description && (
          <Text className="text-sm text-slate-600 mt-1" numberOfLines={2}>
            {category.description}
          </Text>
        )}
      </View>

      {/* Arrow */}
      <View className="ml-3 h-9 w-9 rounded-full border border-slate-200 bg-slate-50 items-center justify-center">
        <Text className="text-slate-700 text-xl">›</Text>
      </View>
    </Pressable>
  );
}
