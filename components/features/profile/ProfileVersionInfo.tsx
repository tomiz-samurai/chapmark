import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../constants/theme';

interface ProfileVersionInfoProps {
  version: string;
}

export const ProfileVersionInfo: React.FC<ProfileVersionInfoProps> = ({ version }) => {
  return (
    <View style={styles.versionInfo}>
      <Text style={styles.versionText}>{version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  versionInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  versionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
}); 