import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { authAdapter } from '@/services/authAdapter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authAdapter.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (e) {
        console.error(e);
      } finally {
        // Hide the splash screen once we know the auth state
        SplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, []);

  // Use a redirect hook to navigate after auth state is known
  useEffect(() => {
    if (isAuthenticated === null) {
      return; // Still loading
    }

    if (isAuthenticated) {
      router.replace('/(tabs)'); // Navigate to home
    } else {
      router.replace('/login'); // Navigate to login
    }
  }, [isAuthenticated]);

  // Return a minimal layout while waiting for redirect
  // Or simply null, as the splash screen is visible.
  if (isAuthenticated === null) {
    return null;
  }

  // This simplified Stack is often better when using redirects.
  // The redirect logic handles which screen is shown.
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="medical-record" options={{ presentation: 'modal' }} />
        <Stack.Screen name="video-call" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}