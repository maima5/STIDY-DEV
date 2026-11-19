import React from 'react';
import { StyleSheet, Text, View, Pressable, Switch, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { ProfileMenuItemData } from '@/types/profile';

interface ProfileMenuItemProps {
  item: ProfileMenuItemData;
  isLast?: boolean;
}

export default function ProfileMenuItem({ item, isLast = false }: ProfileMenuItemProps) {
  const isToggle = item.type === 'toggle';

  const renderIcon = () => {
    switch (item.icon) {
      case 'user':
        return <Feather name="user" size={19} color={ProfileColors.primary} />;
      case 'bell':
        return <Feather name="bell" size={19} color={ProfileColors.primary} />;
      case 'lock':
        return <Feather name="lock" size={19} color={ProfileColors.primary} />;
      case 'help-circle':
        return <Feather name="help-circle" size={19} color={ProfileColors.primary} />;
      default:
        return <Feather name="circle" size={19} color={ProfileColors.primary} />;
    }
  };

  const content = (
    <View style={[styles.container, !isLast && styles.bottomBorder]}>
      <View style={styles.leftCol}>
        <View style={styles.iconBadge}>{renderIcon()}</View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        {isToggle ? (
          <Switch
            value={item.value ?? false}
            onValueChange={item.onToggle}
            trackColor={{
              false: ProfileColors.switchTrackOff,
              true: ProfileColors.primary,
            }}
            thumbColor={ProfileColors.switchThumb}
            ios_backgroundColor={ProfileColors.switchTrackOff}
            style={Platform.select({
              android: { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] },
            })}
          />
        ) : (
          <Feather name="chevron-right" size={18} color={ProfileColors.chevron} />
        )}
      </View>
    </View>
  );

  if (isToggle) {
    return <View>{content}</View>;
  }

  return (
    <Pressable
      onPress={item.onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ProfileColors.divider,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  iconBadge: {
    width: ProfileLayout.iconBadgeSize,
    height: ProfileLayout.iconBadgeSize,
    borderRadius: 14,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 12,
    color: ProfileColors.textMuted,
    marginTop: 2.5,
  },
  rightCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: '#F8FAFC',
  },
});

