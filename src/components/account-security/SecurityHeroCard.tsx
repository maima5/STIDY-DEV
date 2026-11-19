import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors } from '@/constants/profile-theme';

export default function SecurityHeroCard() {
  return (
    <View style={styles.container}>
      {/* Decorative background shape */}
      <View style={styles.decorativeShape} />

      <View style={styles.contentRow}>
        <View style={styles.iconBadge}>
          <Feather name="shield" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>Jaga akunmu tetap aman</Text>
          <Text style={styles.subtitle}>
            Kelola kata sandi dan preferensi privasi akun S-Tidy.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeShape: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(47, 174, 143, 0.08)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: ProfileColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: ProfileColors.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },
});

