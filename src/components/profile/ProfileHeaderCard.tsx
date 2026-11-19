import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { UserProfile } from '@/types/profile';

interface ProfileHeaderCardProps {
  profile: UserProfile;
  onEditAvatar?: () => void;
}

export default function ProfileHeaderCard({
  profile,
  onEditAvatar,
}: ProfileHeaderCardProps) {
  const hasPhoto = !!profile.avatarUri;

  return (
    <View style={styles.card}>
      {/* Soft gradient halo behind avatar */}
      <LinearGradient
        colors={['rgba(47, 174, 143, 0.18)', 'rgba(47, 174, 143, 0.04)', 'transparent']}
        style={styles.glowHalo}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Avatar Container with Edit Badge */}
      <Pressable
        style={styles.avatarWrapper}
        onPress={onEditAvatar}
        hitSlop={8}
        accessibilityLabel="Ubah Foto Profil"
        accessibilityRole="button"
      >
        <View style={styles.avatarCircle}>
          {hasPhoto ? (
            <Image
              source={{ uri: profile.avatarUri! }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarLetter}>{profile.avatarLetter || 'B'}</Text>
          )}
        </View>

        <View style={styles.avatarEditBadge}>
          <Feather name="edit-2" size={13} color={ProfileColors.textWhite} />
        </View>
      </Pressable>

      {/* User Info */}
      <Text style={styles.userName}>{profile.name}</Text>
      <Text style={styles.userRole}>{profile.role}</Text>

      {/* Email Pill Badge */}
      <View style={styles.emailPill}>
        <Feather name="mail" size={14} color={ProfileColors.textSecondary} />
        <Text style={styles.emailText}>{profile.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  glowHalo: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 120,
    borderRadius: 60,
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: 6,
    marginBottom: 12,
  },
  avatarCircle: {
    width: ProfileLayout.avatarSize,
    height: ProfileLayout.avatarSize,
    borderRadius: ProfileLayout.avatarSize / 2,
    backgroundColor: ProfileColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: ProfileLayout.avatarSize / 2,
  },
  avatarLetter: {
    color: ProfileColors.textWhite,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: ProfileLayout.avatarBadgeSize,
    height: ProfileLayout.avatarBadgeSize,
    borderRadius: ProfileLayout.avatarBadgeSize / 2,
    backgroundColor: ProfileColors.avatarEditBadgeBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ProfileColors.cardBg,
  },
  userName: {
    fontSize: 21,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.2,
  },
  userRole: {
    fontSize: 13,
    color: ProfileColors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ProfileColors.emailPillBg,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: ProfileLayout.pillRadius,
    marginTop: 14,
    gap: 7,
  },
  emailText: {
    fontSize: 12.5,
    color: ProfileColors.textEmail,
    fontWeight: '500',
  },
});
