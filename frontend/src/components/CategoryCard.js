import React from 'react';
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';

export default function CategoryCard({ category, onPress }) {
  // Configuración de imagen/icono basado en el nombre (mock simple)
  // En producción esto vendría del backend
  const getIcon = () => {
    // Retorna una imagen aleatoria fija por ahora para simular el diseño
    return 'https://ui-avatars.com/api/?name=' + category.name.replace(' ', '+') + '&background=0D8ABC&color=fff&rounded=true&bold=true';
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-full mb-4 flex-row items-center p-2 pr-6 shadow-sm active:opacity-90"
      style={Platform.select({
        web: { boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.05)' },
        default: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }
      })}
      onPress={onPress}
    >
      <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mr-4">
          <Image 
            source={{ uri: getIcon() }} 
            className="w-full h-full"
            resizeMode="cover"
          />
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
