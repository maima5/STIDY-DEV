import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AuthScreen from '@/components/auth/AuthScreen';
import TextField from '@/components/ui/TextField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors, Radius } from '@/constants/auth-theme';
import { isValidEmail } from '@/utils/validators';
import { requestPasswordReset } from '@/services/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!isValidEmail(email)) {
      setError('Masukkan alamat email yang valid.');
      return;
    }
    setError(undefined);
    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      router.push({ pathname: '/email-sent', params: { email: email.trim() } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen showBack ring="bottom" footer="S-Tidy  •  Fokus lebih baik setiap hari">
      <View style={styles.hero}>
        <View style={styles.heroWrap}>
          <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.heroIcon}>
            <Feather name="lock" size={34} color="#fff" />
          </LinearGradient>
          <View style={styles.badge}>
            <Feather name="mail" size={12} color={Colors.primary} />
          </View>
        </View>
        <Text style={styles.eyebrow}>PEMULIHAN AKUN</Text>
        <Text style={styles.title}>Lupa Kata Sandi?</Text>
        <Text style={styles.subtitle}>
          Jangan khawatir. Masukkan email yang terhubung dengan akunmu dan kami akan
          mengirimkan instruksi untuk membuat kata sandi baru.
        </Text>
      </View>

      <View style={styles.card}>
        <TextField
          label="Alamat email"
          icon="mail"
          placeholder="student@university.ac.id"
          value={email}
          onChangeText={(t) => { setEmail(t); if (error) setError(undefined); }}
          error={error}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PrimaryButton label="Kirim Instruksi Pemulihan" icon="send" onPress={onSubmit} loading={loading} />
        <View style={styles.note}>
          <View style={styles.dot} />
          <Text style={styles.noteText}>Tautan pemulihan hanya berlaku selama 15 menit.</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.muted}>Sudah ingat akun? </Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Masuk</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  heroWrap: { marginBottom: 20 },
  heroIcon: { width: 84, height: 84, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', right: -6, bottom: -6, width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.card, padding: 20,
    shadowColor: '#0F3D31', shadowOpacity: 0.08, shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
  note: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  noteText: { fontSize: 11, color: Colors.muted },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  muted: { fontSize: 13, color: Colors.muted },
  link: { fontSize: 13, fontWeight: '700', color: Colors.primary },
});