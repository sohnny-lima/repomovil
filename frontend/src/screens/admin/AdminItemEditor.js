import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import client from '../../api/client';
import Colors from '../../constants/Colors';

const ICONS = ['folder', 'book-open-page-variant', 'youtube', 'music', 'clock-outline', 'link-variant', 'star', 'heart', 'school', 'earth'];
const COLORS = ['#6200EE', '#03DAC6', '#B00020', '#2563eb', '#ef4444', '#a855f7', '#059669', '#f59e0b', '#64748b'];

export default function AdminItemEditor({ navigation, route }) {
    const { mode, item, categoryId } = route.params;
    const isEdit = mode === 'edit';

    const [title, setTitle] = useState(item?.title || '');
    const [url, setUrl] = useState(item?.url || '');
    const [description, setDescription] = useState(item?.description || '');
    const [iconKey, setIconKey] = useState(item?.iconKey || 'folder');
    const [iconColor, setIconColor] = useState(item?.iconColor || Colors.primary);
    const [loading, setLoading] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Editar Multimedia' : 'Nuevo Multimedia',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'El título es obligatorio');
            return;
        }

        // Logic 1: Trim and log raw value
        let rawUrl = url.trim();
        console.log("URL RAW:", JSON.stringify(rawUrl));

        // Logic 2: Auto-prepend protocol if missing (simple heuristic)
        // If it doesn't start with http:// or https://, add https://
        if (!/^https?:\/\//i.test(rawUrl)) {
             rawUrl = 'https://' + rawUrl;
             console.log("URL Modified:", rawUrl);
        }

        // Logic 3: Validate using new URL()
        const isValidUrl = (value) => {
            try {
                const u = new URL(value);
                return u.protocol === "http:" || u.protocol === "https:";
            } catch (e) {
                return false;
            }
        };

        if (!isValidUrl(rawUrl)) {
             Alert.alert('Error', 'Por favor ingrese una URL válida (ej. youtube.com)');
             return;
        }

        setLoading(true);
        try {
            const endpoint = isEdit 
                ? `/admin/items/${item.id}`
                : `/admin/items`;
            
            const payload = {
                categoryId: categoryId,
                title,
                url: rawUrl, // Send the cleaned, absolute URL
                description,
                iconKey,
                iconColor,
                type: item?.type || 'OTHER' 
            };

            if (isEdit) {
                await client.put(endpoint, payload);
            } else {
                await client.post(endpoint, payload);
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.errors?.fieldErrors?.url?.[0] || 'No se pudo guardar el ítem';
            Alert.alert('Error', msg);
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

            <Text style={styles.label}>Icono</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
                {ICONS.map(icon => (
                    <TouchableOpacity
                        key={icon}
                        style={[
                            styles.iconOption, 
                            iconKey === icon && { backgroundColor: Colors.primary + '20', borderColor: Colors.primary }
                        ]}
                        onPress={() => setIconKey(icon)}
                    >
                         <MaterialCommunityIcons 
                            name={icon} 
                            size={28} 
                            color={iconKey === icon ? Colors.primary : '#666'} 
                         />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.label}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
                {COLORS.map(color => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorOption, 
                            { backgroundColor: color },
                            iconColor === color && { borderWidth: 3, borderColor: '#333' }
                        ]}
                        onPress={() => setIconColor(color)}
                    />
                ))}
            </ScrollView>

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
    iconRow: { flexDirection: 'row', marginBottom: 20 },
    iconOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#fff'
    },
    colorRow: { flexDirection: 'row', marginBottom: 30 },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#ddd' // invisible border for default
    }
});
