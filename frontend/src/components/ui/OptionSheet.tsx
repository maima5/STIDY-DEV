import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

export type SheetOption<T> = {
  label: string;
  value: T;
  icon?: keyof typeof Feather.glyphMap;
  destructive?: boolean;
};

type Props<T> = {
  visible: boolean;
  title?: string;
  options: SheetOption<T>[];
  /** Nilai terpilih (diberi centang). Kosongkan untuk menu aksi. */
  selected?: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

/** Bottom sheet berisi daftar pilihan — dipakai Select dan menu aksi. */
export default function OptionSheet<T extends string | number>({
  visible, title, options, selected, onSelect, onClose,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.grabber} />
          {!!title && <Text style={styles.title}>{title}</Text>}
          {options.map((o) => {
            const active = selected === o.value;
            const color = o.destructive ? Colors.error : active ? Colors.deep : Colors.text;
            return (
              <Pressable
                key={String(o.value)}
                style={({ pressed }) => [styles.item, (active || pressed) && styles.itemActive]}
                onPress={() => { onClose(); onSelect(o.value); }}
              >
                {!!o.icon && <Feather name={o.icon} size={18} color={color} />}
                <Text style={[styles.itemText, { color }, active && { fontWeight: '700' }]}>{o.label}</Text>
                {active && <Feather name="check" size={18} color={Colors.primary} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 16, paddingTop: 10,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, marginBottom: 12 },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 8, marginLeft: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, paddingHorizontal: 14, borderRadius: 16 },
  itemActive: { backgroundColor: Colors.primarySoft },
  itemText: { flex: 1, fontSize: 14, fontWeight: '600' },
});
