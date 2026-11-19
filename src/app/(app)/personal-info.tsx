import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileColors } from '@/constants/profile-theme';
import { usePersonalInfo } from '@/hooks/use-personal-info';
import {
  PersonalInfoNavbar,
  PersonalInfoAvatarCard,
  PersonalInfoCard,
  PersonalInfoSecurityNotice,
  PersonalInfoSubmitButton,
  AvatarPickerModal,
} from '@/components/personal-info';

export default function PersonalInfoScreen() {
  const {
    name,
    email,
    role,
    avatarUri,
    errors,
    isSubmitting,
    isAvatarPickerVisible,
    handleNameChange,
    handleEmailChange,
    handlePickAvatar,
    handleCloseAvatarPicker,
    handleSelectCamera,
    handleSelectGallery,
    handleRemovePhoto,
    handleSave,
  } = usePersonalInfo();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <PersonalInfoNavbar
        title="Informasi Pribadi"
        onSave={handleSave}
        isSaving={isSubmitting}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar & Header Section */}
          <PersonalInfoAvatarCard
            name={name}
            avatarLetter={name.trim().charAt(0).toUpperCase() || 'B'}
            avatarUri={avatarUri}
            onEditAvatar={handlePickAvatar}
          />

          {/* Form Card: Detail Pribadi */}
          <PersonalInfoCard
            name={name}
            role={role}
            email={email}
            errors={errors}
            onNameChange={handleNameChange}
            onEmailChange={handleEmailChange}
          />

          {/* Security Notice */}
          <PersonalInfoSecurityNotice />

          {/* Primary Action Button */}
          <PersonalInfoSubmitButton
            onPress={handleSave}
            isLoading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Themed Avatar Picker Modal */}
      <AvatarPickerModal
        visible={isAvatarPickerVisible}
        onClose={handleCloseAvatarPicker}
        onSelectCamera={handleSelectCamera}
        onSelectGallery={handleSelectGallery}
        onRemovePhoto={handleRemovePhoto}
        hasExistingPhoto={!!avatarUri}
      />
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
