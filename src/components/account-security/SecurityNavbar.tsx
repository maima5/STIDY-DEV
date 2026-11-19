import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ProfileColors } from '@/constants/profile-theme';

interface SecurityNavbarProps {
  title?: string;
  onBackPress?: () => void;
}

export default function SecurityNavbar({
  title = 'Keamanan Akun',
  onBackPress,
}: SecurityNavbarProps) {
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

      {/* Spacer to keep title centered */}
      <View style={styles.spacer} />
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
  spacer: {
    width: 40,
  },
});

