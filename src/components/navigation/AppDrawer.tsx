import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Href, router, usePathname } from 'expo-router';
import { Colors } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';
import { useDrawer } from '@/context/drawer-context';
import { logout } from '@/services/auth';

const W = Math.min(Dimensions.get('window').width * 0.82, 320);

const MENU: { label: string; href: string; icon: (c: string) => React.ReactNode }[] = [
  { label: 'Beranda', href: '/home', icon: (c) => <Feather name="home" size={20} color={c} /> },
  { label: 'Jadwal', href: '/schedule', icon: (c) => <Feather name="calendar" size={20} color={c} /> },
  { label: 'Hitung Mundur', href: '/countdown', icon: (c) => <Feather name="clock" size={20} color={c} /> },
  { label: 'Pengatur Waktu Fokus', href: '/focus-settings', icon: (c) => <Feather name="target" size={20} color={c} /> },
  { label: 'Ringkasan AI', href: '/ai-summary', icon: (c) => <Ionicons name="sparkles-outline" size={20} color={c} /> },
];

export default function AppDrawer() {
  const { open, closeDrawer } = useDrawer();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const x = useRef(new Animated.Value(-W)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(x, { toValue: 0, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(x, { toValue: -W, duration: 200, useNativeDriver: true })
        .start(({ finished }) => finished && setMounted(false));
    }
  }, [open]);

  const go = (href: string) => {
    closeDrawer();
    if (pathname !== href) router.navigate(href as Href);
  };

  const onLogout = async () => {
    closeDrawer();
    await logout();
    router.replace('/login');
  };

  const backdrop = x.interpolate({ inputRange: [-W, 0], outputRange: [0, 1] });

  return (
    <Modal transparent visible={mounted} animationType="none" statusBarTranslucent onRequestClose={closeDrawer}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdrop }]}>
        <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
      </Animated.View>

      <Animated.View
        style={[styles.drawer, { width: W, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, transform: [{ translateX: x }] }]}
      >
        {/* header */}
        <View style={styles.head}>
          <View style={styles.brandRow}>
            <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </LinearGradient>
            <Text style={styles.brand}>S-Tidy</Text>
          </View>
          <Pressable style={styles.close} onPress={closeDrawer}>
            <Feather name="x" size={20} color={Colors.muted} />
          </Pressable>
        </View>

        {/* profil */}
        <LinearGradient colors={['#0E8A70', '#2FAE8F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profile}>
          <View style={styles.pAvatar}><Feather name="user" size={22} color="#fff" /></View>
          <View>
            <Text style={styles.pName}>{MOCK_USER.name}</Text>
            <Text style={styles.pRole}>{MOCK_USER.role}</Text>
          </View>
        </LinearGradient>

        <Text style={styles.section}>MENU UTAMA</Text>
        {MENU.map((m) => {
          const active = pathname === m.href;
          const color = active ? Colors.deep : Colors.muted;
          return (
            <Pressable key={m.href} style={[styles.item, active && styles.itemActive]} onPress={() => go(m.href)}>
              {m.icon(color)}
              <Text style={[styles.itemText, active && { color: Colors.deep }]}>{m.label}</Text>
              {active && <View style={styles.dot} />}
            </Pressable>
          );
        })}

        <View style={{ flex: 1 }} />

        <Pressable style={styles.logout} onPress={onLogout}>
          <Feather name="log-out" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Keluar dari akun</Text>
        </Pressable>
        <Text style={styles.version}>S-Tidy versi 2.4</Text>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  drawer: {
    position: 'absolute', top: 0, bottom: 0, left: 0, paddingHorizontal: 20,
    backgroundColor: Colors.cream, borderTopRightRadius: 28, borderBottomRightRadius: 28,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800' },
  brand: { fontSize: 22, fontWeight: '800', color: Colors.text },
  close: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20 },
  pAvatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  pName: { color: '#fff', fontWeight: '700', fontSize: 15 },
  pRole: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  section: { fontSize: 10.5, letterSpacing: 1.5, fontWeight: '700', color: Colors.muted, marginTop: 24, marginBottom: 10, marginLeft: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 14, borderRadius: 16 },
  itemActive: { backgroundColor: '#E6F4EF' },
  itemText: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.primary },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: 14 },
  version: { fontSize: 10.5, color: Colors.placeholder, marginLeft: 14, marginTop: 4 },
});