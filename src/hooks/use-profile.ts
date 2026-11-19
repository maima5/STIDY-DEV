import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useProfileContext } from '@/context/profile-context';
import { pickImageFromLibrary, takePhotoWithCamera } from '@/utils/image-picker';

export function useProfile() {
  const {
    profile,
    stats,
    settings,
    isLoading,
    updateProfile,
    updateAvatar,
    toggleNotifications,
    logout,
  } = useProfileContext();

  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);

  const handleEditProfile = () => {
    router.push('/(app)/personal-info');
  };

  const handleOpenAvatarPicker = () => {
    setIsAvatarPickerVisible(true);
  };

  const handleCloseAvatarPicker = () => {
    setIsAvatarPickerVisible(false);
  };

  const handleSelectCamera = async () => {
    const uri = await takePhotoWithCamera();
    if (uri) {
      await updateAvatar(uri);
    }
  };

  const handleSelectGallery = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      await updateAvatar(uri);
    }
  };

  const handleRemovePhoto = async () => {
    await updateAvatar(null);
  };

  const handleNavigateSection = (id: string, title: string) => {
    if (id === 'personal_info') {
      router.push('/(app)/personal-info');
      return;
    }
    if (id === 'account_security') {
      router.push('/(app)/account-security');
      return;
    }
    if (id === 'help_center') {
      router.push('/(app)/help-center');
      return;
    }
    Alert.alert(title, `Halaman ${title} akan segera hadir.`);
  };

  const handleLogoutConfirm = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Apakah Anda yakin ingin keluar dari akun S-Tidy?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return {
    profile,
    stats,
    notificationsEnabled: settings.notifications,
    isLoading,
    isAvatarPickerVisible,
    toggleNotifications,
    handleEditProfile,
    handleEditAvatar: handleOpenAvatarPicker,
    handleOpenAvatarPicker,
    handleCloseAvatarPicker,
    handleSelectCamera,
    handleSelectGallery,
    handleRemovePhoto,
    handleNavigateSection,
    handleLogoutConfirm,
  };
}
