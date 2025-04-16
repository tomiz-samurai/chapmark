/**
 * モデル型定義の一元化されたエクスポート
 */

export * from './book';
export * from './note';
export * from './quote';
export * from './session';
export * from './timer';

/**
 * ユーザー情報
 */
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

/**
 * プロフィール統計情報
 */
export interface ProfileStats {
  booksCompleted: number;
  readingTime: number; // 分単位
  currentlyReading: number;
} 