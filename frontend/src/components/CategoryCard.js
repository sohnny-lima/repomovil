import React from 'react';
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ICON_MAP = {
  folder: 'folder-outline',
  book: 'book-open-page-variant',
  video: 'youtube',
  music: 'music',
  clock: 'clock-outline',
  link: 'link-variant',
  star: 'star',
  heart: 'heart',
  school: 'school',
  earth: 'earth'
};

export default function CategoryCard({ category, onPress }) {
  const iconName = ICON_MAP[category.iconKey] || ICON_MAP.folder;
  const color = category.iconColor || '#2563eb'; // Default to a nice blue if not set

  return (
    <TouchableOpacity 
      className="bg-white rounded-full mb-4 flex-row items-center p-2 pr-6 shadow-sm active:opacity-90"
      style={Platform.select({
        web: { boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.05)' },
        default: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }
      })}
      onPress={onPress}
    >
      <View className="w-12 h-12 rounded-full overflow-hidden items-center justify-center bg-gray-50 mr-4">
           {/* Fallback to image if no icon key found? Or just simple icon */}
           <MaterialCommunityIcons name={iconName} size={24} color={color} />
      </View>
      
      <View className="flex-1 justify-center">
        <Text className="text-sm font-bold text-gray-800 uppercase" numberOfLines={1}>
            {category.name} | Recursos
        </Text>
      </View>

      <View className="ml-2">
        <Text className="text-gray-400 text-lg">⋮</Text>
      </View>
    </TouchableOpacity>
  );
}
