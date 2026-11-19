import { Stack } from 'expo-router';
import { DrawerProvider } from '@/context/drawer-context';
import { ProfileProvider } from '@/context/profile-context';
import AppDrawer from '@/components/navigation/AppDrawer';

export default function AppLayout() {
  return (
    <ProfileProvider>
      <DrawerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="countdown" options={{ headerShown: false }} />
          <Stack.Screen name="focus-settings" options={{ headerShown: false }} />
          <Stack.Screen name="personal-info" options={{ headerShown: false }} />
          <Stack.Screen name="account-security" options={{ headerShown: false }} />
          <Stack.Screen name="help-center" options={{ headerShown: false }} />
        </Stack>
        <AppDrawer />
      </DrawerProvider>
    </ProfileProvider>
  );
}
