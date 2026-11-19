import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProfileStats, ProfileSettings } from '@/types/profile';
import { SecurityPreferences } from '@/types/security';
import {
  INITIAL_USER_PROFILE,
  INITIAL_PROFILE_STATS,
  INITIAL_PROFILE_SETTINGS,
} from '@/constants/profile-data';
import { INITIAL_SECURITY_PREFERENCES } from '@/constants/security-data';
import {
  fetchUserProfile,
  updateUserProfile as apiUpdateProfile,
  updateUserAvatar as apiUpdateAvatar,
  updateNotificationSetting as apiUpdateNotification,
  logoutUser as apiLogout,
} from '@/services/profile';
import {
  fetchSecurityPreferences,
  updateSecurityPreferences as apiUpdateSecurityPreferences,
} from '@/services/security';

interface ProfileContextType {
  profile: UserProfile;
  stats: ProfileStats;
  settings: ProfileSettings;
  securityPreferences: SecurityPreferences;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (avatarUri: string | null) => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  updateSecurityPreferences: (prefs: Partial<SecurityPreferences>) => Promise<void>;
  logout: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [stats, setStats] = useState<ProfileStats>(INITIAL_PROFILE_STATS);
  const [settings, setSettings] = useState<ProfileSettings>(INITIAL_PROFILE_SETTINGS);
  const [securityPreferences, setSecurityPreferences] = useState<SecurityPreferences>(
    INITIAL_SECURITY_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [profileData, secData] = await Promise.all([
          fetchUserProfile(),
          fetchSecurityPreferences(),
        ]);
        if (isMounted) {
          setProfile(profileData.profile);
          setStats(profileData.stats);
          setSettings(profileData.settings);
          setSecurityPreferences(secData);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    let avatarLetter = updates.avatarLetter || profile.avatarLetter;
    if (updates.name && updates.name.trim().length > 0) {
      avatarLetter = updates.name.trim().charAt(0).toUpperCase();
    }
    const mergedUpdates = { ...updates, avatarLetter };
    const updated = await apiUpdateProfile(mergedUpdates);
    setProfile(updated);
  };

  const updateAvatar = async (avatarUri: string | null) => {
    setProfile((prev) => ({ ...prev, avatarUri }));
    await apiUpdateAvatar(avatarUri);
    await apiUpdateProfile({ avatarUri });
  };

  const toggleNotifications = async (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, notifications: enabled }));
    try {
      await apiUpdateNotification(enabled);
    } catch {
      setSettings((prev) => ({ ...prev, notifications: !enabled }));
    }
  };

  const updateSecurityPreferences = async (prefs: Partial<SecurityPreferences>) => {
    setSecurityPreferences((prev) => ({ ...prev, ...prefs }));
    try {
      await apiUpdateSecurityPreferences(prefs);
    } catch (error) {
      console.error('Failed to update security preferences:', error);
    }
  };

  const logout = async () => {
    await apiLogout();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        stats,
        settings,
        securityPreferences,
        isLoading,
        updateProfile,
        updateAvatar,
        toggleNotifications,
        updateSecurityPreferences,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}
