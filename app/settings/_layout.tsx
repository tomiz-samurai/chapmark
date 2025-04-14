import { Stack } from 'expo-router';
import { colors, typography } from '../../constants/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          color: colors.gray[800],
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.fontSize.lg,
        },
        headerTintColor: colors.gray[700],
        headerBackVisible: true,
        headerLeft: undefined,
      }}
    />
  );
} 