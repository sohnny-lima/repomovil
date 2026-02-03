import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import client from '../../api/client';
import Colors from '../../constants/Colors';

const ICONS = ['folder', 'book-open-page-variant', 'youtube', 'music', 'clock-outline', 'link-variant', 'star', 'heart', 'school', 'earth'];
const COLORS = ['#6200EE', '#03DAC6', '#B00020', '#2563eb', '#ef4444', '#a855f7', '#059669', '#f59e0b', '#64748b'];

// Generic key mapping for DB (the user sees icons visually, DB stores simple keys if needed or just the icon name)
// For simplicity as per request: store simple keys "book", "video" etc mapped to icon names.
// Or just store the icon name directly if we want flexibility. 
// Request said: "iconKey" (e.g. "book") -> map to "book-open-page-variant".
// Let's implement the map as suggested.
const ICON_MAP = {
  folder: 'folder-outline',
  book: 'book-open-page-variant',
  video: 'youtube',
  music: 'music',
  clock: 'clock-outline',
  link: 'link-variant',
  star: 'star',
  heart: 'heart',
  school: 'school',
  earth: 'earth'
};

export default function AdminCategoryEditor({ navigation, route }) {
    const { mode, category } = route.params;
    const isEdit = mode === 'edit';

    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');
    const [iconKey, setIconKey] = useState(category?.iconKey || 'folder');
    const [iconColor, setIconColor] = useState(category?.iconColor || '#6200EE');
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
            const payload = {
                name,
                description,
                iconKey,
                iconColor
            };

            if (isEdit) {
                await client.put(`/admin/categories/${category.id}`, payload);
            } else {
                await client.post('/admin/categories', payload);
            }
            // Refresh list
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar la categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
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

            <Text style={styles.label}>Icono</Text>
            <View style={styles.iconGrid}>
                {Object.keys(ICON_MAP).map((key) => (
                    <TouchableOpacity
                        key={key}
                        style={[
                            styles.iconItem,
                            iconKey === key && styles.iconItemSelected
                        ]}
                        onPress={() => setIconKey(key)}
                    >
                        <MaterialCommunityIcons 
                            name={ICON_MAP[key]} 
                            size={24} 
                            color={iconKey === key ? '#fff' : '#666'} 
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorItem, 
                            { backgroundColor: color },
                            iconColor === color && styles.colorItemSelected
                        ]}
                        onPress={() => setIconColor(color)}
                    />
                ))}
            </View>

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
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: Colors.text },
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
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    iconItem: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
    },
    iconItemSelected: {
        backgroundColor: Colors.primary,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 30,
    },
    colorItem: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    colorItemSelected: {
        borderWidth: 3,
        borderColor: '#000',
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
