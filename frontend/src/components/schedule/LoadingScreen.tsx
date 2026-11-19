import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/auth-theme';

/** Layar penuh saat data jadwal masih dimuat dari server. */
export default function LoadingScreen() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream },
});
