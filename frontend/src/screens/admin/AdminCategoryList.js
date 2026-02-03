import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert, TouchableOpacity, Text, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import client from '../../api/client';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function AdminCategoryList({ navigation }) {
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
            Alert.alert('Error', 'No se pudieron cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmar',
            '¿Estás seguro de eliminar esta categoría? Se borrarán todos sus contenidos.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await client.delete(`/admin/categories/${id}`);
                            fetchCategories();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la categoría');
                        }
                    }
                },
            ]
        );
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate('AdminCategoryEditor', { mode: 'create' })}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AdminCategoryEditor', { mode: 'edit', category: item })}
                >
                    <Ionicons name="pencil" size={20} color={Colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AdminItemsList', { category: item })}
                >
                    <Ionicons name="list" size={20} color={Colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash" size={20} color={Colors.error} />
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
                    data={categories}
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            },
        }),
    },
    info: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold' },
    desc: { fontSize: 13, color: '#666' },
    actions: { flexDirection: 'row' },
    actionBtn: { padding: 8, marginLeft: 8 },
});
