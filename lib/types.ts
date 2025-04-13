// 書籍の状態を表す型
export type BookStatus = 'reading' | 'completed' | 'planned' | 'all';

// 書籍の基本情報
export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  coverImage?: string;
}

// 読書セッション情報
export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 秒単位
  completed: boolean;
} 