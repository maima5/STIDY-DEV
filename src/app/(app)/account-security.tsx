import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileColors } from '@/constants/profile-theme';
import { useAccountSecurity } from '@/hooks/use-account-security';
import {
  SecurityNavbar,
  SecurityHeroCard,
  SecurityPasswordCard,
  SecurityPrivateProfileCard,
  SecurityPolicyCard,
  SecuritySubmitButton,
} from '@/components/account-security';

export default function AccountSecurityScreen() {
  const {
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
  } = useAccountSecurity();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <SecurityNavbar title="Keamanan Akun" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Header: Jaga akunmu tetap aman */}
          <SecurityHeroCard />

          {/* Card 1: Ubah Password Form */}
          <SecurityPasswordCard
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            errors={errors}
            onCurrentPasswordChange={handleCurrentPasswordChange}
            onNewPasswordChange={handleNewPasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            onToggleShowCurrent={() => setShowCurrentPassword(!showCurrentPassword)}
            onToggleShowNew={() => setShowNewPassword(!showNewPassword)}
            onToggleShowConfirm={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Card 2: Private Profile Toggle */}
          <SecurityPrivateProfileCard
            isPrivate={isPrivateProfile}
            onToggle={togglePrivateProfile}
          />

          {/* Card 3: Legal & Policies / Privacy Policy */}
          <SecurityPolicyCard onPress={handleOpenPrivacyPolicy} />

          {/* Action Button: Perbarui Keamanan */}
          <SecuritySubmitButton
            onPress={handleSaveSecurity}
            isLoading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileColors.screenBg,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
});

