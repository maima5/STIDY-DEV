import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { SupportInfo } from '@/types/help';

interface HelpContactModalProps {
  visible: boolean;
  onClose: () => void;
  supportInfo: SupportInfo;
  onCopyEmail: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function HelpContactModal({
  visible,
  onClose,
  supportInfo,
  onCopyEmail,
}: HelpContactModalProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted && !visible) return null;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Bottom Sheet Card */}
        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 12,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Top Handle Bar */}
          <View style={styles.handleBar} />

          {/* Centered Message Badge */}
          <View style={styles.centerBadge}>
            <Feather name="message-square" size={24} color="#FFFFFF" />
          </View>

          {/* Eyebrow, Title & Subtitle */}
          <Text style={styles.eyebrow}>TIM DUKUNGAN S-TIDY</Text>
          <Text style={styles.title}>Hubungi Layanan Pengguna</Text>
          <Text style={styles.subtitle}>
            Kami siap membantu pertanyaan tentang akun, jadwal belajar, dan fitur S-Tidy.
          </Text>

          {/* Support Details Info Box */}
          <View style={styles.infoCard}>
            {/* Email Support Row */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Feather name="mail" size={17} color={ProfileColors.primary} />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Email dukungan</Text>
                <Text style={styles.infoValue}>{supportInfo.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Support Hours Row */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Feather name="message-square" size={17} color={ProfileColors.primary} />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Jam layanan</Text>
                <Text style={styles.infoValue}>{supportInfo.hours}</Text>
              </View>
            </View>
          </View>

          {/* Primary Action Button: Salin Email Dukungan */}
          <Pressable
            style={({ pressed }) => [styles.copyBtn, pressed && styles.copyBtnPressed]}
            onPress={onCopyEmail}
            accessibilityRole="button"
            accessibilityLabel="Salin Email Dukungan"
          >
            <Text style={styles.copyBtnText}>Salin Email Dukungan</Text>
            <View style={styles.copyIconBadge}>
              <Feather name="mail" size={18} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Dismiss Text Button: Tutup */}
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Tutup"
          >
            <Text style={styles.closeBtnText}>Tutup</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: ProfileColors.cardBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  centerBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: ProfileColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: ProfileColors.primary,
    marginBottom: 6,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: ProfileColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  infoCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ProfileColors.border,
    backgroundColor: ProfileColors.cardBg,
    padding: 14,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10.5,
    color: ProfileColors.textMuted,
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: ProfileColors.divider,
    marginVertical: 10,
  },
  copyBtn: {
    width: '100%',
    height: 54,
    borderRadius: ProfileLayout.buttonRadius,
    backgroundColor: ProfileColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
    marginTop: 18,
    ...Platform.select({
      ios: {
        shadowColor: ProfileColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  copyBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  copyBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: ProfileColors.textWhite,
  },
  copyIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: ProfileColors.btnCheckmarkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    opacity: 0.6,
  },
  closeBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: ProfileColors.textSecondary,
  },
});

