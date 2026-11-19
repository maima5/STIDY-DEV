import { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';

type Props = TextInputProps & {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function TextField({ label, icon, error, secureTextEntry, containerStyle, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={[{ marginBottom: 14 }, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, !!error && styles.boxError]}>
        <Feather name={icon} size={18} color={Colors.placeholder} />
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={Colors.placeholder} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  box: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 52, paddingHorizontal: 14,
    backgroundColor: Colors.inputBg, borderRadius: Radius.input,
    borderWidth: 1, borderColor: Colors.border,
  },
  boxError: { borderColor: Colors.error, backgroundColor: Colors.errorBg },
  input: { flex: 1, fontSize: 14, color: Colors.text },
  error: { fontSize: 11.5, color: Colors.error, marginTop: 6 },
});