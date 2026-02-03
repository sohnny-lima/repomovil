import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StatusBar, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';
import CategoryCard from '../components/CategoryCard';
import Colors from '../constants/Colors';

export default function HomeScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchCategories();
        }, [])
    );

    const fetchCategories = async () => {
        try {
            const response = await client.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderCategoryItem = ({ item: cat }) => (
        <View className="mb-6">
            {/* The "Title above the card" which is the category name */}
            <Text className="text-center font-bold text-gray-800 mb-3 tracking-wider text-xs uppercase">
                {cat.name}
            </Text>
            
            <CategoryCard
                category={cat}
                onPress={() => navigation.navigate('CategoryDetails', { 
                    categoryId: cat.id, 
                    categoryName: cat.name,
                    categoryDescription: cat.description,
                    iconKey: cat.iconKey,
                    iconColor: cat.iconColor
                })}
            />
        </View>
    );

    return (
        <View className="flex-1 bg-[#dce4d9]">
            <StatusBar barStyle="dark-content" backgroundColor="#dce4d9" />
            
            {/* Header / Logo Area */}
             <View className="items-center mt-10 mb-8">
                 <View className="w-20 h-20 rounded-full overflow-hidden mb-4 shadow-md bg-white">
                    <Image 
                        source={require('../../assets/logos/logo.png')} 
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                 </View>
                 <Text className="text-xl font-bold text-[#2d3748] tracking-widest text-center">
                    MAYORDOMÍA 2026
                 </Text>
                 <Text className="text-sm font-medium text-[#718096] uppercase tracking-widest text-center mt-1">
                    Unión Peruana del Sur
                 </Text>
             </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} className="mt-10" />
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(cat) => cat.id}
                    renderItem={renderCategoryItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    ListEmptyComponent={() => (
                        <View className="items-center mt-10 p-5">
                            <Text className="text-gray-500 text-center">
                                No hay categorías disponibles.
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
