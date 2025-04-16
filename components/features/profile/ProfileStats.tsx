import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';

interface ProfileStatsProps {
  booksCompleted: number;
  readingTime: number; // 分単位
  currentlyReading: number;
  t: (key: string) => string;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  booksCompleted,
  readingTime,
  currentlyReading,
  t,
}) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{booksCompleted}</Text>
        <Text style={styles.statLabel}>{t('profile.stats.booksCompleted')}</Text>
      </View>
      <View style={[styles.statItem, styles.statBorder]}>
        <Text style={styles.statValue}>{readingTime}</Text>
        <Text style={styles.statLabel}>{t('profile.stats.readingTime')}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{currentlyReading}</Text>
        <Text style={styles.statLabel}>{t('profile.stats.currentlyReading')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginTop: -spacing.lg,
    marginHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.gray[200],
  },
  statValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.primary.main,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
}); 