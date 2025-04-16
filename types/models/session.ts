/**
 * 読書セッション情報
 */
export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: Date | string;
  endTime?: Date | string;
  duration: number; // 秒単位
  completed: boolean;
  startPage?: number;
  endPage?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * 読書セッション作成用のインターフェース
 */
export interface CreateSessionInput {
  bookId: string;
  startTime: Date | string;
  startPage?: number;
}

/**
 * 読書セッション完了用のインターフェース
 */
export interface CompleteSessionInput {
  endTime: Date | string;
  endPage?: number;
  duration?: number;
} 