import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';

export interface SettingItem {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void;
}

interface ProfileSettingsListProps {
  items: SettingItem[];
  sectionTitle?: string;
}

export const ProfileSettingsList: React.FC<ProfileSettingsListProps> = ({ items, sectionTitle }) => {
  return (
    <View style={styles.settingsSection}>
      {sectionTitle && <Text style={styles.sectionTitle}>{sectionTitle}</Text>}
      <View style={styles.settingsContent}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={item.onPress}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.iconWrapper}>
                <Feather name={item.icon} size={18} color={colors.primary.main} />
              </View>
              <Text style={styles.settingTitle}>{item.title}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingsContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  settingTitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.gray[800],
  },
}); 