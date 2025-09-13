import { analyticsAdapter } from '@/services/analyticsAdapter';
import { authAdapter } from '@/services/authAdapter';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: 'dr.smith@hospital.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    analyticsAdapter.trackEvent('login_attempt', { email: data.email });

    try {
      const result = await authAdapter.login(data.email, data.password);
      if (result.success) {
        analyticsAdapter.trackEvent('login_success', { userId: result.user.id });
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
        analyticsAdapter.trackEvent('login_failed', { error: result.error });
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      analyticsAdapter.trackEvent('login_error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Mail size={20} color="#666666" style={styles.inputIcon} />
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666666" style={styles.inputIcon} />
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}>
            {showPassword ? (
              <EyeOff size={20} color="#666666" />
            ) : (
              <Eye size={20} color="#666666" />
            )}
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}>
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.demoCredentials}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Email: dr.smith@hospital.com</Text>
          <Text style={styles.demoText}>Password: password123</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B61FF',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8E2FF',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  eyeButton: {
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 16,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#7B61FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  demoCredentials: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B61FF',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
});