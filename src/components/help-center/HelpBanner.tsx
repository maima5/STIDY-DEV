import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { ProfileLayout } from '@/constants/profile-theme';

export default function HelpBanner() {
  return (
    <LinearGradient
      colors={['#0E8A70', '#2FAE8F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      {/* Decorative concentric ring watermark on right */}
      <View style={styles.watermarkRing} />

      <View style={styles.iconBadge}>
        <Feather name="help-circle" size={24} color="#FFFFFF" />
      </View>

      <View style={styles.textCol}>
        <Text style={styles.title}>Halo, ada yang bisa dibantu?</Text>
        <Text style={styles.subtitle}>
          Temukan jawaban atau hubungi tim dukungan S-Tidy.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: ProfileLayout.cardRadius,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 8,
  },
  watermarkRing: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 14,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    lineHeight: 16,
  },
});

