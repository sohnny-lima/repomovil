import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import client from '../../api/client';
import Colors from '../../constants/Colors';

export default function AdminCategoryEditor({ navigation, route }) {
    const { mode, category } = route.params;
    const isEdit = mode === 'edit';

    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');
    const [loading, setLoading] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Editar Categoría' : 'Nueva Categoría',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await client.put(`/categories/${category.id}`, { name, description });
            } else {
                await client.post('/categories', { name, description });
            }
            // Refresh list
            navigation.goBack();
            // Note: Ideally we pass a callback or use a state manager to refresh the list, 
            // but going back usually triggers re-fetch if useEffect depends on focus or we use simple navigation params.
            // For now, in AdminCategoryList we used useEffect[], so we might need to manually trigger refresh or use a FocusEffect.
            // Let's rely on simple hack: pass param to previous screen or let user pull to refresh (not implemented yet).
            // Actually, navigation.goBack() doesn't unmount the previous screen in Stack, so useEffect[] wont run again.
            // I will fix AdminCategoryList to use useFocusEffect or add a refresh button.
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar la categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej. Matemáticas"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Breve descripción..."
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
        </View>
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
    },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
