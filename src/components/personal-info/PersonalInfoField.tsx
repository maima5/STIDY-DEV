import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface PersonalInfoFieldProps extends TextInputProps {
  label: string;
  iconName: 'user' | 'shield' | 'mail';
  isReadOnly?: boolean;
  readOnlyBadgeText?: string;
  hasError?: boolean;
}

export default function PersonalInfoField({
  label,
  iconName,
  value,
  isReadOnly = false,
  readOnlyBadgeText,
  hasError = false,
  ...inputProps
}: PersonalInfoFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    const iconColor = hasError
      ? ProfileColors.danger
      : isFocused
      ? ProfileColors.primary
      : ProfileColors.textMuted;

    switch (iconName) {
      case 'user':
        return <Feather name="user" size={18} color={iconColor} />;
      case 'shield':
        return <Feather name="shield" size={18} color={iconColor} />;
      case 'mail':
        return <Feather name="mail" size={18} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {isReadOnly ? (
        <View style={styles.readOnlyBox}>
          <View style={styles.leftContent}>
            {renderIcon()}
            <Text style={styles.readOnlyValue}>{value}</Text>
          </View>
          {readOnlyBadgeText && (
            <View style={styles.readOnlyBadge}>
              <Text style={styles.readOnlyBadgeText}>{readOnlyBadgeText}</Text>
            </View>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.inputBox,
            isFocused && styles.inputBoxFocused,
            hasError && styles.inputBoxError,
          ]}
        >
          {renderIcon()}
          <TextInput
            style={styles.input}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={ProfileColors.textMuted}
            {...inputProps}
          />
        </View>
      )}
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
  input: {
    flex: 1,
    fontSize: 14,
    color: ProfileColors.textPrimary,
    marginLeft: 10,
    fontWeight: '500',
    padding: 0,
  },
  readOnlyBox: {
    height: 52,
    borderRadius: ProfileLayout.inputRadius,
    backgroundColor: ProfileColors.inputDisabledBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  readOnlyValue: {
    fontSize: 14,
    color: ProfileColors.textSecondary,
    fontWeight: '500',
    marginLeft: 10,
  },
  readOnlyBadge: {
    backgroundColor: ProfileColors.badgeTetapBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  readOnlyBadgeText: {
    fontSize: 11,
    color: ProfileColors.badgeTetapText,
    fontWeight: '600',
  },
});

