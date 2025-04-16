import { useState, useEffect } from 'react';
import { Book, BookStatus } from '../../types/models';
import { selectBook, updateCurrentPage, updateTotalPages, fetchBooksSuccess } from '../store/bookSlice';
import { resetTimer } from '../store/timerSlice';
import { getAllBooks, getBookById } from '../services/BookService';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

/**
 * 本の選択と管理に関するロジックをカプセル化するカスタムフック
 * TimerScreenやBookDetailScreenなどで共通で使用できる
 */
export function useBookSelection() {
  const dispatch = useAppDispatch();
  
  // Redux状態の取得
  const books = useAppSelector(state => state.book?.books || []);
  const selectedBookId = useAppSelector(state => state.book?.selectedBookId || null);
  
  // モーダル表示の状態
  const [showBookSelectorModal, setShowBookSelectorModal] = useState(false);

  // 選択中の書籍
  const selectedBook = selectedBookId 
    ? books.find(book => book.id === selectedBookId) || null
    : null;
  
  // 初期データのロード
  useEffect(() => {
    // 利用可能な読書中の本がない場合はデータを取得
    if (books.length === 0) {
      // BookServiceから本のデータを取得
      const allBooks = getAllBooks().filter(book => book.status === 'reading');
      
      if (allBooks.length > 0) {
        // BookサービスのBookをアプリのBook型に変換
        const convertedBooks = allBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          status: book.status as BookStatus,
          coverImage: book.coverImage || book.coverUrl,
          coverUrl: book.coverUrl || book.coverImage,
          totalPages: book.pageCount || undefined,
          currentPage: 0
        }));
        
        dispatch(fetchBooksSuccess(convertedBooks));
        
        // 選択中の本がまだなければ、最初の本を選択
        if (!selectedBookId && allBooks.length > 0) {
          dispatch(selectBook(allBooks[0].id));
        }
      }
    }
  }, [dispatch, books.length, selectedBookId]);
  
  // 本の詳細ページから遷移してきた場合の処理
  useEffect(() => {
    if (selectedBookId) {
      const bookFromService = getBookById(selectedBookId);
      
      // BookServiceから取得した本の情報がある場合、それをRedux storeに反映
      if (bookFromService) {
        // 既にbooks配列に存在するか確認
        const existingBook = books.find(book => book.id === selectedBookId);
        
        if (!existingBook) {
          // BookサービスのBookをアプリのBook型に変換
          const convertedBook = {
            id: bookFromService.id,
            title: bookFromService.title,
            author: bookFromService.author,
            status: bookFromService.status as BookStatus,
            coverImage: bookFromService.coverImage || bookFromService.coverUrl,
            coverUrl: bookFromService.coverUrl || bookFromService.coverImage,
            totalPages: bookFromService.pageCount || undefined,
            currentPage: 0
          };
          
          // 新しい本のリストを作成して更新
          const updatedBooks = [...books, convertedBook];
          dispatch(fetchBooksSuccess(updatedBooks));
        }
      }
    }
  }, [selectedBookId, books, dispatch]);
  
  // 本の選択時に呼ばれる
  const handleSelectBook = (book: Book) => {
    dispatch(selectBook(book.id));
    dispatch(resetTimer());
    setShowBookSelectorModal(false);
  };

  // 本選択モーダルを開く
  const handleOpenBookSelector = () => {
    setShowBookSelectorModal(true);
  };

  // 本選択モーダルを閉じる
  const handleCloseBookSelector = () => {
    setShowBookSelectorModal(false);
  };

  // 現在のページ数更新
  const handleCurrentPageChange = (page: number) => {
    if (selectedBook) {
      dispatch(updateCurrentPage({ id: selectedBook.id, page }));
    }
  };

  // 全ページ数更新
  const handleTotalPagesChange = (pages: number) => {
    if (selectedBook) {
      dispatch(updateTotalPages({ id: selectedBook.id, pages }));
    }
  };

  return {
    books,
    selectedBookId,
    selectedBook,
    showBookSelectorModal,
    handleSelectBook,
    handleOpenBookSelector,
    handleCloseBookSelector,
    handleCurrentPageChange,
    handleTotalPagesChange
  };
} 