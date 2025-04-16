/**
 * 引用投稿
 */
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

/**
 * 引用投稿の作成用インターフェース
 */
export interface CreateQuoteInput {
  bookId: string;
  text: string;
  insight?: string;
  pageNumber?: number;
  chapter?: string;
  isPublic?: boolean;
  tags?: string[];
} 