import { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';
import OptionSheet, { SheetOption } from '@/components/ui/OptionSheet';

type Props<T> = {
  value: T;
  options: SheetOption<T>[];
  onChange: (value: T) => void;
  title?: string;
  /** Ukuran kecil untuk filter di header section */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Select<T extends string | number>({ value, options, onChange, title, compact, style }: Props<T>) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <Pressable style={[styles.box, compact && styles.compact, style]} onPress={() => setOpen(true)}>
        <Text style={[styles.text, compact && styles.textCompact]} numberOfLines={1}>{current?.label ?? '-'}</Text>
        <Feather name="chevron-down" size={compact ? 16 : 18} color={Colors.text} />
      </Pressable>
      <OptionSheet
        visible={open} title={title} options={options} selected={value}
        onSelect={onChange} onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.inputBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
  },
  compact: { height: 40, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#fff' },
  text: { flex: 1, fontSize: 14, color: Colors.text },
  textCompact: { fontSize: 12, color: Colors.muted },
});
