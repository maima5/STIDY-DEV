import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
};

export default function PrimaryButton({ label, onPress, icon = 'arrow-right', loading }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.9 : 1 }]}
    >
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >
        <Text style={styles.label}>{label}</Text>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.iconBox}>
            <Feather name={icon} size={18} color="#fff" />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.button,
    shadowColor: Colors.primary, shadowOpacity: 0.35,
    shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  btn: {
    height: 54, borderRadius: Radius.button,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingLeft: 20, paddingRight: 8,
  },
  label: { color: '#fff', fontSize: 15, fontWeight: '700' },
  iconBox: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
});