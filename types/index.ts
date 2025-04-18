/**
 * アプリケーション全体の型定義をエクスポート
 */

// モデル型
export * from './models';

// ストア関連の型
// export * from './store';

// コンポーネント関連の型（将来的に追加）
// export * from './components';

// その他の共通型（将来的に追加）
// export * from './common';

// types/dto/BookDTO.ts
export type BookCreateRequest = {
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
};

export type BookResponse = {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
};

// types/dto/index.ts
export * from './dto'; 