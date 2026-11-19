import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface PersonalInfoAvatarCardProps {
  name: string;
  avatarLetter: string;
  avatarUri?: string | null;
  onEditAvatar?: () => void;
}

export default function PersonalInfoAvatarCard({
  name,
  avatarLetter,
  avatarUri,
  onEditAvatar,
}: PersonalInfoAvatarCardProps) {
  const displayName = name.trim() || 'Budi';
  const displayLetter = avatarLetter || displayName.charAt(0).toUpperCase() || 'B';
  const hasPhoto = !!avatarUri;

  return (
    <View style={styles.container}>
      {/* Decorative subtle background shape */}
      <View style={styles.decorativeCircle} />

      {/* Squircle Avatar with Edit Badge */}
      <Pressable
        style={styles.avatarWrapper}
        onPress={onEditAvatar}
        hitSlop={8}
        accessibilityLabel="Ubah Foto Profil"
        accessibilityRole="button"
      >
        <View style={styles.squircleAvatar}>
          {hasPhoto ? (
            <Image
              source={{ uri: avatarUri! }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarLetter}>{displayLetter}</Text>
          )}
        </View>

        <View style={styles.avatarBadge}>
          <Feather name="edit-2" size={13} color={ProfileColors.textWhite} />
        </View>
      </Pressable>

      {/* Name and Subtitle */}
      <Text style={styles.userName}>{displayName}</Text>
      <Text style={styles.subtitle}>Ketuk ikon untuk mengubah foto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(47, 174, 143, 0.08)',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  squircleAvatar: {
    width: ProfileLayout.avatarSize,
    height: ProfileLayout.avatarSize,
    borderRadius: ProfileLayout.avatarSquircleRadius,
    backgroundColor: ProfileColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: ProfileColors.primary,
        shadowOffset: { width: 0, height: 6 },
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
    borderRadius: ProfileLayout.avatarSquircleRadius,
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: ProfileColors.textWhite,
    letterSpacing: -0.5,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
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
    fontSize: 22,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: ProfileColors.textMuted,
    marginTop: 4,
  },
});
