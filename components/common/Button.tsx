import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  ActivityIndicator,
  StyleProp,
  ViewStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  isTranslationKey?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
  isTranslationKey = false,
}: ButtonProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  // バリアントに基づいてスタイルを取得
  const getVariantStyle = (isPressed: boolean) => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: isPressed ? colors.primaryDark : colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
          },
          text: { color: colors.text === colors.primaryDark ? '#ffffff' : colors.neutralLight },
          indicator: colors.text === colors.primaryDark ? '#ffffff' : colors.neutralLight,
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: isPressed ? colors.secondaryDark : colors.secondary,
            borderColor: colors.secondary,
            borderWidth: 1,
          },
          text: { color: colors.primary },
          indicator: colors.primary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: colors.border,
            borderWidth: 1,
          },
          text: { color: colors.text },
          indicator: colors.text,
        };
      case 'text':
        return {
          container: {
            backgroundColor: isPressed ? colors.background : 'transparent',
            borderColor: 'transparent',
            borderWidth: 1,
          },
          text: { color: colors.primary },
          indicator: colors.primary,
        };
      default:
        return {
          container: {},
          text: {},
          indicator: colors.text,
        };
    }
  };

  // サイズに基づいてスタイルを取得
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 12 },
          text: { fontSize: 12 },
          icon: 16,
        };
      case 'large':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 24 },
          text: { fontSize: 18 },
          icon: 24,
        };
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 16 },
          text: { fontSize: 16 },
          icon: 20,
        };
    }
  };

  // タイトルが翻訳キーかどうかをチェックし、適切に処理
  const buttonTitle = isTranslationKey ? t(title) : title;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getVariantStyle(pressed).container,
        getSizeStyle().container,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={getVariantStyle(false).indicator}
          size={getSizeStyle().icon}
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && (
            <Feather
              name={icon as any}
              size={getSizeStyle().icon}
              color={getVariantStyle(false).text.color as string}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.buttonText,
              getVariantStyle(false).text,
              getSizeStyle().text,
            ]}
          >
            {buttonTitle}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    marginRight: 8,
  }
});