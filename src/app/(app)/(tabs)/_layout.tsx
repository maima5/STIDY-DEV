import { Tabs } from 'expo-router';
import BottomTabBar from '@/components/navigation/BottomTabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="ai-summary" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}