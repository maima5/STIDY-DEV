import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ProfileColors } from '@/constants/profile-theme';

interface ProfileNavbarProps {
  title?: string;
  onEditPress?: () => void;
  onBackPress?: () => void;
}

export default function ProfileNavbar({
  title = 'Profil Saya',
  onEditPress,
  onBackPress,
}: ProfileNavbarProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)/home');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        style={styles.actionButton}
        hitSlop={12}
        accessibilityLabel="Kembali"
        accessibilityRole="button"
      >
        <Feather name="chevron-left" size={24} color={ProfileColors.textPrimary} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <Pressable
        onPress={onEditPress}
        style={styles.actionButton}
        hitSlop={12}
        accessibilityLabel="Edit Profil"
        accessibilityRole="button"
      >
        <Feather name="edit-3" size={20} color={ProfileColors.primary} />
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
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    letterSpacing: 0.2,
  },
});

