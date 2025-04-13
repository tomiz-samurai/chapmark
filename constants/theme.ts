// デザイントークン定義
export const colors = {
  // プライマリーカラー
  primary: {
    dark: '#212529', // プレミアムダークグラデーション（濃い）
    main: '#343a40', // プレミアムダークグラデーション
    light: '#495057', // ダークグレー
  },
  // ゴールド系
  accent: {
    dark: '#e6b400', // ダークゴールド
    main: '#ffd43b', // プレミアムゴールド
    light: '#ffe066', // ライトゴールド
  },
  // グレースケール
  gray: {
    50: '#f8f9fa', // バックグラウンド
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd', // プレミアムグレー
    500: '#6c757d', // ミディアムグレー
    600: '#495057', // ダークグレー
    700: '#343a40', // プレミアムダークグラデーション
    800: '#212529', // プレミアムダークグラデーション（濃い）
  },
  // 機能カラー
  status: {
    error: '#dc3545', // アラート
    warning: '#ffd43b', // プレミアムゴールド
    success: '#6c757d', // ミディアムグレー
    info: '#343a40', // プレミアムダークグラデーション
  },
  // 基本色
  white: '#ffffff',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    semiBold: 'Inter_600SemiBold',
    display: 'PlayfairDisplay_700Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};