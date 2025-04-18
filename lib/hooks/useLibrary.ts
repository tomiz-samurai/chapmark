import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookStatus } from '../../types/models';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { fetchAllBooksAsync, addBookToLibraryAsync } from '../store/bookSlice';

// AsyncStorageのキー
const VIEW_MODE_STORAGE_KEY = 'chapmark_library_view_mode';
const SORT_OPTION_STORAGE_KEY = 'chapmark_library_sort_option';
const SORT_DIRECTION_STORAGE_KEY = 'chapmark_library_sort_direction';

// タブ定義
export const STATUS_TABS = [
  { label: 'books.filters.all', value: 'all' },
  { label: 'books.filters.reading', value: 'reading' },
  { label: 'books.filters.completed', value: 'completed' },
  { label: '読みたい本', value: 'planned' },
  { label: 'books.filters.onHold', value: 'on-hold' },
  { label: 'books.filters.dropped', value: 'dropped' },
];

// ソートオプション
export const SORT_OPTIONS = [
  { label: 'books.sort.title', value: 'title' },
  { label: 'books.sort.author', value: 'author' },
  { label: 'books.sort.recent', value: 'recent' },
];

// 型定義
export type ViewMode = 'grid' | 'list';
export type SortOption = 'title' | 'author' | 'recent' | 'none';
export type SortDirection = 'asc' | 'desc';

interface NewBookData {
  title: string;
  author: string;
  status: BookStatus;
}

// ViewMode, SortOption, SortDirection の型ガード関数を追加
function isViewMode(value: string): value is ViewMode {
  return value === 'grid' || value === 'list';
}
function isSortOption(value: string): value is SortOption {
  return value === 'title' || value === 'author' || value === 'recent' || value === 'none';
}
function isSortDirection(value: string): value is SortDirection {
  return value === 'asc' || value === 'desc';
}

/**
 * 本の一覧表示と管理に関するロジックをカプセル化するカスタムフック
 */
