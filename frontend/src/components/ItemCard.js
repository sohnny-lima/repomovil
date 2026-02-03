import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const ICON_MAP = {
  // Dynamic icons
  folder: 'folder-outline',
  book: 'book-open-page-variant',
  video: 'youtube', // map user selection 'video' to 'youtube' icon name
  youtube: 'youtube', 
  music: 'music',
  clock: 'clock-outline',
  link: 'link-variant',
  star: 'star',
  heart: 'heart',
  school: 'school',
  earth: 'earth',
  
  // Type fallbacks (if iconKey is missing)
  YOUTUBE: 'youtube',
  DRIVE: 'google-drive', // Note: Make sure 'google-drive' exists in MaterialCommunityIcons, otherwise fallback to cloud
  ONEDRIVE: 'cloud',
  OTHER: 'link',
};

// Safe fallback icon name if map fails
const FALLBACK_ICON = 'link';

export default function ItemCard({ item }) {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(item.url);
      if (supported) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert("Error", "No se puede abrir este enlace: " + item.url);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Ocurrió un error al intentar abrir el enlace.");
    }
  };

  // Decide icon: User custom icon > Type fallback > Default
  const rawKey = item.iconKey || item.type || 'OTHER';
  const iconName = ICON_MAP[rawKey] || ICON_MAP.OTHER || FALLBACK_ICON;
  
  // Decide color: User custom color > Type fallback color > Default primary
  let iconColor = item.iconColor;
  if (!iconColor) {
      // Fallback colors based on type if no custom color set
      if (item.type === 'YOUTUBE') iconColor = '#FF0000';
      else if (item.type === 'DRIVE') iconColor = '#1FA463';
      else if (item.type === 'ONEDRIVE') iconColor = '#0078D4';
      else iconColor = Colors.primary;
  }

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      activeOpacity={0.8}
    >
      <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: iconColor + '20' }}>
         <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
      </View>

      <View className="flex-1">
          <Text className="text-gray-600 text-sm italic" numberOfLines={2}>
             {item.description || "Ver recurso"}
          </Text>
      </View>

      <MaterialCommunityIcons name="open-in-new" size={20} color={Colors.primary} />
    </TouchableOpacity>
  );
}
