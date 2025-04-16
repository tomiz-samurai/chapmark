import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '../../Typography';
import { colors, borderRadius, spacing } from '../../../constants/theme';

interface CategoryButtonProps {
  title: string;
  onPress?: () => void;
  isActive?: boolean;
  style?: any;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  title,
  onPress,
  isActive = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Typography
        variant="caption"
        color={isActive ? colors.white : colors.gray[700]}
        style={styles.text}
      >
        {title}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  activeContainer: {
    backgroundColor: colors.primary.main,
  },
  inactiveContainer: {
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  text: {
    textAlign: 'center',
  },
}); 