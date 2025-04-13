import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import timerReducer, { TimerState } from './timerSlice';
import bookReducer, { BookState } from './bookSlice';
import sessionReducer, { SessionState } from './sessionSlice';
import quoteReducer, { QuoteState } from './quoteSlice';
import noteReducer, { NoteState } from './noteSlice';

// persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // blacklist: [] // timerスライスをブラックリストに追加することも可能
};

// Reduxステートの型定義
export interface AppState {
  timer: TimerState;
  book: BookState;
  session: SessionState;
  quote: QuoteState;
  note: NoteState;
}

const rootReducer = combineReducers({
  timer: timerReducer,
  book: bookReducer,
  session: sessionReducer,
  quote: quoteReducer,
  note: noteReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 永続化のためのnon-serializable値の警告を無視
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// RTK Queryを使用する場合のリスナーをセットアップ
setupListeners(store.dispatch);

// RootState型とAppDispatch型をエクスポート
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 