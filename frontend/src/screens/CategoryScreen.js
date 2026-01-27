import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import client from '../api/client';
import ItemCard from '../components/ItemCard';

export default function CategoryScreen({ route }) {
  const { categoryId } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-400 text-lg text-center">No hay contenido disponible en esta categoría aún.</Text>
        </View>
      ) : (
        <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ItemCard item={item} />}
            contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}
