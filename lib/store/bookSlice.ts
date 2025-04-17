import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Book, BookStatus } from '../../types/models/book';
import * as BookService from '../services/BookService';
import { RootState } from '../store';

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

// 型安全なBookStatus変換関数
const toBookStatus = (status: any): BookStatus => {
  const valid: BookStatus[] = ['reading', 'completed', 'planned', 'on-hold', 'dropped', 'all'];
  return valid.includes(status) ? status : 'planned';
};

// 非同期Thunk: 全ての本を取得
export const fetchAllBooksAsync = createAsyncThunk<Book[], void, { rejectValue: string }>(
  'book/fetchAllBooks',
  async (_, { rejectWithValue }) => {
    try {
      const books = BookService.getAllBooks();
      // BookServiceのBook型をmodelsのBook型に変換（必要なら）
      return books.map((book) => ({
        ...book,
        status: toBookStatus(book.status || 'planned')
      }));
    } catch (error: any) {
      return rejectWithValue(error?.message || '本の取得に失敗しました');
    }
  }
);

// 非同期Thunk: 本を本棚に追加
export const addBookToLibraryAsync = createAsyncThunk<Book, { book: Book; status?: BookStatus }, { rejectValue: string }>(
  'book/addBookToLibrary',
  async ({ book, status }, { rejectWithValue }) => {
    try {
      // statusが'all'の場合は'planned'に変換
      const safeStatus = (!status || status === 'all') ? 'planned' : status;
      const bookForService = {
        ...book,
        status: safeStatus
      };
      const addedBook = BookService.addBookToLibrary(bookForService, safeStatus);
      return {
        ...addedBook,
        status: toBookStatus(addedBook.status || 'planned')
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || '本の追加に失敗しました');
    }
  }
);

// 非同期Thunk: 本のステータスを更新
export const updateBookStatusAsync = createAsyncThunk<Book | undefined, { id: string; status: BookStatus }, { rejectValue: string }>(
  'book/updateBookStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // statusが'all'の場合は'planned'に変換
      const safeStatus = (!status || status === 'all') ? 'planned' : status;
      const updatedBook = BookService.updateBookStatus(id, safeStatus);
      if (!updatedBook) {
        return rejectWithValue('本のステータス更新に失敗しました');
      }
      return {
        ...updatedBook,
        status: toBookStatus(updatedBook.status || 'planned')
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || '本のステータス更新に失敗しました');
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBooksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooksAsync.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllBooksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '本の取得に失敗しました';
      })
      .addCase(addBookToLibraryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookToLibraryAsync.fulfilled, (state, action: PayloadAction<Book>) => {
        // 既存の本があれば更新、なければ追加
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        } else {
          state.books.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(addBookToLibraryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '本の追加に失敗しました';
      })
      .addCase(updateBookStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookStatusAsync.fulfilled, (state, action: PayloadAction<Book | undefined>) => {
        if (action.payload) {
          const index = state.books.findIndex(book => book.id === action.payload!.id);
          if (index !== -1) {
            state.books[index] = action.payload;
          }
        }
        state.loading = false;
      })
      .addCase(updateBookStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '本のステータス更新に失敗しました';
      });
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

// ステータス別書籍取得用セレクタ
export const selectBooksByStatus = (state: RootState, status: BookStatus) =>
  state.book.books.filter(book => book.status === status); 