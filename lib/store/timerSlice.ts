import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimerState {
  isRunning: boolean;
  startTime: string | null; // ISO文字列形式で保存
  pausedTime: number; // 一時停止中の累積秒数
  displaySeconds: number; // 表示用の累積秒数
  lastActiveTime: string | null; // 最後にアクティブだった時間（ISO文字列）
  activeBook: string | null; // 現在読書中の本のID
  startPage: number | null; // 読み始めのページ
}

const initialState: TimerState = {
  isRunning: false,
  startTime: null,
  pausedTime: 0,
  displaySeconds: 0,
  lastActiveTime: null,
  activeBook: null,
  startPage: null
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    // タイマーの開始
    startTimer: (state, action: PayloadAction<{ bookId: string; currentPage?: number }>) => {
      const now = new Date().toISOString();
      state.isRunning = true;
      state.startTime = now;
      state.lastActiveTime = now;
      state.activeBook = action.payload.bookId;
      if (action.payload.currentPage !== undefined) {
        state.startPage = action.payload.currentPage;
      }
    },

    // タイマーの一時停止
    pauseTimer: (state) => {
      if (state.isRunning && state.startTime) {
        const startTime = new Date(state.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        state.isRunning = false;
        state.pausedTime += elapsed;
        state.startTime = null;
        state.lastActiveTime = new Date().toISOString();
      }
    },

    // タイマーの再開
    resumeTimer: (state) => {
      if (!state.isRunning) {
        state.isRunning = true;
        state.startTime = new Date().toISOString();
        state.lastActiveTime = state.startTime;
      }
    },

    // タイマーの更新（手動または自動で表示を更新）
    updateTimer: (state) => {
      if (state.isRunning && state.startTime) {
        const startTime = new Date(state.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        state.displaySeconds = state.pausedTime + elapsed;
        state.lastActiveTime = new Date().toISOString();
      }
    },

    // タイマーのリセット
    resetTimer: (state) => {
      state.isRunning = false;
      state.startTime = null;
      state.pausedTime = 0;
      state.displaySeconds = 0;
      state.activeBook = null;
      state.startPage = null;
    },

    // アプリがバックグラウンドから戻ったときに時間を再計算
    syncTimerFromBackground: (state) => {
      if (state.isRunning && state.startTime) {
        const startTime = new Date(state.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        state.displaySeconds = state.pausedTime + elapsed;
        state.lastActiveTime = new Date().toISOString();
      }
    },

    // 読書セッションの完了
    completeReadingSession: (state) => {
      // 一時的に表示を更新
      if (state.isRunning && state.startTime) {
        const startTime = new Date(state.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        state.displaySeconds = state.pausedTime + elapsed;
      }
      
      // タイマーを停止するが、情報は保持する（モーダル表示用）
      state.isRunning = false;
      state.startTime = null;
    },
    
    // 読書セッション完了後のリセット
    finishSession: (state) => {
      return initialState;
    }
  },
});

export const {
  startTimer,
  pauseTimer,
  resumeTimer,
  updateTimer,
  resetTimer,
  syncTimerFromBackground,
  completeReadingSession,
  finishSession
} = timerSlice.actions;

export default timerSlice.reducer; 