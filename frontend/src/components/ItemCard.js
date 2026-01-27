import React from 'react';
import { Text, View, TouchableOpacity, Linking, Image, Platform } from 'react-native';

const getTypeIcon = (type) => {
  // En un caso real usaríamos iconos de verdad (svg/image assets)
  // Por ahora simulamos con colores e iniciales o urls directas si fueran iconos
  switch (type) {
    case 'PDF': return { uri: 'https://cdn-icons-png.flaticon.com/512/337/337946.png', bg: 'bg-red-50' };
    case 'AUDIO': return { uri: 'https://cdn-icons-png.flaticon.com/512/3209/3209265.png', bg: 'bg-blue-50' };
    case 'IMAGE': return { uri: 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png', bg: 'bg-green-50' };
    case 'VIDEO': 
    case 'YOUTUBE': return { uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', bg: 'bg-red-50' };
    default: return { uri: 'https://cdn-icons-png.flaticon.com/512/2814/2814368.png', bg: 'bg-gray-50' };
  }
};

export default function ItemCard({ item }) {
  const iconConfig = getTypeIcon(item.type);

  const handlePress = async () => {
    if (item.url) {
      const supported = await Linking.canOpenURL(item.url);
      if (supported) await Linking.openURL(item.url);
    }
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-full mb-3 flex-row items-center p-2 pr-6 shadow-sm active:opacity-90"
      style={Platform.select({
        web: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)' },
        default: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }
      })}
      onPress={handlePress}
    >
      <View className={`w-12 h-12 rounded-full overflow-hidden justify-center items-center mr-4 ${iconConfig.bg}`}>
          {/* Si tuviera iconos de libreria: <Icon name="..." /> */}
          <Image 
            source={{ uri: iconConfig.uri }} 
            className="w-8 h-8"
            resizeMode="contain"
          />
      </View>
      
      <View className="flex-1 justify-center">
        <Text className="text-sm font-bold text-gray-800" numberOfLines={2}>
            {item.title}
        </Text>
      </View>

      <View className="ml-2">
        <Text className="text-gray-400 text-lg">⋮</Text>
      </View>
    </TouchableOpacity>
  );
}
