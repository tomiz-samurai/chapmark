import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../../constants/theme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  isLabelTranslationKey?: boolean;
  isErrorTranslationKey?: boolean;
  isHelperTranslationKey?: boolean;
}

export function Input({ 
  label, 
  error, 
  helper, 
  style, 
  isLabelTranslationKey = false,
  isErrorTranslationKey = false,
  isHelperTranslationKey = false,
  ...props 
}: InputProps) {
  const { t } = useAppTranslation();

  const displayLabel = label && isLabelTranslationKey ? t(label) : label;
  const displayError = error && isErrorTranslationKey ? t(error) : error;
  const displayHelper = helper && isHelperTranslationKey ? t(helper) : helper;

  return (
    <View style={styles.container}>
      {displayLabel && <Text style={styles.label}>{displayLabel}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.gray[400]}
        {...props}
      />
      {(displayError || displayHelper) && (
        <Text style={[styles.helperText, displayError && styles.errorText]}>
          {displayError || displayHelper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray[800],
  },
  inputError: {
    borderColor: colors.accent.dark,
  },
  helperText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.accent.dark,
  },
});