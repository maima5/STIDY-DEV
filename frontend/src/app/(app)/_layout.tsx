import { Stack } from 'expo-router';
import { DrawerProvider } from '@/context/drawer-context';
import { FocusProvider } from '@/context/focus-context';
import { ScheduleProvider } from '@/context/schedule-context';
import AppDrawer from '@/components/navigation/AppDrawer';

export default function AppLayout() {
  return (
    <DrawerProvider>
      <ScheduleProvider>
        <FocusProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="countdown" options={{ headerShown: false }} />
          </Stack>
          <AppDrawer />
        </FocusProvider>
      </ScheduleProvider>
    </DrawerProvider>
  );
}
