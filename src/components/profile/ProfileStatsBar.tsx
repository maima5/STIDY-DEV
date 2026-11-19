import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { ProfileStats } from '@/types/profile';
import { formatDecimal } from '@/utils/formatters';

interface ProfileStatsBarProps {
  stats: ProfileStats;
}

export default function ProfileStatsBar({ stats }: ProfileStatsBarProps) {
  return (
    <View style={styles.card}>
      {/* Stat 1: Jam Fokus */}
      <View style={styles.statCol}>
        <Text style={styles.statValue}>{formatDecimal(stats.focusHours)}</Text>
        <Text style={styles.statLabel}>Jam fokus</Text>
      </View>

      <View style={styles.divider} />

      {/* Stat 2: Sesi Selesai */}
      <View style={styles.statCol}>
        <Text style={styles.statValue}>{stats.completedSessions}</Text>
        <Text style={styles.statLabel}>Sesi selesai</Text>
      </View>

      <View style={styles.divider} />

      {/* Stat 3: Hari Aktif */}
      <View style={styles.statCol}>
        <Text style={styles.statValue}>{stats.activeDays}</Text>
        <Text style={styles.statLabel}>Hari aktif</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.statCardRadius,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
      },
    }),
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 21,
    fontWeight: '800',
    color: ProfileColors.primary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    fontWeight: '500',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: ProfileColors.divider,
  },
});

