import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Colors from '../../constants/Colors';

export default function AdminDashboard({ navigation }) {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigation.replace('Home');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Hola, {user?.email}</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Gestión</Text>

            <View style={styles.grid}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('AdminCategoryList')}
                >
                    <Text style={styles.cardTitle}>Categorías</Text>
                    <Text style={styles.cardDesc}>Crear y editar categorías</Text>
                </TouchableOpacity>

                {/* Future expansion: Users, Metrics, etc. */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    welcome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    logoutButton: {
        padding: 8,
    },
    logoutText: {
        color: Colors.error,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: Colors.surface,
        width: '48%',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.primary,
    },
    cardDesc: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
