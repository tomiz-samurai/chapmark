import { View, StyleSheet, ViewProps, Image } from 'react-native';
import { colors, borderRadius, shadows, spacing, typography } from '../constants/theme';
import { Typography } from './Typography';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  title: string;
  subtitle?: string;
  coverImage?: string;
}

export function Card({ 
  style, 
  variant = 'default', 
  title,
  subtitle,
  coverImage,
  ...props 
}: CardProps) {
  return (
    <View 
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        style
      ]} 
      {...props}
    >
      <View style={styles.content}>
        {coverImage ? (
          <Image 
            source={{ uri: coverImage }} 
            style={styles.cover}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Typography variant="caption" color={colors.gray[400]}>
              No Cover
            </Typography>
          </View>
        )}
        <View style={styles.textContainer}>
          <Typography variant="title" numberOfLines={2} style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color={colors.gray[600]} numberOfLines={1}>
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  elevated: {
    ...shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  coverPlaceholder: {
    width: 60,
    height: 90,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
});