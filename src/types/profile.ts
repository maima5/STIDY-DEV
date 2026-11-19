export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarLetter: string;
  avatarUri?: string | null;
}

export interface ProfileStats {
  focusHours: number;
  completedSessions: number;
  activeDays: number;
}

export interface ProfileSettings {
  notifications: boolean;
}

export type ProfileMenuItemType = 'navigation' | 'toggle';

export interface ProfileMenuItemData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  type?: ProfileMenuItemType;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (val: boolean) => void;
}

export interface PersonalInfoFormData {
  name: string;
  role: string;
  email: string;
  avatarUri?: string | null;
}

export interface PersonalInfoFormErrors {
  name?: string;
  email?: string;
  general?: string;
}
