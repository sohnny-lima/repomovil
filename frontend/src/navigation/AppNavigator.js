import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import LoginScreen from '../screens/admin/LoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import Colors from '../constants/Colors';
import { AuthContext } from '../context/AuthContext';
import AdminLogoutButton from '../components/AdminLogoutButton';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        title: 'RepoMovil',
                        headerRight: () => (
                            !user ? (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Login')}
                                    style={{ marginRight: 15 }}
                                >
                                    <Text style={{ color: '#fff' }}>Admin</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AdminDashboard')}
                                    style={{ marginRight: 15 }}
                                >
                                    <Text style={{ color: '#fff' }}>Panel</Text>
                                </TouchableOpacity>
                            )
                        )
                    })}
                />
                <Stack.Screen
                    name="CategoryDetails"
                    component={CategoryScreen}
                    options={({ route }) => ({ title: route.params.categoryName })}
                />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Acceso Admin' }} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    name="AdminDashboard"
                    component={AdminDashboard}
                    options={{
                        title: 'Panel de Administración',
                        headerLeft: null,
                        headerRight: () => <AdminLogoutButton />,
                    }}
                />
                <Stack.Screen
                    name="AdminCategoryList"
                    component={require('../screens/admin/AdminCategoryList').default}
                    options={{ title: 'Gestionar Categorías' }}
                />
                <Stack.Screen
                    name="AdminCategoryEditor"
                    component={require('../screens/admin/AdminCategoryEditor').default}
                    options={{ title: 'Editor de Categoría' }}
                />
                <Stack.Screen
                    name="AdminItemsList"
                    component={require('../screens/admin/AdminItemsList').default}
                    options={{ title: 'Gestionar Items' }}
                />
                <Stack.Screen
                    name="AdminItemEditor"
                    component={require('../screens/admin/AdminItemEditor').default}
                    options={{ title: 'Editor de Item' }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
}
