import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Colors from '../../constants/Colors';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor ingrese todos los campos');
            return;
        }

        setLoading(true);
        setError('');

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            navigation.replace('AdminDashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Login</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Ingresar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.primary,
    },
    input: {
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: Colors.error,
        marginBottom: 10,
        textAlign: 'center',
    },
});
