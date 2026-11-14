import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';

type IconName = keyof typeof Feather.glyphMap;

type Props = {
  label: string;
  onPress: () => void;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** 'solid' = gradien hijau, 'soft' = mint lembut, 'outline' = putih bergaris */
  variant?: 'solid' | 'soft' | 'outline';
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** Tombol dengan label di tengah dan ikon opsional di kiri/kanan. */
export default function GradientButton({
  label, onPress, iconLeft, iconRight, variant = 'solid', height = 54, style,
}: Props) {
  const solid = variant === 'solid';
  const color = solid ? '#fff' : variant === 'soft' ? Colors.deep : Colors.muted;

  const content = (
    <>
      {!!iconLeft && <Feather name={iconLeft} size={18} color={color} />}
      <Text style={[styles.label, { color }]}>{label}</Text>
      {!!iconRight && <Feather name={iconRight} size={18} color={color} />}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [solid && styles.shadow, { opacity: pressed ? 0.88 : 1 }, style]}
    >
      {solid ? (
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.btn, { height }]}
        >
          {content}
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={variant === 'soft' ? [Colors.mint, Colors.mint] : ['#fff', '#fff']}
          style={[styles.btn, { height }, variant === 'soft' ? styles.soft : styles.outline]}
        >
          {content}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.button,
    shadowColor: Colors.primary, shadowOpacity: 0.3,
    shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 5,
  },
  btn: {
    borderRadius: Radius.button, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, paddingHorizontal: 16,
  },
  soft: { borderWidth: 1, borderColor: Colors.mintBorder },
  outline: { borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 14, fontWeight: '700' },
});
