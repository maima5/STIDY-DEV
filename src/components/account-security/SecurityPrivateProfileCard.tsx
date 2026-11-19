import React from 'react';
import { StyleSheet, Text, View, Switch, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface SecurityPrivateProfileCardProps {
  isPrivate: boolean;
  onToggle: (val: boolean) => void;
}

export default function SecurityPrivateProfileCard({
  isPrivate,
  onToggle,
}: SecurityPrivateProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftRow}>
        <View style={styles.iconBadge}>
          <Feather name="shield" size={20} color={ProfileColors.primary} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>Private Profile</Text>
          <Text style={styles.subtitle}>Sembunyikan aktivitas belajar dari publik</Text>
        </View>
      </View>

      <Switch
        value={isPrivate}
        onValueChange={onToggle}
        trackColor={{
          false: ProfileColors.switchTrackOff,
          true: ProfileColors.primary,
        }}
        thumbColor={ProfileColors.switchThumb}
        ios_backgroundColor={ProfileColors.switchTrackOff}
        style={Platform.select({
          android: { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] },
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 15,
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

