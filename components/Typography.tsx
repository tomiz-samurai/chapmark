import { Text, StyleSheet, TextProps } from 'react-native';
import { colors, typography } from '../constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'title' | 'body' | 'caption';
  color?: string;
}

export function Typography({ 
  style, 
  variant = 'body',
  color = colors.gray[800],
  ...props 
}: TypographyProps) {
  return (
    <Text 
      style={[
        styles.base,
        styles[variant],
        { color },
        style
      ]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.regular,
  },
  display: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
  },
  body: {
    fontSize: typography.fontSize.md,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
});