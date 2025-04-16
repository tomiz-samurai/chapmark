import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book, BookStatus } from '../../types/models/book';

export interface BookState {
  books: Book[];
  selectedBookId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  selectedBookId: null,
  loading: false,
  error: null
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    // 書籍データの読み込み開始
    fetchBooksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // 書籍データの読み込み成功
    fetchBooksSuccess: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
      state.loading = false;
    },
    
    // 書籍データの読み込み失敗
    fetchBooksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 現在選択中の書籍を設定
    selectBook: (state, action: PayloadAction<string>) => {
      state.selectedBookId = action.payload;
    },
    
    // 書籍の追加
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    
    // 書籍情報の更新
    updateBook: (state, action: PayloadAction<{ id: string; updates: Partial<Book> }>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = { ...state.books[index], ...action.payload.updates };
      }
    },
    
    // 現在のページの更新
    updateCurrentPage: (state, action: PayloadAction<{ id: string; page: number }>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index].currentPage = action.payload.page;
      }
    },
    
    // 総ページ数の更新
    updateTotalPages: (state, action: PayloadAction<{ id: string; pages: number }>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index].totalPages = action.payload.pages;
      }
    },
    
    // 読書状態の更新
    updateBookStatus: (state, action: PayloadAction<{ id: string; status: Book['status'] }>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index].status = action.payload.status;
      }
    },
    
    // 書籍の削除
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book.id !== action.payload);
      if (state.selectedBookId === action.payload) {
        state.selectedBookId = null;
      }
    }
  }
});

export const {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  selectBook,
  addBook,
  updateBook,
  updateCurrentPage,
  updateTotalPages,
  updateBookStatus,
  removeBook
} = bookSlice.actions;

export default bookSlice.reducer; 