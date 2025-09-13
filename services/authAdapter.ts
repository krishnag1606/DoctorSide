import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'auth_token';
const USER_KEY = 'user_data';

export interface User {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Mock authentication adapter
export const authAdapter = {
  async login(email: string, password: string): Promise<LoginResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock credentials validation
    if (email === 'dr.smith@hospital.com' && password === 'password123') {
      const user: User = {
        id: 'user_123',
        name: 'Dr. Sarah Smith',
        email: 'dr.smith@hospital.com',
        specialization: 'Cardiology'
      };

      // Store auth token and user data
      await AsyncStorage.setItem(AUTH_KEY, 'mock_auth_token_123');
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      return { success: true, user };
    }

    return { success: false, error: 'Invalid email or password' };
  },

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([AUTH_KEY, USER_KEY]);
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(AUTH_KEY);
    return token !== null;
  },

  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
};