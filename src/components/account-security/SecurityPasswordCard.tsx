import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import SecurityPasswordField from './SecurityPasswordField';
import { PasswordChangeErrors } from '@/types/security';

interface SecurityPasswordCardProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  errors: PasswordChangeErrors;
  onCurrentPasswordChange: (val: string) => void;
  onNewPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  onToggleShowCurrent: () => void;
  onToggleShowNew: () => void;
  onToggleShowConfirm: () => void;
}

export default function SecurityPasswordCard({
  currentPassword,
  newPassword,
  confirmPassword,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  errors,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleShowCurrent,
  onToggleShowNew,
  onToggleShowConfirm,
}: SecurityPasswordCardProps) {
  const errorMessage =
    errors.newPassword || errors.confirmPassword || errors.currentPassword || errors.general;

  return (
    <View style={styles.card}>
      {/* Header inside card */}
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Feather name="lock" size={20} color={ProfileColors.primary} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Ubah Password</Text>
          <Text style={styles.subtitle}>Gunakan minimal 8 karakter</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Field 1: Password Saat Ini */}
      <SecurityPasswordField
        label="Password Saat Ini"
        value={currentPassword}
        onChangeText={onCurrentPasswordChange}
        placeholder="Masukkan kata sandi saat ini"
        showPassword={showCurrentPassword}
        onToggleShowPassword={onToggleShowCurrent}
        hasError={!!errors.currentPassword}
      />

      {/* Field 2: Password Baru */}
      <SecurityPasswordField
        label="Password Baru"
        value={newPassword}
        onChangeText={onNewPasswordChange}
        placeholder="Buat kata sandi baru"
        showPassword={showNewPassword}
        onToggleShowPassword={onToggleShowNew}
        hasError={!!errors.newPassword}
      />

      {/* Field 3: Konfirmasi Password Baru */}
      <SecurityPasswordField
        label="Konfirmasi Password Baru"
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        placeholder="Ulangi kata sandi baru"
        showPassword={showConfirmPassword}
        onToggleShowPassword={onToggleShowConfirm}
        hasError={!!errors.confirmPassword}
      />

      {/* Error Banner jika validasi gagal */}
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 14,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: ProfileLayout.iconBadgeSize,
    height: ProfileLayout.iconBadgeSize,
    borderRadius: 14,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    marginTop: 2.5,
  },
  divider: {
    height: 1,
    backgroundColor: ProfileColors.divider,
    marginTop: 16,
    marginBottom: 6,
  },
  errorBanner: {
    backgroundColor: ProfileColors.errorBannerBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: ProfileColors.danger,
    lineHeight: 16,
  },
});

