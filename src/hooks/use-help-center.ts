import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { INITIAL_FAQS, SUPPORT_INFO } from '@/constants/help-data';
import { submitIssueReport } from '@/services/help';

export function useHelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_01'); // First item expanded by default as in design screenshot
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  // Filter FAQs based on search input
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return INITIAL_FAQS;
    return INITIAL_FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const openContactModal = () => setIsContactModalVisible(true);
  const closeContactModal = () => setIsContactModalVisible(false);

  const openReportModal = () => setIsReportModalVisible(true);
  const closeReportModal = () => setIsReportModalVisible(false);

  const handleCopyEmail = () => {
    Alert.alert(
      'Email Tersalin',
      `Alamat email dukungan (${SUPPORT_INFO.email}) telah disalin. Silakan kirimkan pertanyaanmu melalui aplikasi email.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleReportIssue = async (category: string, description: string) => {
    if (!description.trim()) {
      Alert.alert('Perhatian', 'Mohon tuliskan deskripsi kendala teknis yang dialami.');
      return;
    }
    await submitIssueReport({ category, description });
    closeReportModal();
    Alert.alert(
      'Laporan Terkirim',
      'Terima kasih telah melaporkan kendala. Tim pengembang S-Tidy akan segera memeriksanya.'
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredFaqs,
    expandedFaqId,
    toggleFaq,
    supportInfo: SUPPORT_INFO,
    isContactModalVisible,
    openContactModal,
    closeContactModal,
    isReportModalVisible,
    openReportModal,
    closeReportModal,
    handleCopyEmail,
    handleReportIssue,
  };
}

