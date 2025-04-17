import { useState } from 'react';
import { Alert } from 'react-native';
import { Book } from '../../types/models';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { updateCurrentPage, updateTotalPages } from '../store/bookSlice';
import { clearCurrentSession } from '../store/sessionSlice';
import { resetTimer, completeReadingSessionAsync } from '../store/timerSlice';
import TimerService from '../services/TimerService';
import { useAppTranslation } from '../../hooks/useAppTranslation';

/**
 * 読書セッションの完了と保存に関するロジックをカプセル化するカスタムフック
 */
export function useReadingSession(originalStatusRef?: React.RefObject<string | null>) {
  const { t } = useAppTranslation();
  const dispatch = useAppDispatch();

  // Redux状態の取得
  const displaySeconds = useAppSelector(state => state.timer?.displaySeconds || 0);
  const startPage = useAppSelector(state => state.timer?.startPage || null);

  // モーダル関連の状態
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [modalCurrentPage, setModalCurrentPage] = useState<number | undefined>(undefined);
  const [modalTotalPages, setModalTotalPages] = useState<number | undefined>(undefined);
  
  // 読書セッション完了時の処理
  const handleFinishReading = (book: Book | null, originalStatus?: string | null) => {
    if (!book) return;
    // Redux経由で読書セッション完了処理
    dispatch(completeReadingSessionAsync({
      bookId: book.id,
      bookTitle: book.title,
      currentPage: book.currentPage,
      totalPages: book.totalPages,
      originalStatus: originalStatus ?? originalStatusRef?.current ?? null
    }));
    setModalCurrentPage(book.currentPage);
    setModalTotalPages(book.totalPages);
    setShowCompletionModal(true);
  };

  // セッションの保存処理
  const handleSaveSession = (book: Book | null, originalStatus?: string | null) => {
    if (!book) return;
    
    // 現在のページと総ページ数を更新
    dispatch(updateCurrentPage({ 
      id: book.id, 
      page: modalCurrentPage || book.currentPage || 0 
    }));
    
    dispatch(updateTotalPages({ 
      id: book.id, 
      pages: modalTotalPages || book.totalPages || 0 
    }));
    
    // モーダルを閉じる
    handleCloseCompletionModal();
    
    // 成功メッセージ表示
    Alert.alert(t('timer.saved'), t('timer.recordSaved'));
  };

  // モーダルを閉じる処理
  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    
    // セッション情報をクリア
    dispatch(clearCurrentSession());
    dispatch(resetTimer());
  };

  // モーダルの現在のページ入力検証・更新
  const validateAndUpdateModalCurrentPage = (text: string) => {
    const page = parseInt(text, 10);
    
    if (!isNaN(page) && page >= 0) {
      setModalCurrentPage(page);
    } else if (text === '') {
      setModalCurrentPage(undefined);
    }
  };

  // モーダルの全ページ数入力検証・更新
  const validateAndUpdateModalTotalPages = (text: string) => {
    const pages = parseInt(text, 10);
    
    if (!isNaN(pages) && pages > 0) {
      setModalTotalPages(pages);
    } else if (text === '') {
      setModalTotalPages(undefined);
    }
  };

  return {
    displaySeconds,
    startPage,
    showCompletionModal,
    modalCurrentPage,
    modalTotalPages,
    handleFinishReading,
    handleSaveSession,
    handleCloseCompletionModal,
    validateAndUpdateModalCurrentPage,
    validateAndUpdateModalTotalPages
  };
} 