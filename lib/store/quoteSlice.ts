import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quote } from '../types';

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  quotes: [],
  loading: false,
  error: null
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    // 引用データの読み込み開始
    fetchQuotesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // 引用データの読み込み成功
    fetchQuotesSuccess: (state, action: PayloadAction<Quote[]>) => {
      state.quotes = action.payload;
      state.loading = false;
    },
    
    // 引用データの読み込み失敗
    fetchQuotesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 引用の追加
    addQuote: (state, action: PayloadAction<Omit<Quote, 'id' | 'createdAt'>>) => {
      const newQuote: Quote = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      state.quotes.push(newQuote);
    },
    
    // 引用の更新
    updateQuote: (state, action: PayloadAction<{ id: string; updates: Partial<Quote> }>) => {
      const index = state.quotes.findIndex(quote => quote.id === action.payload.id);
      if (index !== -1) {
        state.quotes[index] = { 
          ...state.quotes[index], 
          ...action.payload.updates 
        };
      }
    },
    
    // 引用の削除
    removeQuote: (state, action: PayloadAction<string>) => {
      state.quotes = state.quotes.filter(quote => quote.id !== action.payload);
    },
    
    // 特定の書籍に関連する引用を取得
    getQuotesByBookId: (state, action: PayloadAction<string>) => {
      // このアクションはセレクターで処理するため、状態の変更は不要
      // 必要に応じてローディング状態を設定することも可能
    }
  }
});

export const {
  fetchQuotesStart,
  fetchQuotesSuccess,
  fetchQuotesFailure,
  addQuote,
  updateQuote,
  removeQuote,
  getQuotesByBookId
} = quoteSlice.actions;

export default quoteSlice.reducer; 