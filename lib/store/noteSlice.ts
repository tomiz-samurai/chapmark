import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../types';

export interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    // ノートデータの読み込み開始
    fetchNotesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // ノートデータの読み込み成功
    fetchNotesSuccess: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      state.loading = false;
    },
    
    // ノートデータの読み込み失敗
    fetchNotesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // ノートの追加
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date();
      const newNote: Note = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      state.notes.push(newNote);
    },
    
    // ノートの更新
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>> }>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = { 
          ...state.notes[index], 
          ...action.payload.updates,
          updatedAt: new Date()
        };
      }
    },
    
    // ノートの削除
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    
    // タグの追加
    addTagToNote: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        const note = state.notes[index];
        // タグが未設定の場合は新しい配列を作成
        const tags = note.tags || [];
        // タグが既に存在しない場合のみ追加
        if (!tags.includes(action.payload.tag)) {
          state.notes[index] = {
            ...note,
            tags: [...tags, action.payload.tag],
            updatedAt: new Date()
          };
        }
      }
    },
    
    // タグの削除
    removeTagFromNote: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        const note = state.notes[index];
        if (note.tags) {
          state.notes[index] = {
            ...note,
            tags: note.tags.filter(tag => tag !== action.payload.tag),
            updatedAt: new Date()
          };
        }
      }
    },
    
    // 特定の書籍に関連するノートを取得
    getNotesByBookId: (state, action: PayloadAction<string>) => {
      // このアクションはセレクターで処理するため、状態の変更は不要
      // 必要に応じてローディング状態を設定することも可能
    }
  }
});

export const {
  fetchNotesStart,
  fetchNotesSuccess,
  fetchNotesFailure,
  addNote,
  updateNote,
  removeNote,
  addTagToNote,
  removeTagFromNote,
  getNotesByBookId
} = noteSlice.actions;

export default noteSlice.reducer; 