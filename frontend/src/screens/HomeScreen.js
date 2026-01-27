import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';
import CategoryCard from '../components/CategoryCard';

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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-error text-lg text-center font-medium">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => navigation.navigate('CategoryDetails', { 
                categoryId: item.id, 
                categoryName: item.name 
            })}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={() => (
             <View className="mb-6 mt-2">
                 <Text className="text-2xl font-bold text-gray-800">Explora</Text>
                 <Text className="text-base text-gray-500">Tus recursos educativos</Text>
             </View>
        )}
      />
    </View>
  );
}
