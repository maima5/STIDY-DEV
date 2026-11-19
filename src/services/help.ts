import { FaqItem, SupportInfo, IssueReportData } from '@/types/help';
import { INITIAL_FAQS, SUPPORT_INFO } from '@/constants/help-data';

/**
 * Service to fetch FAQ list
 */
export async function fetchFaqs(): Promise<FaqItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...INITIAL_FAQS];
}

/**
 * Service to search FAQs by keyword
 */
export async function searchFaqs(query: string): Promise<FaqItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [...INITIAL_FAQS];

  return INITIAL_FAQS.filter(
    (item) =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
  );
}

/**
 * Service to fetch support contact details
 */
export async function fetchSupportInfo(): Promise<SupportInfo> {
  return { ...SUPPORT_INFO };
}

/**
 * Service to submit a technical issue report
 */
export async function submitIssueReport(
  data: IssueReportData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    success: true,
    message: 'Laporan kendala teknis Anda telah terkirim ke tim pengembang.',
  };
}

