import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface SecurityPasswordFieldProps extends TextInputProps {
  label: string;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  hasError?: boolean;
}

export default function SecurityPasswordField({
  label,
  value,
  showPassword,
  onToggleShowPassword,
  hasError = false,
  ...inputProps
}: SecurityPasswordFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const iconColor = hasError
    ? ProfileColors.danger
    : isFocused
    ? ProfileColors.primary
    : ProfileColors.textMuted;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputBox,
          isFocused && styles.inputBoxFocused,
          hasError && styles.inputBoxError,
        ]}
      >
        <Feather name="lock" size={18} color={iconColor} style={styles.leftIcon} />

        <TextInput
          style={styles.input}
          value={value}
          secureTextEntry={!showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={ProfileColors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
        />

        <Pressable
          onPress={onToggleShowPassword}
          hitSlop={10}
          style={styles.eyeBtn}
          accessibilityLabel={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          accessibilityRole="button"
        >
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={18}
            color={ProfileColors.textMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    marginBottom: 8,
  },
  inputBox: {
    height: 52,
    borderRadius: ProfileLayout.inputRadius,
    borderWidth: 1.5,
    borderColor: ProfileColors.border,
    backgroundColor: ProfileColors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputBoxFocused: {
    borderColor: ProfileColors.primary,
  },
  inputBoxError: {
    borderColor: ProfileColors.danger,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: ProfileColors.textPrimary,
    fontWeight: '500',
    padding: 0,
  },
  eyeBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

