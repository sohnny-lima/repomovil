import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Colors from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function AdminLogoutButton() {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = () => {
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.text}>Salir</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
