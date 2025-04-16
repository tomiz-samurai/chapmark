import { Book } from '../../types/models/book';

export interface Quote {
  id: string;
  bookId: string;
  text: string; // 引用テキスト (最大200文字)
  insight?: string; // 感想/洞察 (最大150文字)
  pageNumber?: number; // ページ番号
  chapter?: string; // 章の情報
  createdAt: Date | string;
  updatedAt?: Date | string;
  isPublic: boolean; // 公開・非公開設定
  userId?: string; // 投稿者ID
  tags?: string[]; // タグ情報
}

// 書籍の情報を含む引用データ型
export interface QuoteWithBook extends Quote {
  book?: Book;
} 