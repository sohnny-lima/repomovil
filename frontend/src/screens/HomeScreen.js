import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Image, StatusBar } from 'react-native';
import client from '../api/client';
import CategoryCard from '../components/CategoryCard';
import Colors from '../constants/Colors';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await client.get('/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  // Mock de secciones para simular el diseño mientras no esté en backend
  const SECTIONS = [
    { title: 'RECEPCIÓN DE SÁBADO', data: categories.filter((_, i) => i % 4 === 0) },
    { title: 'MAYORDOMÍA EN 5 MINUTOS', data: categories.filter((_, i) => i % 4 === 1) },
    { title: '24h DE MAYORDOMÍA', data: categories.filter((_, i) => i % 4 === 2) },
    { title: 'REVIVE 2026', data: categories.filter((_, i) => i % 4 === 3) },
  ];
  
  // Si hay muy pocas categorías, mostrar todas en "OTROS" para no esconderlas
  const displayData = categories.length < 4 
    ? [{ title: 'RECURSOS DISPONIBLES', data: categories }] 
    : SECTIONS;

  const renderSection = ({ item }) => {
    if (!item.data || item.data.length === 0) return null;
    
    return (
        <View className="mb-6">
            <Text className="text-center font-bold text-gray-800 mb-3 tracking-wider text-xs">
                {item.title}
            </Text>
            {item.data.map(cat => (
                <CategoryCard
                    key={cat.id}
                    category={cat}
                    onPress={() => navigation.navigate('CategoryDetails', { 
                        categoryId: cat.id, 
                        categoryName: cat.name 
                    })}
                />
            ))}
        </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#dce4d9]">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#dce4d9]">
      <StatusBar barStyle="dark-content" backgroundColor="#dce4d9" />
      <FlatList
        data={displayData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSection}
        contentContainerStyle={{ padding: 20, paddingTop: 40 }}
        ListHeaderComponent={() => (
             <View className="items-center mb-8">
                 <View className="w-20 h-20 rounded-full overflow-hidden mb-4 shadow-md bg-white">
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2883/2883161.png' }} // Logo placeholder
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                 </View>
                 <Text className="text-2xl font-bold text-gray-900 mb-1">MAYORDOMÍA 2026</Text>
                 <Text className="text-sm text-gray-600">Unión Peruana del Sur</Text>
             </View>
        )}
      />
    </View>
  );
}
