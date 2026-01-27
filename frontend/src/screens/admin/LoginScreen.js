import React, { useState, useContext } from 'react';
import { 
    StyleSheet, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Text, 
    ActivityIndicator, 
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Colors from '../../constants/Colors';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [currentView, setCurrentView] = useState('welcome'); // 'welcome' | 'login'
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

    if (currentView === 'welcome') {
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContent}>
                    <Image 
                        source={{ uri: 'https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=740&t=st=1706890000~exp=1706890600~hmac=...' }} 
                        style={styles.welcomeImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.welcomeTitle}>Discover Your Dream Job here</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Explore all the existing job roles based on your interest and study major
                    </Text>
                </View>
                
                <View style={styles.welcomeButtons}>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => setCurrentView('login')}
                    >
                        <Text style={styles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.textButton}
                        onPress={() => console.log('Register clicked')}
                    >
                        <Text style={styles.textButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity 
                    onPress={() => setCurrentView('welcome')}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <View style={styles.loginHeader}>
                    <Text style={styles.loginTitle}>Login here</Text>
                    <Text style={styles.loginSubtitle}>Welcome back you've been missed!</Text>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={Colors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={Colors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryButton, styles.loginButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Sign in</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.createAccount}
                        onPress={() => console.log('Create account')}
                    >
                        <Text style={styles.createAccountText}>Create new account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Welcome View Styles
    welcomeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
    },
    welcomeImage: {
        width: '100%',
        height: 300,
        marginBottom: 30,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 15,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    welcomeButtons: {
        flexDirection: 'row',
        padding: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    // Shared & Button Styles
    primaryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textButton: {
        padding: 15,
    },
    textButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    // Login Screen View Styles
    scrollContent: {
        flexGrow: 1,
        padding: 30,
        justifyContent: 'center',
    },
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 30,
        color: '#333',
    },
    loginHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    loginTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
    },
    loginSubtitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: 240,
        color: '#333',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#f1f3f6',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#f1f3f6', // Hide border initially or make it subtle
        color: '#333',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    loginButton: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    createAccount: {
        alignItems: 'center',
    },
    createAccountText: {
        color: '#444',
        fontWeight: '600',
    },
    error: {
        color: Colors.error,
        textAlign: 'center',
        marginBottom: 20,
    },
});
