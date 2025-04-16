/**
 * 書籍の状態を表す型
 */
export type BookStatus = 'reading' | 'completed' | 'planned' | 'on-hold' | 'dropped';

/**
 * 書籍モデルのインターフェース
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  // 表示用
  coverImage?: string;
  coverUrl?: string;
  // ページ情報
  totalPages?: number;
  currentPage?: number;
  // 日付情報
  startDate?: Date | string;
  finishDate?: Date | string;
  // 追加情報
  rating?: number;
  genre?: string[];
  isbn?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  description?: string;
  category?: string[];
} 