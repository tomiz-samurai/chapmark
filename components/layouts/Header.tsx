import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { Typography } from '../Typography';
import { NotificationBadge } from '../common';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
  isTitleTranslationKey?: boolean;
  rightContent?: ReactNode;
}

export function Header({
  title,
  showBack = false,
  notificationCount = 0,
  onNotificationPress,
  isTitleTranslationKey = false,
  rightContent,
}: HeaderProps) {
  const router = useRouter();
  const { t } = useAppTranslation();

  const displayTitle = isTitleTranslationKey ? t(title) : title;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}>
            <ArrowLeft size={24} color={colors.gray[700]} />
          </Pressable>
        )}
      </View>

      <Typography variant="title" style={styles.title}>
        {displayTitle}
      </Typography>

      <View style={styles.rightContainer}>
        {rightContent ? (
          rightContent
        ) : (
          onNotificationPress && (
            <Pressable
              onPress={onNotificationPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}>
              <Bell size={24} color={colors.gray[700]} />
              <NotificationBadge count={notificationCount} />
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? spacing.xl + spacing.lg : spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    flex: 2,
    textAlign: 'center',
    color: colors.gray[800],
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: spacing.sm,
  },
  iconButtonPressed: {
    backgroundColor: colors.gray[100],
  },
});