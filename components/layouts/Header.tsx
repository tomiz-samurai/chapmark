import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { Typography } from '../Typography';
import { NotificationBadge } from '../common/NotificationBadge';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export function Header({
  title,
  showBack = false,
  notificationCount = 0,
  onNotificationPress,
}: HeaderProps) {
  const router = useRouter();

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
        {title}
      </Typography>

      <View style={styles.rightContainer}>
        <Pressable
          onPress={onNotificationPress}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}>
          <Bell size={24} color={colors.gray[700]} />
          <NotificationBadge count={notificationCount} />
        </Pressable>
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