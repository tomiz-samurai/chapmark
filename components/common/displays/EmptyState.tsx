import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../constants/theme';
import { Button } from '../buttons/Button';
import { useAppTranslation } from '../../../hooks/useAppTranslation';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  isTitleTranslationKey?: boolean;
  isMessageTranslationKey?: boolean;
  isActionLabelTranslationKey?: boolean;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
  isTitleTranslationKey = false,
  isMessageTranslationKey = false,
  isActionLabelTranslationKey = false,
}: EmptyStateProps) {
  const { t } = useAppTranslation();

  const displayTitle = isTitleTranslationKey ? t(title) : title;
  const displayMessage = isMessageTranslationKey ? t(message) : message;
  const displayActionLabel = actionLabel && isActionLabelTranslationKey ? t(actionLabel) : actionLabel || '';

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{displayMessage}</Text>
      {actionLabel && onAction && (
        <Button
          title={displayActionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.button}
          isTranslationKey={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.gray[800],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 200,
  },
});