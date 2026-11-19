import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import PersonalInfoField from './PersonalInfoField';
import PersonalInfoErrorBanner from './PersonalInfoErrorBanner';
import { PersonalInfoFormErrors } from '@/types/profile';

interface PersonalInfoCardProps {
  name: string;
  role: string;
  email: string;
  errors: PersonalInfoFormErrors;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
}

export default function PersonalInfoCard({
  name,
  role,
  email,
  errors,
  onNameChange,
  onEmailChange,
}: PersonalInfoCardProps) {
  return (
    <View style={styles.card}>
      {/* Header inside card */}
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Feather name="user" size={20} color={ProfileColors.primary} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Detail pribadi</Text>
          <Text style={styles.subtitle}>Perbarui informasi dasar akunmu</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Field 1: Nama Lengkap */}
      <PersonalInfoField
        label="Nama Lengkap"
        iconName="user"
        value={name}
        onChangeText={onNameChange}
        placeholder="Masukkan nama lengkap"
        hasError={!!errors.name}
        autoCapitalize="words"
      />

      {/* Field 2: Role (Read-only dengan badge Tetap) */}
      <PersonalInfoField
        label="Role"
        iconName="shield"
        value={role}
        isReadOnly={true}
        readOnlyBadgeText="Tetap"
      />

      {/* Field 3: Alamat Email */}
      <PersonalInfoField
        label="Alamat Email"
        iconName="mail"
        value={email}
        onChangeText={onEmailChange}
        placeholder="budi@student.ac.id"
        keyboardType="email-address"
        autoCapitalize="none"
        hasError={!!errors.email}
      />

      {/* Error Banner jika validasi gagal */}
      <PersonalInfoErrorBanner message={errors.name || errors.email || errors.general} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    padding: 20,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: ProfileLayout.iconBadgeSize,
    height: ProfileLayout.iconBadgeSize,
    borderRadius: 14,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextCol: {
    flex: 1,
    justifyContent: 'center',
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
  divider: {
    height: 1,
    backgroundColor: ProfileColors.divider,
    marginTop: 16,
    marginBottom: 6,
  },
});

