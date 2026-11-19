import { PasswordChangeFormData, SecurityPreferences } from '@/types/security';
import { INITIAL_SECURITY_PREFERENCES } from '@/constants/security-data';

/**
 * Service to change the user's password.
 * Prepared for backend integration (Supabase / REST API).
 */
export async function changePassword(
  data: PasswordChangeFormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    message: 'Kata sandi berhasil diperbarui.',
  };
}

/**
 * Service to fetch user security & privacy preferences
 */
export async function fetchSecurityPreferences(): Promise<SecurityPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { ...INITIAL_SECURITY_PREFERENCES };
}

/**
 * Service to update user security & privacy preferences
 */
export async function updateSecurityPreferences(
  prefs: Partial<SecurityPreferences>
): Promise<{ success: boolean; data: SecurityPreferences }> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    success: true,
    data: {
      ...INITIAL_SECURITY_PREFERENCES,
      ...prefs,
    },
  };
}

