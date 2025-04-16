/**
 * ノート（メモ）
 */
export interface Note {
  id: string;
  bookId: string;
  content: string; // メモ内容
  pageNumber?: number; // ページ番号
  chapter?: string; // 章の情報
  createdAt: Date | string;
  updatedAt: Date | string;
  tags?: string[]; // タグ情報
  userId?: string; // 作成者ID
}

/**
 * ノート作成用インターフェース
 */
export interface CreateNoteInput {
  bookId: string;
  content: string;
  pageNumber?: number;
  chapter?: string;
  tags?: string[];
}

/**
 * ノート更新用インターフェース
 */
export interface UpdateNoteInput {
  content?: string;
  pageNumber?: number;
  chapter?: string;
  tags?: string[];
} 