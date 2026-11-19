import React from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';

interface HelpSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export default function HelpSearchBar({
  value,
  onChangeText,
  onClear,
}: HelpSearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={ProfileColors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Cari bantuan atau pertanyaan..."
        placeholderTextColor={ProfileColors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable
          onPress={onClear || (() => onChangeText(''))}
          hitSlop={8}
          accessibilityLabel="Hapus pencarian"
          accessibilityRole="button"
        >
          <Feather name="x" size={16} color={ProfileColors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: ProfileLayout.inputRadius,
    borderWidth: 1,
    borderColor: ProfileColors.border,
    backgroundColor: ProfileColors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    color: ProfileColors.textPrimary,
    fontWeight: '500',
    padding: 0,
  },
});

