import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

/**
 * Request library permissions and open image picker
 */
export async function pickImageFromLibrary(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Akses Ditolak',
        'Aplikasi membutuhkan izin akses ke galeri foto untuk memilih foto profil.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image from library:', error);
    Alert.alert('Gagal', 'Terjadi kesalahan saat membuka galeri foto.');
    return null;
  }
}

/**
 * Request camera permissions and capture a photo
 */
export async function takePhotoWithCamera(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Kamera Ditolak',
        'Aplikasi membutuhkan izin kamera untuk mengambil foto profil baru.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error taking photo with camera:', error);
    Alert.alert('Gagal', 'Terjadi kesalahan saat membuka kamera.');
    return null;
  }
}

/**
 * Present an action alert allowing user to select Camera, Gallery, or Remove Photo
 */
export function promptAvatarPicker({
  onSelectPhoto,
  onRemovePhoto,
  hasExistingPhoto = false,
}: {
  onSelectPhoto: (uri: string) => void;
  onRemovePhoto?: () => void;
  hasExistingPhoto?: boolean;
}) {
  const buttons: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }> = [
    {
      text: 'Batal',
      style: 'cancel',
    },
    {
      text: 'Kamera',
      onPress: async () => {
        const uri = await takePhotoWithCamera();
        if (uri) onSelectPhoto(uri);
      },
    },
    {
      text: 'Pilih dari Galeri',
      onPress: async () => {
        const uri = await pickImageFromLibrary();
        if (uri) onSelectPhoto(uri);
      },
    },
  ];

  if (hasExistingPhoto && onRemovePhoto) {
    buttons.splice(1, 0, {
      text: 'Hapus Foto',
      style: 'destructive',
      onPress: onRemovePhoto,
    });
  }

  Alert.alert('Foto Profil', 'Pilih sumber foto untuk avatar akunmu:', buttons);
}

