import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useProfileContext } from '@/context/profile-context';
import { validateFullName, validateEmail } from '@/utils/validators';
import { pickImageFromLibrary, takePhotoWithCamera } from '@/utils/image-picker';
import { PersonalInfoFormErrors } from '@/types/profile';

export function usePersonalInfo() {
  const { profile, updateProfile, updateAvatar, isLoading } = useProfileContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Pelajar');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<PersonalInfoFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setRole(profile.role || 'Pelajar');
      setAvatarUri(profile.avatarUri || null);
    }
  }, [profile]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (hasAttemptedSubmit) {
      const err = validateFullName(val);
      setErrors((prev) => ({ ...prev, name: err || undefined }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (hasAttemptedSubmit) {
      const err = validateEmail(val);
      setErrors((prev) => ({ ...prev, email: err || undefined }));
    }
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
      setAvatarUri(uri);
      await updateAvatar(uri);
    }
  };

  const handleSelectGallery = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      setAvatarUri(uri);
      await updateAvatar(uri);
    }
  };

  const handleRemovePhoto = async () => {
    setAvatarUri(null);
    await updateAvatar(null);
  };

  const handleSave = async () => {
    setHasAttemptedSubmit(true);
    const nameErr = validateFullName(name);
    const emailErr = validateEmail(email);

    if (nameErr || emailErr) {
      setErrors({
        name: nameErr || undefined,
        email: emailErr || undefined,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        avatarUri,
      });
      Alert.alert('Berhasil', 'Informasi pribadi berhasil disimpan!', [
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
      ]);
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan perubahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    name,
    email,
    role,
    avatarUri,
    errors,
    isSubmitting,
    isLoading,
    isAvatarPickerVisible,
    handleNameChange,
    handleEmailChange,
    handlePickAvatar: handleOpenAvatarPicker,
    handleOpenAvatarPicker,
    handleCloseAvatarPicker,
    handleSelectCamera,
    handleSelectGallery,
    handleRemovePhoto,
    handleSave,
  };
}
