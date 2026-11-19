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
import { ProfileColors } from '@/constants/profile-theme';

interface AvatarPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  onRemovePhoto?: () => void;
  hasExistingPhoto?: boolean;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function AvatarPickerModal({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
  onRemovePhoto,
  hasExistingPhoto = false,
}: AvatarPickerModalProps) {
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
          {/* Drag Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <Text style={styles.title}>Ubah Foto Profil</Text>
              <Text style={styles.subtitle}>
                Pilih sumber foto untuk avatar akun S-Tidy kamu
              </Text>
            </View>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={8}
              accessibilityLabel="Tutup"
              accessibilityRole="button"
            >
              <Feather name="x" size={18} color={ProfileColors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* Option 1: Kamera */}
          <Pressable
            style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
            onPress={() => {
              onClose();
              setTimeout(onSelectCamera, 200);
            }}
            accessibilityRole="button"
            accessibilityLabel="Ambil dari Kamera"
          >
            <View style={styles.iconCircle}>
              <Feather name="camera" size={20} color={ProfileColors.primary} />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Ambil dari Kamera</Text>
              <Text style={styles.optionSub}>Gunakan kamera untuk mengambil foto baru</Text>
            </View>
            <Feather name="chevron-right" size={18} color={ProfileColors.chevron} />
          </Pressable>

          {/* Option 2: Galeri Foto */}
          <Pressable
            style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
            onPress={() => {
              onClose();
              setTimeout(onSelectGallery, 200);
            }}
            accessibilityRole="button"
            accessibilityLabel="Pilih dari Galeri"
          >
            <View style={styles.iconCircle}>
              <Feather name="image" size={20} color={ProfileColors.primary} />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Pilih dari Galeri</Text>
              <Text style={styles.optionSub}>Pilih foto dari penyimpanan perangkatmu</Text>
            </View>
            <Feather name="chevron-right" size={18} color={ProfileColors.chevron} />
          </Pressable>

          {/* Option 3: Hapus Foto Profil (Jika ada foto yang sedang digunakan) */}
          {hasExistingPhoto && onRemovePhoto && (
            <Pressable
              style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
              onPress={() => {
                onClose();
                setTimeout(onRemovePhoto, 150);
              }}
              accessibilityRole="button"
              accessibilityLabel="Hapus Foto Profil"
            >
              <View style={[styles.iconCircle, styles.iconCircleDanger]}>
                <Feather name="trash-2" size={20} color={ProfileColors.danger} />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, styles.optionTitleDanger]}>
                  Hapus Foto Profil
                </Text>
                <Text style={styles.optionSub}>
                  Kembalikan avatar ke inisial huruf nama
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={ProfileColors.dangerBorder} />
            </Pressable>
          )}

          {/* Cancel Button */}
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Batal"
          >
            <Text style={styles.cancelBtnText}>Batal</Text>
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
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12.5,
    color: ProfileColors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: ProfileColors.divider,
    marginTop: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  optionPressed: {
    backgroundColor: '#F8FAFC',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleDanger: {
    backgroundColor: ProfileColors.dangerSoft,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
  },
  optionTitleDanger: {
    color: ProfileColors.danger,
  },
  optionSub: {
    fontSize: 12,
    color: ProfileColors.textMuted,
    marginTop: 2.5,
  },
  cancelBtn: {
    height: 50,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  cancelBtnPressed: {
    backgroundColor: '#E2E8F0',
  },
  cancelBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: ProfileColors.textSecondary,
  },
});

