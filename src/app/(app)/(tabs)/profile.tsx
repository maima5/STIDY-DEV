import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileColors } from '@/constants/profile-theme';
import { useProfile } from '@/hooks/use-profile';
import {
  ProfileNavbar,
  ProfileHeaderCard,
  ProfileStatsBar,
  ProfileSection,
  ProfileLogoutButton,
  AvatarPickerModal,
} from '@/components/profile';
import { ProfileMenuItemData } from '@/types/profile';

export default function ProfileScreen() {
  const {
    profile,
    stats,
    notificationsEnabled,
    isAvatarPickerVisible,
    toggleNotifications,
    handleEditProfile,
    handleEditAvatar,
    handleCloseAvatarPicker,
    handleSelectCamera,
    handleSelectGallery,
    handleRemovePhoto,
    handleNavigateSection,
    handleLogoutConfirm,
  } = useProfile();

  // Menu items for "Pengaturan akun"
  const accountSettingsItems: ProfileMenuItemData[] = [
    {
      id: 'personal_info',
      icon: 'user',
      title: 'Informasi pribadi',
      subtitle: 'Nama dan alamat email',
      type: 'navigation',
      onPress: () => handleNavigateSection('personal_info', 'Informasi pribadi'),
    },
    {
      id: 'notifications',
      icon: 'bell',
      title: 'Notifikasi',
      subtitle: 'Pengingat jadwal belajarmu',
      type: 'toggle',
      value: notificationsEnabled,
      onToggle: toggleNotifications,
    },
    {
      id: 'account_security',
      icon: 'lock',
      title: 'Keamanan akun',
      subtitle: 'Kata sandi dan privasi',
      type: 'navigation',
      onPress: () => handleNavigateSection('account_security', 'Keamanan akun'),
    },
  ];

  // Menu items for "Lainnya"
  const otherItems: ProfileMenuItemData[] = [
    {
      id: 'help_center',
      icon: 'help-circle',
      title: 'Pusat bantuan',
      subtitle: 'Pertanyaan dan dukungan',
      type: 'navigation',
      onPress: () => handleNavigateSection('help_center', 'Pusat bantuan'),
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <ProfileNavbar
        title="Profil Saya"
        onEditPress={handleEditProfile}
      />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card (Avatar, Name, Role, Email) */}
        <ProfileHeaderCard
          profile={profile}
          onEditAvatar={handleEditAvatar}
        />

        {/* Stats Summary Bar (Jam Fokus, Sesi Selesai, Hari Aktif) */}
        <ProfileStatsBar stats={stats} />

        {/* Account Settings Section */}
        <ProfileSection
          title="Pengaturan akun"
          items={accountSettingsItems}
        />

        {/* Others Section */}
        <ProfileSection
          title="Lainnya"
          items={otherItems}
        />

        {/* Logout Button & App Version */}
        <ProfileLogoutButton
          onPress={handleLogoutConfirm}
          showVersion={true}
        />
      </ScrollView>

      {/* Themed Avatar Picker Modal */}
      <AvatarPickerModal
        visible={isAvatarPickerVisible}
        onClose={handleCloseAvatarPicker}
        onSelectCamera={handleSelectCamera}
        onSelectGallery={handleSelectGallery}
        onRemovePhoto={handleRemovePhoto}
        hasExistingPhoto={!!profile.avatarUri}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProfileColors.screenBg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 16,
  },
});
