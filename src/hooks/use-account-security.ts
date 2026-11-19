import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useProfileContext } from '@/context/profile-context';
import {
  validateNewPassword,
  validateConfirmPassword,
  validateCurrentPassword,
} from '@/utils/validators';
import { changePassword } from '@/services/security';
import { PRIVACY_POLICY_SUMMARY } from '@/constants/security-data';
import { PasswordChangeErrors } from '@/types/security';

export function useAccountSecurity() {
  const { securityPreferences, updateSecurityPreferences } = useProfileContext();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [errors, setErrors] = useState<PasswordChangeErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (securityPreferences) {
      setIsPrivateProfile(securityPreferences.isPrivateProfile);
    }
  }, [securityPreferences]);

  const handleCurrentPasswordChange = (val: string) => {
    setCurrentPassword(val);
    if (hasAttemptedSubmit) {
      const err = validateCurrentPassword(val);
      setErrors((prev) => ({ ...prev, currentPassword: err || undefined }));
    }
  };

  const handleNewPasswordChange = (val: string) => {
    setNewPassword(val);
    if (hasAttemptedSubmit) {
      const err = validateNewPassword(val);
      setErrors((prev) => ({ ...prev, newPassword: err || undefined }));
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (hasAttemptedSubmit) {
      const err = validateConfirmPassword(newPassword, val);
      setErrors((prev) => ({ ...prev, confirmPassword: err || undefined }));
    }
  };

  const togglePrivateProfile = (val: boolean) => {
    setIsPrivateProfile(val);
    updateSecurityPreferences({ isPrivateProfile: val });
  };

  const handleOpenPrivacyPolicy = () => {
    Alert.alert('Kebijakan Privasi', PRIVACY_POLICY_SUMMARY, [
      { text: 'Tutup', style: 'default' },
    ]);
  };

  const handleSaveSecurity = async () => {
    setHasAttemptedSubmit(true);

    // Validate if user has entered password fields
    const currentErr = validateCurrentPassword(currentPassword);
    const newErr = validateNewPassword(newPassword);
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);

    if (currentErr || newErr || confirmErr) {
      setErrors({
        currentPassword: currentErr || undefined,
        newPassword: newErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      await updateSecurityPreferences({ isPrivateProfile });

      Alert.alert(
        'Berhasil',
        'Pengaturan keamanan dan kata sandi Anda telah diperbarui.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/(tabs)/profile');
              }
            },
          },
        ]
      );
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat memperbarui keamanan akun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    isPrivateProfile,
    errors,
    isSubmitting,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    togglePrivateProfile,
    handleOpenPrivacyPolicy,
    handleSaveSecurity,
  };
}

