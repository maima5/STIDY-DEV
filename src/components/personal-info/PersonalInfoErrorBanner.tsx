import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProfileColors } from '@/constants/profile-theme';

interface PersonalInfoErrorBannerProps {
  message?: string;
}

export default function PersonalInfoErrorBanner({
  message,
}: PersonalInfoErrorBannerProps) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ProfileColors.errorBannerBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: ProfileColors.danger,
    lineHeight: 16,
  },
});

