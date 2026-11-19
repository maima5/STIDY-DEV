import React from 'react';
import { StyleSheet, Text, Pressable, Platform, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { APP_VERSION_LABEL } from '@/constants/profile-data';

interface ProfileLogoutButtonProps {
  onPress: () => void;
  showVersion?: boolean;
}

export default function ProfileLogoutButton({
  onPress,
  showVersion = true,
}: ProfileLogoutButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Keluar dari akun"
      >
        <Feather name="log-out" size={18} color={ProfileColors.danger} />
        <Text style={styles.buttonText}>Keluar dari akun</Text>
      </Pressable>

      {showVersion && (
        <Text style={styles.versionText}>{APP_VERSION_LABEL}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    borderRadius: ProfileLayout.buttonRadius,
    borderWidth: 1.5,
    borderColor: ProfileColors.dangerBorder,
    backgroundColor: ProfileColors.cardBg,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: ProfileColors.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.05)',
      },
    }),
  },
  buttonPressed: {
    backgroundColor: ProfileColors.dangerSoft,
    borderColor: ProfileColors.danger,
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: ProfileColors.danger,
    letterSpacing: -0.1,
  },
  versionText: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    fontWeight: '400',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});

