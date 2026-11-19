import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/auth-theme';
import { useDrawer } from '@/context/drawer-context';
import { useProfileContext } from '@/context/profile-context';

export default function AppHeader({ initials }: { initials: string }) {
  const { openDrawer } = useDrawer();

  let avatarUri: string | null = null;
  try {
    const profileCtx = useProfileContext();
    avatarUri = profileCtx?.profile?.avatarUri || null;
  } catch {
    // Fallback if context is not present
  }

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Pressable onPress={openDrawer} hitSlop={10} accessibilityLabel="Buka Menu">
          <Feather name="align-left" size={24} color={Colors.text} />
        </Pressable>
        <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </LinearGradient>
        <Text style={styles.brand}>S-Tidy</Text>
      </View>

      <Pressable
        style={styles.avatar}
        onPress={() => router.navigate('/profile')}
        accessibilityLabel="Buka Profil"
        accessibilityRole="button"
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.avatarText}>{initials}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  brand: { fontSize: 20, fontWeight: '800', color: Colors.text },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.deep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
