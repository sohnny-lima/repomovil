import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('token');

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
                // Set default header for axios
                client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            console.log('Failed to load user', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await client.post('/auth/login', { email, password });
            const { token, user } = response.data;

            if (token) {
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));

                // Update client header
                client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setUser(user);
                return { success: true };
            }
            return { success: false, message: 'No token received' };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            delete client.defaults.headers.common['Authorization'];
            setUser(null);
        } catch (e) {
            console.log('Failed to logout', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
