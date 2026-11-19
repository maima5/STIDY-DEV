import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface SecurityPolicyCardProps {
  onPress: () => void;
}

export default function SecurityPolicyCard({ onPress }: SecurityPolicyCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>LEGAL & POLICIES</Text>

      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Buka Kebijakan Privasi"
      >
        <View style={styles.leftRow}>
          <View style={styles.iconBadge}>
            <Feather name="shield" size={20} color={ProfileColors.primary} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.subtitle}>Kebijakan Privasi</Text>
          </View>
        </View>

        <Feather name="chevron-right" size={18} color={ProfileColors.chevron} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    padding: 16,
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 14,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: ProfileColors.textMuted,
    marginBottom: 12,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderRadius: 12,
  },
  rowPressed: {
    opacity: 0.8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  iconBadge: {
    width: ProfileLayout.iconBadgeSize,
    height: ProfileLayout.iconBadgeSize,
    borderRadius: 14,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    marginTop: 2.5,
  },
});

