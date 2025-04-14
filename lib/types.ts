// 書籍の状態を表す型
export type BookStatus = 'reading' | 'completed' | 'planned' | 'all';

// 書籍の基本情報
export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  coverImage?: string;
  coverUrl?: string;
  totalPages?: number;
  currentPage?: number;
}

// 読書セッション情報
export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 秒単位
  completed: boolean;
  startPage?: number;
  endPage?: number;
}

// 引用投稿
export interface Quote {
  id: string;
  bookId: string;
  text: string; // 引用テキスト (最大200文字)
  insight?: string; // 感想/洞察 (最大150文字)
  pageNumber?: number; // ページ番号
  chapter?: string; // 章の情報
  createdAt: Date;
  isPublic: boolean; // 公開・非公開設定
}

// ノート（メモ）
export interface Note {
  id: string;
  bookId: string;
  content: string; // メモ内容
  pageNumber?: number; // ページ番号
  createdAt: Date;
  updatedAt: Date;
  tags?: string[]; // タグ情報
} 