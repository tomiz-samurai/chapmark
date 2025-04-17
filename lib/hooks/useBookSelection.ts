import { useState, useEffect, useRef } from 'react';
import { Book, BookStatus } from '../../types/models';
import { selectBook, updateCurrentPage, updateTotalPages, fetchBooksSuccess, fetchAllBooksAsync } from '../store/bookSlice';
import { resetTimer } from '../store/timerSlice';
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
  
  // 本の元のステータスを保持
  const originalStatus = useRef<BookStatus | null>(null);
  
  // 初期データのロード
  useEffect(() => {
    // 利用可能な読書中の本がない場合はデータを取得
    if (books.length === 0) {
      dispatch(fetchAllBooksAsync());
    }
  }, [dispatch, books.length]);
  
  // 本の詳細ページから遷移してきた場合の処理
  useEffect(() => {
    if (selectedBookId && books.length > 0) {
      // 既にbooks配列に存在するか確認
      const existingBook = books.find(book => book.id === selectedBookId);
      if (!existingBook) {
        // 何もしない（本がReduxにない場合はfetchAllBooksAsyncで取得される想定）
      }
    }
  }, [selectedBookId, books, dispatch]);
  
  // 本の選択時に呼ばれる
  const handleSelectBook = (book: Book) => {
    originalStatus.current = book.status;
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
    handleTotalPagesChange,
    originalStatus
  };
} 