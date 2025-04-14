import { View, StyleSheet, ViewProps, Image, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows, spacing, typography } from '../constants/theme';
import { Typography } from './Typography';
import { useAppTranslation } from '../hooks/useAppTranslation';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  title: string;
  subtitle?: string;
  coverImage?: string;
  onPress?: () => void;
  isTitleTranslationKey?: boolean;
  isSubtitleTranslationKey?: boolean;
}

export function Card({ 
  style, 
  variant = 'default', 
  title,
  subtitle,
  coverImage,
  onPress,
  isTitleTranslationKey = false,
  isSubtitleTranslationKey = false,
  ...props 
}: CardProps) {
  const CardContainer = onPress ? TouchableOpacity : View;
  const { t } = useAppTranslation();
  
  const displayTitle = isTitleTranslationKey ? t(title) : title;
  const displaySubtitle = subtitle && isSubtitleTranslationKey ? t(subtitle) : subtitle;
  
  return (
    <CardContainer 
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
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
              {t('common.noCover')}
            </Typography>
          </View>
        )}
        <View style={styles.textContainer}>
          <Typography variant="title" numberOfLines={2} style={styles.title}>
            {displayTitle}
          </Typography>
          {displaySubtitle && (
            <Typography variant="caption" color={colors.gray[600]} numberOfLines={1}>
              {displaySubtitle}
            </Typography>
          )}
        </View>
      </View>
    </CardContainer>
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