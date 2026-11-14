import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { Colors } from '@/constants/auth-theme';

const TABS: Record<string, { label: string; href: string; icon: (c: string) => React.ReactNode }> = {
  home: { label: 'Beranda', href: '/home', icon: (c) => <Feather name="home" size={22} color={c} /> },
  schedule: { label: 'Jadwal', href: '/schedule', icon: (c) => <Feather name="calendar" size={22} color={c} /> },
  'ai-summary': { label: 'Ringkasan AI', href: '/ai-summary', icon: (c) => <Ionicons name="sparkles-outline" size={22} color={c} /> },
  profile: { label: 'Profil', href: '/profile', icon: (c) => <Feather name="user" size={22} color={c} /> },
};

export default function BottomTabBar({ state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const color = focused ? Colors.primary : Colors.muted;
        return (
          <Pressable key={route.key} style={styles.item} onPress={() => router.navigate(tab.href as Href)}>
            <View style={[styles.pill, focused && styles.pillActive]}>{tab.icon(color)}</View>
            <Text style={[styles.label, { color }, focused && { fontWeight: '700' }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', paddingTop: 10, backgroundColor: Colors.cream,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  pill: { width: 58, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pillActive: { backgroundColor: '#D9F3E9' },
  label: { fontSize: 11 },
});