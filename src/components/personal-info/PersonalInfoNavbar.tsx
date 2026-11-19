import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ProfileColors } from '@/constants/profile-theme';

interface PersonalInfoNavbarProps {
  title?: string;
  onSave?: () => void;
  onBackPress?: () => void;
  isSaving?: boolean;
}

export default function PersonalInfoNavbar({
  title = 'Informasi Pribadi',
  onSave,
  onBackPress,
  isSaving = false,
}: PersonalInfoNavbarProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)/profile');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        style={styles.backButton}
        hitSlop={10}
        accessibilityLabel="Kembali"
        accessibilityRole="button"
      >
        <Feather name="chevron-left" size={22} color={ProfileColors.textPrimary} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <Pressable
        onPress={onSave}
        style={styles.saveButton}
        hitSlop={10}
        disabled={isSaving}
        accessibilityLabel="Simpan Perubahan"
        accessibilityRole="button"
      >
        <Text style={[styles.saveText, isSaving && styles.saveTextDisabled]}>
          Simpan
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ProfileColors.screenBg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ProfileColors.border,
    backgroundColor: ProfileColors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.2,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: ProfileColors.primary,
  },
  saveTextDisabled: {
    opacity: 0.5,
  },
});

