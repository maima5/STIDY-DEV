import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileColors } from '@/constants/profile-theme';
import { useHelpCenter } from '@/hooks/use-help-center';
import {
  HelpNavbar,
  HelpBanner,
  HelpSearchBar,
  HelpFaqAccordion,
  HelpContactOptions,
  HelpContactModal,
  HelpReportModal,
} from '@/components/help-center';

export default function HelpCenterScreen() {
  const {
    searchQuery,
    setSearchQuery,
    filteredFaqs,
    expandedFaqId,
    toggleFaq,
    supportInfo,
    isContactModalVisible,
    openContactModal,
    closeContactModal,
    isReportModalVisible,
    openReportModal,
    closeReportModal,
    handleCopyEmail,
    handleReportIssue,
  } = useHelpCenter();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Top Navbar */}
      <HelpNavbar title="Pusat Bantuan" />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner: Halo, ada yang bisa dibantu? */}
        <HelpBanner />

        {/* Search Bar */}
        <HelpSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Section 1: Pertanyaan Populer Accordion */}
        <HelpFaqAccordion
          faqs={filteredFaqs}
          expandedId={expandedFaqId}
          onToggle={toggleFaq}
        />

        {/* Section 2: Butuh Bantuan Lain? */}
        <HelpContactOptions
          onPressContactSupport={openContactModal}
          onPressReportBug={openReportModal}
        />
      </ScrollView>

      {/* Themed Bottom Sheet: Hubungi Layanan Pengguna */}
      <HelpContactModal
        visible={isContactModalVisible}
        onClose={closeContactModal}
        supportInfo={supportInfo}
        onCopyEmail={handleCopyEmail}
      />

      {/* Modal: Laporkan Masalah Teknis */}
      <HelpReportModal
        visible={isReportModalVisible}
        onClose={closeReportModal}
        onSubmit={handleReportIssue}
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
    paddingTop: 4,
    paddingBottom: 32,
  },
});

