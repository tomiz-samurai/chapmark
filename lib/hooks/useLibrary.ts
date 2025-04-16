import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookStatus } from '../../types/models';
import {
  getUserBooks,
  getUserBooksByStatus,
  addBookToLibrary,
  searchBooks as searchBooksService,
  Book as ServiceBook
} from '../services/BookService';

// AsyncStorageのキー
const VIEW_MODE_STORAGE_KEY = 'chapmark_library_view_mode';
const SORT_OPTION_STORAGE_KEY = 'chapmark_library_sort_option';
const SORT_DIRECTION_STORAGE_KEY = 'chapmark_library_sort_direction';

// タブ定義
export const STATUS_TABS = [
  { label: 'books.filters.all', value: 'all' },
  { label: 'books.filters.reading', value: 'reading' },
  { label: 'books.filters.completed', value: 'completed' },
  { label: 'books.filters.planned', value: 'planned' },
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

// サービスの Book から モデルの Book への変換ヘルパー関数
const convertServiceBookToModelBook = (book: ServiceBook): Book => {
  return {
    ...book,
    status: (book.status || 'planned') as BookStatus
  };
};

/**
 * 本の一覧表示と管理に関するロジックをカプセル化するカスタムフック
 */
export function useLibrary() {
  // 本の状態管理
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
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
    const serviceBooks = getUserBooks();
    // サービスの Book から モデルの Book へ変換
    const modelBooks = serviceBooks.map(convertServiceBookToModelBook);
    setBooks(modelBooks);
  };
  
  // 設定の読み込み
  const loadSettings = async () => {
    try {
      const savedViewMode = await AsyncStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (savedViewMode) {
        setViewMode(savedViewMode as ViewMode);
      }
      
      const savedSortOption = await AsyncStorage.getItem(SORT_OPTION_STORAGE_KEY);
      if (savedSortOption) {
        setSortOption(savedSortOption as SortOption);
      }
      
      const savedSortDirection = await AsyncStorage.getItem(SORT_DIRECTION_STORAGE_KEY);
      if (savedSortDirection) {
        setSortDirection(savedSortDirection as SortDirection);
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
        const serviceBooks = getUserBooksByStatus(selectedStatus) || [];
        result = Array.isArray(serviceBooks) ? serviceBooks.map(book => 
          book ? convertServiceBookToModelBook(book) : null).filter(Boolean) as Book[] : [];
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
    }
    
    setFilteredBooks(result);
  }, [books, selectedStatus, searchQuery, sortOption, sortDirection]);
  
  // 本の追加
  const handleAddBook = () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      return false; // 必須項目が不足している場合
    }
    
    // デフォルトのカバー画像URL
    const defaultCoverUrl = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    
    // 新しい本のデータを作成
    const newBook = {
      id: `local-${Date.now()}`, // 一意のID（タイムスタンプを含む）
      title: newBookTitle,
      author: newBookAuthor,
      coverUrl: defaultCoverUrl,
      coverImage: defaultCoverUrl, // 両方のプロパティを設定
      description: '手動で追加された本です',
    } as ServiceBook;
    
    // BookServiceを使用して本を追加
    const status = newBookStatus === 'all' ? 'planned' : newBookStatus;
    addBookToLibrary(newBook, status);
    
    // 本の一覧を更新
    refreshBooks();
    resetAddForm();
    
    return true;
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