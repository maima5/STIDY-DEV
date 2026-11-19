import { UserProfile, ProfileStats, ProfileSettings } from '@/types/profile';
import {
  INITIAL_USER_PROFILE,
  INITIAL_PROFILE_STATS,
  INITIAL_PROFILE_SETTINGS,
} from '@/constants/profile-data';

/**
 * Service for fetching user profile and related statistics.
 * Prepared for backend integration (Supabase / REST API).
 */
export async function fetchUserProfile(): Promise<{
  profile: UserProfile;
  stats: ProfileStats;
  settings: ProfileSettings;
}> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    profile: { ...INITIAL_USER_PROFILE },
    stats: { ...INITIAL_PROFILE_STATS },
    settings: { ...INITIAL_PROFILE_SETTINGS },
  };
}

/**
 * Service to update user profile information
 */
export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    ...INITIAL_USER_PROFILE,
    ...updates,
  };
}

/**
 * Service to update personal information (name, email, avatarUri)
 */
export async function updatePersonalInfo(data: {
  name: string;
  email: string;
  avatarUri?: string | null;
}): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const avatarLetter = data.name.trim().charAt(0).toUpperCase() || 'B';
  return {
    ...INITIAL_USER_PROFILE,
    name: data.name.trim(),
    email: data.email.trim(),
    avatarLetter,
    avatarUri: data.avatarUri !== undefined ? data.avatarUri : INITIAL_USER_PROFILE.avatarUri,
  };
}

/**
 * Service to update user avatar photo
 */
export async function updateUserAvatar(
  avatarUri: string | null
): Promise<{ success: boolean; avatarUri: string | null }> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return { success: true, avatarUri };
}

/**
 * Service to update user notification preferences
 */
export async function updateNotificationSetting(
  enabled: boolean
): Promise<{ success: boolean; enabled: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { success: true, enabled };
}

/**
 * Service to sign out the user
 */
export async function logoutUser(): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true };
}
