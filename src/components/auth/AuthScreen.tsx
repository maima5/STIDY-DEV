import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/auth-theme';

type Props = {
  children: ReactNode;
  showBack?: boolean;
  ring?: 'left' | 'bottom';
  footer?: string;
};

export default function AuthScreen({ children, showBack, ring = 'left', footer }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* dekorasi */}
      <View style={styles.circle} />
      <View style={[styles.ring, ring === 'left' ? styles.ringLeft : styles.ringBottom]} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* header */}
          <View style={styles.header}>
            {showBack && (
              <Pressable style={styles.back} onPress={() => router.back()}>
                <Feather name="chevron-left" size={22} color={Colors.text} />
              </Pressable>
            )}
            <View style={styles.logoRow}>
              <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.logo}>
                <Feather name="bar-chart-2" size={16} color="#fff" />
              </LinearGradient>
              <Text style={styles.brand}>S-Tidy</Text>
            </View>
          </View>

          {children}

          {!!footer && <Text style={styles.footer}>{footer}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  header: { height: 56, justifyContent: 'center', marginBottom: 12 },
  back: {
    position: 'absolute', left: 0, width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', zIndex: 2,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logo: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 20, fontWeight: '800', color: Colors.text },
  footer: { textAlign: 'center', fontSize: 11, color: Colors.placeholder, marginTop: 24 },

  circle: {
    position: 'absolute', top: -70, right: -70, width: 230, height: 230,
    borderRadius: 115, backgroundColor: Colors.primarySoft, opacity: 0.8,
  },
  ring: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    borderWidth: 32, borderColor: Colors.primarySoft, opacity: 0.6,
  },
  ringLeft: { left: -130, top: 200 },
  ringBottom: { left: -90, bottom: -60 },
});