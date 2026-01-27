import React from 'react';
import { View, Text } from 'react-native';

export default function NativeWindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4 border border-gray-200 rounded-lg shadow-md my-4">
      <Text className="text-xl font-bold text-blue-500 mb-2">
        NativeWind funcionando 🚀
      </Text>
      <Text className="text-gray-600 text-center">
        Si ves esto estilizado, la configuración es correcta.
      </Text>
    </View>
  );
}
