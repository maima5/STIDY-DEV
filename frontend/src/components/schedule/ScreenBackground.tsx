import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/auth-theme';

/** Latar halaman: semburat mint di kanan atas yang memudar ke abu terang. */
export default function ScreenBackground() {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[Colors.bg, Colors.mintWash, Colors.bg]}
      locations={[0, 0.18, 0.6]}
      start={{ x: 0, y: 0.1 }} end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
