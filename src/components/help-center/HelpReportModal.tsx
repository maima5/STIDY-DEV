import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface HelpReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: string, description: string) => void;
}

const CATEGORIES = ['Jadwal & Kalender', 'Notifikasi', 'Akun & Profil', 'Kendala Lainnya'];

export default function HelpReportModal({
  visible,
  onClose,
  onSubmit,
}: HelpReportModalProps) {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedCat, desc);
    setDesc('');
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.iconBadge}>
              <Feather name="alert-triangle" size={20} color="#D97706" />
            </View>
            <View style={styles.headerTextCol}>
              <Text style={styles.title}>Laporkan Masalah Teknis</Text>
              <Text style={styles.subtitle}>Bantu kami memperbaiki kendala pada aplikasi</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <Feather name="x" size={18} color={ProfileColors.textMuted} />
            </Pressable>
          </View>

          {/* Category Selector */}
          <Text style={styles.inputLabel}>Kategori Kendala</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((cat) => {
              const active = selectedCat === cat;
              return (
                <Pressable
                  key={cat}
                  style={[styles.catChip, active && styles.catChipActive]}
                  onPress={() => setSelectedCat(cat)}
                >
                  <Text style={[styles.catText, active && styles.catTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Description Input */}
          <Text style={styles.inputLabel}>Deskripsi Kendala</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={desc}
            onChangeText={setDesc}
            placeholder="Jelaskan kendala atau error yang Anda alami secara singkat..."
            placeholderTextColor={ProfileColors.textMuted}
            textAlignVertical="top"
          />

          {/* Actions */}
          <View style={styles.btnRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Kirim Laporan</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.cardRadius,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
  },
  subtitle: {
    fontSize: 11.5,
    color: ProfileColors.textMuted,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    marginTop: 10,
    marginBottom: 8,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  catChipActive: {
    backgroundColor: ProfileColors.primarySoft,
  },
  catText: {
    fontSize: 12,
    color: ProfileColors.textSecondary,
    fontWeight: '600',
  },
  catTextActive: {
    color: ProfileColors.primary,
  },
  textArea: {
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ProfileColors.border,
    padding: 12,
    fontSize: 13.5,
    color: ProfileColors.textPrimary,
    backgroundColor: '#FAFAFA',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: ProfileColors.textSecondary,
  },
  submitBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: ProfileColors.primary,
  },
  submitText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

