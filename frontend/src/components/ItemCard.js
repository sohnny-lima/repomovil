import React from 'react';
import { Text, View, TouchableOpacity, Linking, Platform } from 'react-native';

const getTypeConfig = (type) => {
  switch (type) {
    case 'YOUTUBE': return { color: 'text-youtube', bg: 'bg-youtube', label: 'YouTube' };
    case 'DRIVE': return { color: 'text-drive', bg: 'bg-drive', label: 'Drive' };
    case 'ONEDRIVE': return { color: 'text-onedrive', bg: 'bg-onedrive', label: 'OneDrive' };
    default: return { color: 'text-other', bg: 'bg-other', label: 'Link' };
  }
};

export default function ItemCard({ item }) {
  const { color, bg, label } = getTypeConfig(item.type);

  const handlePress = async () => {
    if (item.url) {
      const supported = await Linking.canOpenURL(item.url);
      if (supported) await Linking.openURL(item.url);
    }
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl mb-3 flex-row overflow-hidden shadow-sm active:opacity-90 border border-gray-100"
      style={Platform.select({
        web: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
        default: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }
      })}
      onPress={handlePress}
    >
      <View className={`w-2 ${bg}`} />
      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-1">
            <View className={`px-2 py-0.5 rounded-full bg-gray-100`}>
                <Text className={`text-[10px] font-bold uppercase ${color}`}>
                    {label}
                </Text>
            </View>
            <Text className="text-[10px] text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </View>
        <Text className="text-base font-semibold text-gray-800 mb-1 leading-snug">{item.title}</Text>
        {item.description && (
          <Text className="text-xs text-gray-500 line-clamp-2">{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
