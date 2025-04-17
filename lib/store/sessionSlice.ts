import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReadingSession } from '../../types/models/session';
import { CreateSessionInput } from '../../types/models/session';

export interface SessionState {
  sessions: ReadingSession[];
  currentSession: ReadingSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // セッションデータの読み込み開始
    fetchSessionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // セッションデータの読み込み成功
    fetchSessionsSuccess: (state, action: PayloadAction<ReadingSession[]>) => {
      state.sessions = action.payload;
      state.loading = false;
    },
    
    // セッションデータの読み込み失敗
    fetchSessionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 新しい読書セッションの開始
    startSession: (state, action: PayloadAction<CreateSessionInput>) => {
      const newSession: ReadingSession = {
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
        duration: 0
      };
      state.currentSession = newSession;
    },
    
    // 読書セッションの更新
    updateCurrentSession: (state, action: PayloadAction<Partial<ReadingSession>>) => {
      if (state.currentSession) {
        state.currentSession = {
          ...state.currentSession,
          ...action.payload
        };
      }
    },
    
    // 読書セッションの完了
    completeSession: (state, action: PayloadAction<{ endTime: Date; endPage?: number }>) => {
      if (state.currentSession) {
        const completedSession: ReadingSession = {
          ...state.currentSession,
          endTime: action.payload.endTime,
          completed: true
        };
        
        if (action.payload.endPage !== undefined) {
          completedSession.endPage = action.payload.endPage;
        }
        
        // セッションリストに追加
        state.sessions.push(completedSession);
        // 現在のセッションを保持（モーダル表示用）
        state.currentSession = completedSession;
      }
    },
    
    // 完了したセッションの保存後の処理
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    
    // セッションの削除
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
    }
  }
});

export const {
  fetchSessionsStart,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  startSession,
  updateCurrentSession,
  completeSession,
  clearCurrentSession,
  removeSession
} = sessionSlice.actions;

export default sessionSlice.reducer; 