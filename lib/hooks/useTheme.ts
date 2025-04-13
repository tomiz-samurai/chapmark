import { useColorScheme } from 'react-native';

// カラーテーマ定義（新しいブランドカラーパレット）
const lightColors = {
  // プライマリカラー
  primary: '#343a40', // プレミアムダークグラデーション
  primaryDark: '#212529', // プレミアムダークグラデーション（濃い）
  primaryLight: '#495057', // ダークグレー（セカンダリカラー）
  
  // ゴールド系
  secondary: '#ffd43b', // プレミアムゴールド
  secondaryLight: '#ffe066', // ライトゴールド
  secondaryDark: '#e6b400', // ダークゴールド
  
  // グレー系
  neutral: '#adb5bd', // プレミアムグレー
  neutralLight: '#f8f9fa', // バックグラウンド
  neutralDark: '#6c757d', // ミディアムグレー
  
  // UI要素カラー
  background: '#f8f9fa', // バックグラウンド
  card: '#ffffff',
  text: '#212529', // プレミアムダークグラデーション（濃い）
  textSecondary: '#495057', // ダークグレー
  border: '#adb5bd', // プレミアムグレー
  
  // 機能カラー
  error: '#dc3545', // アラート
  warning: '#ffd43b', // プレミアムゴールド
  success: '#6c757d', // ミディアムグレー
  info: '#343a40' // プレミアムダークグラデーション
};

// ダークモード用カラーテーマ定義
const darkColors = {
  // プライマリカラー
  primary: '#212529', // プレミアムダークグラデーション（濃い）
  primaryDark: '#000000',
  primaryLight: '#343a40', // プレミアムダークグラデーション
  
  // ゴールド系
  secondary: '#ffd43b', // プレミアムゴールド
  secondaryLight: '#ffe066', // ライトゴールド
  secondaryDark: '#e6b400', // ダークゴールド
  
  // グレー系
  neutral: '#adb5bd', // プレミアムグレー
  neutralLight: '#6c757d', // ミディアムグレー
  neutralDark: '#495057', // ダークグレー
  
  // UI要素カラー
  background: '#212529', // プレミアムダークグラデーション（濃い）
  card: '#343a40', // プレミアムダークグラデーション
  text: '#f8f9fa', // バックグラウンド
  textSecondary: '#adb5bd', // プレミアムグレー
  border: '#495057', // ダークグレー
  
  // 機能カラー
  error: '#dc3545', // アラート
  warning: '#ffd43b', // プレミアムゴールド
  success: '#6c757d', // ミディアムグレー
  info: '#adb5bd' // プレミアムグレー
};

// スペーシング定義
const spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48
};

// タイポグラフィ定義
const typography = {
  sizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

/**
 * アプリケーションのテーマ設定を提供するフック
 * @returns テーマオブジェクト
 */
export const useTheme = () => {
  // システムの色設定を取得
  const colorScheme = useColorScheme();
  
  // 現在の色テーマを決定（システム設定に基づく）
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  
  return {
    colors,
    spacing,
    typography,
    isDark: colorScheme === 'dark'
  };
};

// テーマの型定義をエクスポート
export type ThemeColors = typeof lightColors;
export type ThemeSpacing = typeof spacing;
export type ThemeTypography = typeof typography; 