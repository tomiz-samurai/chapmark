import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import timerReducer from './timerSlice';
import bookReducer from './bookSlice';
import sessionReducer from './sessionSlice';
import quoteReducer from './quoteSlice';
import noteReducer from './noteSlice';
import { TimerState } from '../../types/models';
import { BookState } from './bookSlice';
import { SessionState } from './sessionSlice';
import { QuoteState } from './quoteSlice';
import { NoteState } from './noteSlice';
import { ServiceContainer } from '../di/ServiceContainer';

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

// 仮のstoreを先に生成
const tempStore = configureStore({
  reducer: persistedReducer,
});
// ServiceContainerをstore生成後に初期化
export const serviceContainer = new ServiceContainer(tempStore);

export interface ExtraArgument {
  serviceContainer: ServiceContainer;
}

// storeをextraArgument付きで再生成
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 永続化のためのnon-serializable値の警告を無視
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: {
        extraArgument: { serviceContainer },
      },
    }),
});

export const persistor = persistStore(store);

// RTK Queryを使用する場合のリスナーをセットアップ
setupListeners(store.dispatch);

// RootState型とAppDispatch型をエクスポート
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 