import { Stack } from 'expo-router';
import { DrawerProvider } from '@/context/drawer-context';
import AppDrawer from '@/components/navigation/AppDrawer';

export default function AppLayout() {
  return (
    <DrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="countdown" options={{ headerShown: false }} />
        <Stack.Screen name="focus-settings" options={{ headerShown: false }} />
      </Stack>
      <AppDrawer />
    </DrawerProvider>
  );
}