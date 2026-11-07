import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

type Props = {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
};

export default function Checkbox({ label, checked, onChange, error }: Props) {
  return (
    <View>
      <View style={styles.row}>
        <Pressable
          onPress={() => onChange(!checked)}
          hitSlop={8}
          style={[styles.box, checked && styles.boxOn, !!error && !checked && styles.boxError]}
        >
          {checked && <Feather name="check" size={13} color="#fff" />}
        </Pressable>
        <Text style={styles.label} onPress={() => onChange(!checked)}>
          {label}
        </Text>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  boxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  boxError: { borderColor: Colors.error },
  label: { fontSize: 12.5, color: Colors.muted, flexShrink: 1 },
  error: { fontSize: 11.5, color: Colors.error, marginTop: 6, marginLeft: 28 },
});