export function useLibrary() {
  const dispatch = useAppDispatch();
  // Reduxのbooks状態を利用
  const books = useAppSelector(state => state.book?.books || []);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 表示関連の状態管理
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // ソート関連の状態管理
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortModal, setShowSortModal] = useState(false);
  
  // モーダル関連の状態管理
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookStatus, setNewBookStatus] = useState<BookStatus>('planned');
  
  // 設定を読み込む
  useEffect(() => {
    loadSettings();
    refreshBooks();
  }, []);
  
  // 本の一覧を更新
  const refreshBooks = () => {
    dispatch(fetchAllBooksAsync());
    setError(null);
  };
  
  // 設定の読み込み
  const loadSettings = async () => {
    try {
      const savedViewMode = await AsyncStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (savedViewMode && isViewMode(savedViewMode)) {
        setViewMode(savedViewMode);
      }
      const savedSortOption = await AsyncStorage.getItem(SORT_OPTION_STORAGE_KEY);
      if (savedSortOption && isSortOption(savedSortOption)) {
        setSortOption(savedSortOption);
      }
      const savedSortDirection = await AsyncStorage.getItem(SORT_DIRECTION_STORAGE_KEY);
      if (savedSortDirection && isSortDirection(savedSortDirection)) {
        setSortDirection(savedSortDirection);
      }
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
    }
  };
  
  // 表示モードの保存
  const saveViewMode = async (mode: ViewMode) => {
    try {
      await AsyncStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.error('表示モードの保存に失敗しました:', error);
    }
  };
  
  // ソート設定の保存
  const saveSortSettings = async (option: SortOption, direction: SortDirection) => {
    try {
      await AsyncStorage.setItem(SORT_OPTION_STORAGE_KEY, option);
      await AsyncStorage.setItem(SORT_DIRECTION_STORAGE_KEY, direction);
    } catch (error) {
      console.error('並び替え設定の保存に失敗しました:', error);
    }
  };
  
  // フィルタリングとソートを適用して表示する本を更新
  useEffect(() => {
    let result: Book[] = [];
    
    try {
      if (selectedStatus === 'all') {
        result = Array.isArray(books) ? [...books] : [];
      } else {
        result = books.filter(book => book.status === selectedStatus);
      }
      
      // 検索クエリによるフィルタリング
      if (searchQuery && searchQuery.trim()) {
        const lowercaseQuery = searchQuery.toLowerCase();
        result = result.filter(book => 
          book && book.title && book.author && (
            book.title.toLowerCase().includes(lowercaseQuery) || 
            book.author.toLowerCase().includes(lowercaseQuery)
          )
        );
      }
      
      // ソート処理
      if (sortOption !== 'none' && Array.isArray(result) && result.length > 0) {
        result = [...result].sort((a, b) => {
          let compareResult = 0;
          
          switch (sortOption) {
            case 'title':
              compareResult = a.title.localeCompare(b.title);
              break;
            case 'author':
              compareResult = a.author.localeCompare(b.author);
              break;
            case 'recent':
              // IDにローカルタイムスタンプが含まれている場合の並び替え
              const aTimestamp = a.id && a.id.startsWith('local-') ? parseInt(a.id.split('-')[1]) : 0;
              const bTimestamp = b.id && b.id.startsWith('local-') ? parseInt(b.id.split('-')[1]) : 0;
              compareResult = bTimestamp - aTimestamp; // 新しい順（降順）
              break;
          }
          
          // 昇順/降順の適用（recentの場合は反転しない）
          if (sortOption !== 'recent') {
            return sortDirection === 'asc' ? compareResult : -compareResult;
          }
          return compareResult;
        });
      }
    } catch (error) {
      console.error('本のフィルタリングとソート処理中にエラーが発生しました:', error);
      result = [];
      setError('books.error.filterSortFailed');
    }
    
    setFilteredBooks(result);
  }, [books, selectedStatus, searchQuery, sortOption, sortDirection]);
  
  // 本の追加
  const handleAddBook = async () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      return false;
    }
    const defaultCoverUrl = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    const newBook = {
      id: `local-${Date.now()}`,
      title: newBookTitle,
      author: newBookAuthor,
      status: newBookStatus === 'all' ? 'planned' : newBookStatus,
      coverUrl: defaultCoverUrl,
      coverImage: defaultCoverUrl,
      description: '手動で追加された本です',
    };
    try {
      await dispatch(addBookToLibraryAsync({ book: newBook, status: newBook.status })).unwrap();
      refreshBooks();
      resetAddForm();
      return true;
    } catch (e) {
      setError('books.error.addFailed');
      return false;
    }
  };
  
  // 表示モードの切替
  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(newMode);
    saveViewMode(newMode);
  };
  
  // 検索表示の切替
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  // ソートオプションの変更
  const handleSortChange = (option: SortOption) => {
    // 同じオプションが選択された場合は昇順/降順を切り替える
    if (option === sortOption) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      saveSortSettings(option, newDirection);
    } else {
      // 新しいオプションが選択された場合
      setSortOption(option);
      setSortDirection('asc');
      saveSortSettings(option, 'asc');
    }
    setShowSortModal(false);
  };
  
  // 追加フォームのリセット
  const resetAddForm = () => {
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookStatus('planned');
    setAddModalVisible(false);
  };
  
  return {
    // 状態
    books,
    filteredBooks,
    selectedStatus,
    viewMode,
    searchQuery,
    showSearch,
    sortOption,
    sortDirection,
    showSortModal,
    isAddModalVisible,
    newBookTitle,
    newBookAuthor,
    newBookStatus,
    error,
    setError,
    
    // アクション
    setSelectedStatus,
    setSearchQuery,
    toggleViewMode,
    toggleSearch,
    setShowSortModal,
    handleSortChange,
    setAddModalVisible,
    setNewBookTitle,
    setNewBookAuthor,
    setNewBookStatus,
    handleAddBook,
    resetAddForm,
    refreshBooks
  };
} 