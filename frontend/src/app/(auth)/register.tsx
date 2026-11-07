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
import { register } from '@/services/auth';

type Errors = {
  email?: string;
  name?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // hapus error field yang sedang diketik
  const clear = (key: keyof Errors) => setErrors((e) => ({ ...e, [key]: undefined }));

  const validate = (): Errors => ({
    email: !email.trim()
      ? 'Alamat email wajib diisi.'
      : !isValidEmail(email) ? 'Masukkan alamat email yang valid.' : undefined,
    name: !name.trim() ? 'Nama belakang wajib diisi.' : undefined,
    password: !password
      ? 'Kata sandi wajib diisi.'
      : !isValidPassword(password) ? 'Gunakan minimal 8 karakter.' : undefined,
    confirm: !confirm
      ? 'Konfirmasi wajib diisi.'
      : confirm !== password ? 'Kata sandi tidak cocok.' : undefined,
    terms: agree ? undefined : 'Setujui Syarat & Ketentuan untuk melanjutkan.',
  });

  const onSubmit = async () => {
    const next = validate();
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    try {
      setLoading(true);
      await register(email.trim(), name.trim(), password);
      router.replace('/login'); // TODO: sesuaikan alur setelah daftar
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen ring="left" footer="Fokus lebih baik.  •  Belajar lebih teratur.">
      <View style={styles.hero}>
        <View style={styles.heroWrap}>
          <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.heroIcon}>
            <Feather name="user" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.badge}>
            <Feather name="lock" size={12} color={Colors.primary} />
          </View>
        </View>
        <Text style={styles.eyebrow}>MULAI PERJALANANMU</Text>
        <Text style={styles.title}>Buat Akun Baru</Text>
        <Text style={styles.subtitle}>
          Daftar untuk mengatur sesi fokus dan pantau progres belajarmu setiap hari.
        </Text>
      </View>

      <View style={styles.card}>
        <TextField
          label="Alamat email"
          icon="mail"
          placeholder="student@university.ac.id"
          value={email}
          onChangeText={(t) => { setEmail(t); clear('email'); }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          label="Nama belakang"
          icon="user"
          placeholder="Masukkan nama belakang"
          value={name}
          onChangeText={(t) => { setName(t); clear('name'); }}
          error={errors.name}
        />

        <View style={styles.twoCol}>
          <TextField
            containerStyle={styles.col}
            label="Kata sandi"
            icon="lock"
            placeholder="Min. 8 karakter"
            value={password}
            onChangeText={(t) => { setPassword(t); clear('password'); }}
            error={errors.password}
            secureTextEntry
          />
          <TextField
            containerStyle={styles.col}
            label="Konfirmasi"
            icon="lock"
            placeholder="Ulangi sandi"
            value={confirm}
            onChangeText={(t) => { setConfirm(t); clear('confirm'); }}
            error={errors.confirm}
            secureTextEntry
          />
        </View>

        <View style={styles.terms}>
          <Checkbox
            checked={agree}
            onChange={(v) => { setAgree(v); clear('terms'); }}
            error={errors.terms}
            label={
              <>
                Saya menyetujui{' '}
                <Text style={styles.link} onPress={() => { /* TODO: halaman S&K */ }}>
                  Syarat & Ketentuan
                </Text>
              </>
            }
          />
        </View>

        <PrimaryButton label="Buat Akun" onPress={onSubmit} loading={loading} />

        <View style={styles.bottom}>
          <Text style={styles.muted}>Sudah punya akun? </Text>
          <Pressable onPress={() => router.replace('/login')}>
            <Text style={styles.link}>Masuk</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 4, marginBottom: 20 },
  heroWrap: { marginBottom: 16 },
  heroIcon: {
    width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  badge: {
    position: 'absolute', right: -8, bottom: -6, width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20, maxWidth: 300 },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.card, padding: 20,
    shadowColor: '#0F3D31', shadowOpacity: 0.08, shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
  twoCol: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  col: { flex: 1 },
  terms: { marginTop: 2, marginBottom: 20 },
  link: { fontSize: 12.5, fontWeight: '700', color: Colors.primary },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  muted: { fontSize: 12.5, color: Colors.muted },
});