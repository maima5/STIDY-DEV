import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { ProfileMenuItemData } from '@/types/profile';
import ProfileMenuItem from './ProfileMenuItem';

interface ProfileSectionProps {
  title: string;
  items: ProfileMenuItemData[];
}

export default function ProfileSection({ title, items }: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <ProfileMenuItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    marginBottom: 10,
    marginLeft: 2,
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
});

