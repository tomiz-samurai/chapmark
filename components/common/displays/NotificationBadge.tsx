import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../../../components/Typography';
import { colors } from '../../../constants/theme';

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <View style={styles.badge}>
      <Typography
        variant="caption"
        color={colors.white}
        style={styles.count}>
        {count > 99 ? '99+' : count}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    backgroundColor: colors.accent.dark,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  count: {
    fontSize: 10,
    lineHeight: 12,
  },
});