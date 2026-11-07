import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AuthScreen from '@/components/auth/AuthScreen';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/auth-theme';
import { requestPasswordReset } from '@/services/auth';

export default function EmailSentScreen() {
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const [resent, setResent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const onResend = async () => {
    await requestPasswordReset(email);
    setResent(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setResent(false), 3000);
  };

  return (
    <AuthScreen showBack ring="bottom" footer="S-Tidy  •  Belajar lebih teratur">
      <View style={styles.hero}>
        <View style={styles.outer}>
          <View style={styles.mid}>
            <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.inner}>
              <Feather name="send" size={34} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.check}>
            <Feather name="check" size={12} color="#fff" />
          </View>
        </View>

        <Text style={styles.eyebrow}>EMAIL TERKIRIM</Text>
        <Text style={styles.title}>Periksa Email Anda</Text>
        <Text style={styles.subtitle}>
          Kami telah mengirimkan instruksi pengaturan ulang kata sandi ke email Anda.
          Silakan periksa kotak masuk atau spam.
        </Text>

        <View style={styles.chip}>
          <View style={styles.chipIcon}>
            <Feather name="mail" size={14} color={Colors.primary} />
          </View>
          <Text style={styles.chipText}>{email}</Text>
        </View>
      </View>

      <PrimaryButton label="Kembali ke Halaman Login" icon="chevron-right" onPress={() => router.replace('/login')} />

      <View style={styles.bottom}>
        <Text style={styles.muted}>Tidak menerima email? </Text>
        <Pressable onPress={onResend}>
          <Text style={styles.link}>Kirim Ulang</Text>
        </Pressable>
      </View>

      {resent && (
        <View style={styles.toast}>
          <View style={styles.toastIcon}>
            <Feather name="check" size={12} color="#fff" />
          </View>
          <Text style={styles.toastText}>Email berhasil dikirim ulang.</Text>
        </View>
      )}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 32, marginBottom: 28 },
  outer: {
    width: 132, height: 132, borderRadius: 66, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  mid: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#CBEBDF',
    alignItems: 'center', justifyContent: 'center',
  },
  inner: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  check: {
    position: 'absolute', right: 6, bottom: 6, width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.text, borderWidth: 3, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20,
    backgroundColor: '#fff', borderRadius: 999, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 6, paddingLeft: 6, paddingRight: 16,
  },
  chipIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  muted: { fontSize: 13, color: Colors.muted },
  link: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  toast: {
    alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: Colors.primarySoft, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14,
  },
  toastIcon: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  toastText: { fontSize: 12.5, fontWeight: '600', color: Colors.primary },
});