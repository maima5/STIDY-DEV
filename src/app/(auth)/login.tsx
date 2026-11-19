import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AuthScreen from '@/components/auth/AuthScreen';
import TextField from '@/components/ui/TextField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Checkbox from '@/components/ui/Checkbox';
import { Colors, Radius } from '@/constants/auth-theme';
import { isValidEmail, isValidPassword } from '@/utils/validators';
import { login } from '@/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const next = {
      email: isValidEmail(email) ? undefined : 'Masukkan alamat email yang valid.',
      password: isValidPassword(password) ? undefined : 'Gunakan minimal 8 karakter.',
    };
    setErrors(next);
    if (next.email || next.password) return;

    try {
      setLoading(true);
      await login(email.trim(), password);
      router.replace('/home'); // Dashboard utama
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen ring="left" footer="Fokus lebih baik.  •  Belajar lebih teratur.">
      <View style={styles.hero}>
        <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.heroIcon}>
          <Feather name="lock" size={24} color="#fff" />
        </LinearGradient>
        <Text style={styles.eyebrow}>RUANG BELAJARMU</Text>
        <Text style={styles.title}>Selamat datang kembali</Text>
        <Text style={styles.subtitle}>
          Masuk untuk melanjutkan sesi fokus dan melihat progres belajarmu.
        </Text>
      </View>

      <View style={styles.card}>
        <TextField
          label="Alamat email"
          icon="mail"
          placeholder="student@university.ac.id"
          value={email}
          onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((e) => ({ ...e, email: undefined })); }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          label="Kata sandi"
          icon="lock"
          placeholder="Minimal 8 karakter"
          value={password}
          onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: undefined })); }}
          error={errors.password}
          secureTextEntry
        />

        <View style={styles.row}>
          <Checkbox label="Ingat saya" checked={remember} onChange={setRemember} />
          <Pressable onPress={() => router.push('/forgot-password')}>
            <Text style={styles.link}>Lupa kata sandi?</Text>
          </Pressable>
        </View>

        <PrimaryButton label="Masuk" onPress={onSubmit} loading={loading} />

        <View style={styles.bottom}>
          <Text style={styles.muted}>Belum punya akun? </Text>
          <Pressable onPress={() => router.push('/register' as any)}>
            <Text style={styles.link}>Buat akun</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  heroIcon: {
    width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, transform: [{ rotate: '-4deg' }],
  },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20, maxWidth: 280 },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.card, padding: 20,
    shadowColor: '#0F3D31', shadowOpacity: 0.08, shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  link: { fontSize: 12.5, fontWeight: '700', color: Colors.primary },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  muted: { fontSize: 12.5, color: Colors.muted },
});