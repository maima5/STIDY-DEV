import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface HelpContactOptionsProps {
  onPressContactSupport: () => void;
  onPressReportBug: () => void;
}

export default function HelpContactOptions({
  onPressContactSupport,
  onPressReportBug,
}: HelpContactOptionsProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.sectionTitle}>Butuh Bantuan Lain?</Text>

      {/* Options Card */}
      <View style={styles.card}>
        {/* Row 1: Hubungi Layanan Pengguna */}
        <Pressable
          style={({ pressed }) => [styles.optionRow, pressed && styles.rowPressed]}
          onPress={onPressContactSupport}
          accessibilityRole="button"
          accessibilityLabel="Hubungi Layanan Pengguna"
        >
          <View style={styles.iconBadgeTeal}>
            <Feather name="message-square" size={20} color={ProfileColors.primary} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title}>Hubungi Layanan Pengguna</Text>
            <Text style={styles.subtitle}>Chat atau email tim dukungan</Text>
          </View>
          <Feather name="chevron-right" size={18} color={ProfileColors.chevron} />
        </Pressable>

        <View style={styles.divider} />

        {/* Row 2: Laporkan Masalah Teknis */}
        <Pressable
          style={({ pressed }) => [styles.optionRow, pressed && styles.rowPressed]}
          onPress={onPressReportBug}
          accessibilityRole="button"
          accessibilityLabel="Laporkan Masalah Teknis"
        >
          <View style={styles.iconBadgeAmber}>
            <Feather name="alert-triangle" size={20} color="#D97706" />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title}>Laporkan Masalah Teknis</Text>
            <Text style={styles.subtitle}>Formulir kendala aplikasi</Text>
          </View>
          <Feather name="chevron-right" size={18} color={ProfileColors.chevron} />
        </Pressable>
      </View>

      {/* Footer Estimate Note */}
      <View style={styles.footerNote}>
        <Feather name="mail" size={14} color={ProfileColors.primary} />
        <Text style={styles.footerText}>Tim kami biasanya merespons dalam 1×24 jam.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    marginBottom: 10,
    paddingHorizontal: 2,
    letterSpacing: -0.1,
  },
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    overflow: 'hidden',
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  rowPressed: {
    backgroundColor: '#F8FAFC',
  },
  iconBadgeTeal: {
    width: ProfileLayout.iconBadgeSize,
    height: ProfileLayout.iconBadgeSize,
    borderRadius: 14,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconBadgeAmber: {
    width: ProfileLayout.iconBadgeSize,
    height: ProfileLayout.iconBadgeSize,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
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
  },
  subtitle: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    marginTop: 2.5,
  },
  divider: {
    height: 1,
    backgroundColor: ProfileColors.divider,
    marginHorizontal: 16,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 6,
  },
  footerText: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    fontWeight: '400',
  },
});

