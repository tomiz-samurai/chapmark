/**
 * タイマー状態
 */
export interface TimerState {
  isRunning: boolean;
  startTime: string | null; // ISO文字列形式で保存
  pausedTime: number; // 一時停止中の累積秒数
  displaySeconds: number; // 表示用の累積秒数
  lastActiveTime: string | null; // 最後にアクティブだった時間（ISO文字列）
  activeBook: string | null; // 現在読書中の本のID
  startPage: number | null; // 読み始めのページ
  goalTime: number | null; // 目標時間（秒）
  goalReached: boolean; // 目標時間に到達したか
  isBackgroundActive: boolean; // バックグラウンドでアクティブかどうか
  lastBackgroundTimestamp: string | null; // バックグラウンドに入った時刻
}

/**
 * タイマー開始パラメータ
 */
export interface StartTimerParams {
  bookId: string;
  currentPage?: number;
}

/**
 * タイマー完了結果
 */
export interface TimerCompletionResult {
  duration: number;
  startPage: number | null;
  endPage: number | undefined;
} 