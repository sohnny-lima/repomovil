import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Image, StatusBar } from 'react-native';
import client from '../api/client';
import ItemCard from '../components/ItemCard';
import Colors from '../constants/Colors';

export default function CategoryScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set header title to empty or custom to avoid default native header clashing
  useEffect(() => {
    navigation.setOptions({ 
        headerTitle: '',
        headerTransparent: true,
        headerTintColor: '#fff' // White back arrow
    });
  }, [navigation]);

  useEffect(() => {
    fetchItems();
  }, [categoryId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/categories/${categoryId}/items`);
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#4b5563]">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#5b6575]"> 
      {/* 
        Using a dark gray-blue background to simulate the gradient in the screenshot 
        Ideally use expo-linear-gradient but sticking to tailwind colors for now.
      */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={{ padding: 20, paddingTop: 100 }}
        ListHeaderComponent={() => (
            <View className="items-center mb-10">
                 <View className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white/20 shadow-xl">
                    <Image 
                        source={{ uri: 'https://ui-avatars.com/api/?name=' + categoryName.replace(' ', '+') + '&background=random&size=256' }} 
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                 </View>
                 <Text className="text-2xl font-bold text-white mb-2 text-center uppercase tracking-wide">
                    {categoryName}
                 </Text>
                 <Text className="text-sm text-gray-200 text-center px-4 leading-relaxed">
                    Meditaciones y recursos para recibir el sábado en familia.
                 </Text>
                 
                 <View className="w-full mt-8 mb-2 border-b border-white/20 pb-2">
                    <Text className="text-white font-bold text-center uppercase text-sm tracking-widest">
                        Recursos Disponibles
                    </Text>
                 </View>
             </View>
        )}
        ListEmptyComponent={() => (
            <View className="justify-center items-center py-10">
                <Text className="text-gray-300 text-lg text-center">No hay contenido disponible.</Text>
            </View>
        )}
      />
    </View>
  );
}
