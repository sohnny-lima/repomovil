import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import client from '../../api/client';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../../components/ItemCard';

export default function AdminItemsList({ navigation, route }) {
    const { category } = route.params;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [category.id])
    );

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: category.name,
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate('AdminItemEditor', { mode: 'create', categoryId: category.id })}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, category]);

    const fetchItems = async () => {
        try {
            const response = await client.get(`/categories/${category.id}/items`);
            setItems(response.data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudieron cargar los recursos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmar',
            '¿Estás seguro de eliminar este ítem?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await client.delete(`/admin/items/${id}`);
                            fetchItems();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el ítem');
                        }
                    }
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={{ flex: 1 }}>
                <ItemCard item={item} />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AdminItemEditor', { mode: 'edit', item, categoryId: category.id })}
                >
                    <Ionicons name="pencil" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash" size={24} color={Colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: 16 },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'column',
        marginLeft: 10,
        justifyContent: 'space-around',
    },
    actionBtn: {
        padding: 5,
        marginBottom: 5,
    }
});
