import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TimerState, StartTimerParams } from '../../types/models';
import NotificationService from '../services/NotificationService';
import { updateBookStatusAsync } from './bookSlice';

const initialState: TimerState = {
  isRunning: false,
  startTime: null,
  pausedTime: 0,
  displaySeconds: 0,
  lastActiveTime: null,
  activeBook: null,
  startPage: null,
  goalTime: null,
  goalReached: false,
  isBackgroundActive: false,
  lastBackgroundTimestamp: null
};

// 目標達成通知を送るThunk
export const notifyGoalReachedAsync = createAsyncThunk<void, { bookTitle: string }, { rejectValue: string }>(
  'timer/notifyGoalReached',
  async ({ bookTitle }, { rejectWithValue }) => {
    try {
      await NotificationService.showGoalNotification(bookTitle);
    } catch (error: any) {
      return rejectWithValue(error?.message || '通知の送信に失敗しました');
    }
  }
);

// 非同期Thunk: 読書セッションの完了（副作用含む）
export const completeReadingSessionAsync = createAsyncThunk<
  void,
  { bookId: string; bookTitle: string; currentPage?: number; totalPages?: number },
  { rejectValue: string }
>(
  'timer/completeReadingSessionAsync',
  async ({ bookId, bookTitle, currentPage, totalPages }, { dispatch, rejectWithValue }) => {
    try {
      // 1. 本の進捗・ステータス更新
      if (bookId) {
        await dispatch(updateBookStatusAsync({ id: bookId, status: 'completed' })).unwrap();
        if (typeof currentPage === 'number') {
          dispatch({ type: 'book/updateCurrentPage', payload: { id: bookId, page: currentPage } });
        }
        if (typeof totalPages === 'number') {
          dispatch({ type: 'book/updateTotalPages', payload: { id: bookId, pages: totalPages } });
        }
      }
      // 2. 通知
      await dispatch(notifyGoalReachedAsync({ bookTitle })).unwrap();
      // 3. タイマー停止
      dispatch(completeReadingSession());
    } catch (error: any) {
      return rejectWithValue(error?.message || '読書セッションの完了に失敗しました');
    }
  }
);

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    // タイマーの開始
    startTimer: (state, action: PayloadAction<StartTimerParams>) => {
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
      state.goalTime = null;
      state.goalReached = false;
      state.isBackgroundActive = false;
      state.lastBackgroundTimestamp = null;
    },

    // アプリがバックグラウンドから戻ったときに時間を再計算
    syncTimerFromBackground: (state) => {
      if (state.isRunning && state.startTime) {
        const startTime = new Date(state.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        state.displaySeconds = state.pausedTime + elapsed;
        state.lastActiveTime = new Date().toISOString();
        
        // バックグラウンド状態をリセット
        state.isBackgroundActive = false;
        state.lastBackgroundTimestamp = null;
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
    },
    
    // 目標時間の設定
    setGoalTime: (state, action: PayloadAction<number>) => {
      state.goalTime = action.payload;
      state.goalReached = false;
    },
    
    // 目標時間到達フラグのセット
    setGoalReached: (state, action: PayloadAction<boolean>) => {
      state.goalReached = action.payload;
    },
    
    // バックグラウンド状態の設定
    setBackgroundActive: (state, action: PayloadAction<boolean>) => {
      state.isBackgroundActive = action.payload;
      
      if (action.payload) {
        // バックグラウンドに入った時刻を記録
        state.lastBackgroundTimestamp = new Date().toISOString();
      } else {
        // バックグラウンドから戻った場合はリセット
        state.lastBackgroundTimestamp = null;
      }
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
  finishSession,
  setGoalTime,
  setGoalReached,
  setBackgroundActive
} = timerSlice.actions;

export default timerSlice.reducer; 