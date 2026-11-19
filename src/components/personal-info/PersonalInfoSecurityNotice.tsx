import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors } from '@/constants/profile-theme';

export default function PersonalInfoSecurityNotice() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Feather name="shield" size={15} color={ProfileColors.primary} />
      </View>
      <Text style={styles.text}>
        Informasimu tersimpan dengan aman dan tidak dibagikan kepada pihak lain.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 6,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 11,
    color: ProfileColors.textMuted,
    lineHeight: 16,
    fontWeight: '400',
  },
});

