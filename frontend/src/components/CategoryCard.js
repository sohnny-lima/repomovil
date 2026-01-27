import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity 
      className="bg-white p-5 rounded-2xl mb-4 flex-row items-center shadow-sm active:opacity-80"
      style={Platform.select({
        web: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
        default: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }
      })}
      onPress={onPress}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900 mb-1">{category.name}</Text>
        {category.description && (
          <Text className="text-sm text-gray-500 leading-tight">{category.description}</Text>
        )}
      </View>
      <View className="ml-4 bg-gray-100 p-2 rounded-full">
        <Text className="text-xl text-primary font-bold">›</Text>
      </View>
    </TouchableOpacity>
  );
}
