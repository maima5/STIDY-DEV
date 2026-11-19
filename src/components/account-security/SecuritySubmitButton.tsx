import React from 'react';
import { StyleSheet, Text, Pressable, View, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface SecuritySubmitButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export default function SecuritySubmitButton({
  onPress,
  isLoading = false,
}: SecuritySubmitButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isLoading && styles.buttonDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Perbarui Keamanan"
    >
      <Text style={styles.buttonText}>Perbarui Keamanan</Text>

      <View style={styles.checkBadge}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Feather name="check" size={20} color="#FFFFFF" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: ProfileLayout.buttonRadius,
    backgroundColor: ProfileColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 12,
    marginTop: 20,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: ProfileColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 14px rgba(47, 174, 143, 0.25)',
      },
    }),
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: ProfileColors.textWhite,
    letterSpacing: -0.2,
  },
  checkBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ProfileColors.btnCheckmarkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

