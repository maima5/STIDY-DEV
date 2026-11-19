import { UserProfile, ProfileStats, ProfileSettings } from '@/types/profile';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_001',
  name: 'Budi Santoso',
  role: 'Pelajar produktif',
  email: 'budi@student.ac.id',
  avatarLetter: 'B',
  avatarUri: null,
};

export const INITIAL_PROFILE_STATS: ProfileStats = {
  focusHours: 15.5,
  completedSessions: 12,
  activeDays: 7,
};

export const INITIAL_PROFILE_SETTINGS: ProfileSettings = {
  notifications: false,
};

export const APP_VERSION_LABEL = 'S-Tidy versi 1.0.0';
