import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import client from '../../api/client';
import Colors from '../../constants/Colors';

export default function AdminItemEditor({ navigation, route }) {
    const { mode, item, categoryId } = route.params;
    const isEdit = mode === 'edit';

    const [title, setTitle] = useState(item?.title || '');
    const [url, setUrl] = useState(item?.url || '');
    const [description, setDescription] = useState(item?.description || '');
    const [loading, setLoading] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Editar Multimedia' : 'Nuevo Multimedia',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!title.trim() || !url.trim()) {
            Alert.alert('Error', 'Título y URL son obligatorios');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title,
                url,
                description,
                categoryId: categoryId,
                // type is detected by backend automatically based on URL if omitted
            };

            if (isEdit) {
                await client.put(`/items/${item.id}`, payload);
            } else {
                await client.post('/items', payload);
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar el ítem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ej. Introducción a Álgebra"
            />

            <Text style={styles.label}>URL (Youtube, Drive, etc.)</Text>
            <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="https://..."
                autoCapitalize="none"
                keyboardType="url"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Detalles adicionales..."
                multiline
                numberOfLines={3}
            />

            <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveText}>Guardar</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: Colors.background },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: Colors.text },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
