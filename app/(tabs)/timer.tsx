import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TextInput, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book as BookIcon } from 'lucide-react-native';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { ReadingTimer } from '../../components/common/ReadingTimer';
import { BookSelector } from '../../components/common/BookSelector';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Typography } from '../../components/Typography';
import { Book, BookStatus } from '../../types/models';
import { selectBook, updateCurrentPage, updateTotalPages, fetchBooksSuccess } from '../../lib/store/bookSlice';
import { clearCurrentSession } from '../../lib/store/sessionSlice';
import { resetTimer, finishSession, setGoalTime } from '../../lib/store/timerSlice';
import TimerService, { formatTime, calculateProgress, calculateReadPages } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';
import { getAllBooks, getBookById } from '../../lib/services/BookService';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { QuickEntryModal } from '../../components/modals/QuickEntryModal';
import { useAppSelector } from '../../lib/hooks/useAppSelector';
import { useAppDispatch } from '../../lib/hooks/useAppDispatch';
import { TimerControls } from '../../components/timer/TimerControls';
import { PageProgress } from '../../components/timer/PageProgress';
import { CompletionModal } from '../../components/modals/CompletionModal';
import { spacing } from '../../constants/theme';

// ダミーデータ（実際の実装では本のリストはストアまたはAPIから取得）
const READING_BOOKS: Book[] = [
  {
    id: '1',
    title: 'エッセンシャル思考',
    author: 'グレッグ・マキューン',
    status: 'reading',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
    totalPages: 256,
    currentPage: 42,
  },
  {
    id: '4',
    title: 'アトミック・ハビット',
    author: 'ジェームズ・クリアー',
    status: 'reading',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1798&ixlib=rb-4.0.3',
    totalPages: 320,
    currentPage: 158,
  },
];

export default function TimerScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  
  const dispatch = useAppDispatch();
  
  // Redux状態の取得
  const state = useAppSelector((state) => state);
  
  // Redux状態へのアクセス
  const books = state.book?.books || [];
  const selectedBookId = state.book?.selectedBookId || null;
  const displaySeconds = state.timer?.displaySeconds || 0;
  const startPage = state.timer?.startPage || null;
  const currentSession = state.session?.currentSession || null;
  const isTimerRunning = state.timer?.isRunning || false;
  
  // ローカル状態
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showBookSelectorModal, setShowBookSelectorModal] = useState(false);
  const [modalCurrentPage, setModalCurrentPage] = useState<number | undefined>(undefined);
  const [modalTotalPages, setModalTotalPages] = useState<number | undefined>(undefined);
  const [quickEntryModalVisible, setQuickEntryModalVisible] = useState(false);
  
  // 選択中の書籍
  const selectedBook = selectedBookId 
    ? books.find((book: Book) => book.id === selectedBookId) || null
    : null;
  
  // 初期データのロード
  useEffect(() => {
    // 利用可能な読書中の本がない場合はモックデータを使用
    if (books.length === 0) {
      // BookServiceから本のデータを取得
      const allBooks = getAllBooks().filter(book => book.status === 'reading');
      
      if (allBooks.length > 0) {
        // BookサービスのBookをアプリのBook型に変換
        const convertedBooks = allBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          status: book.status as BookStatus, // 明示的な型として指定
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
      } else {
        // 読書中の本がない場合はモックデータを使用
        dispatch(fetchBooksSuccess(READING_BOOKS));
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
        const existingBook = books.find((book: Book) => book.id === selectedBookId);
        
        if (!existingBook) {
          // BookサービスのBookをアプリのBook型に変換
          const convertedBook = {
            id: bookFromService.id,
            title: bookFromService.title,
            author: bookFromService.author,
            status: bookFromService.status as BookStatus, // 明示的な型として指定
            coverImage: bookFromService.coverImage || bookFromService.coverUrl,
            coverUrl: bookFromService.coverUrl || bookFromService.coverImage,
            totalPages: bookFromService.pageCount || undefined,
            currentPage: 0
          };
          
          // 新しい本のリストを作成
          const updatedBooks = [...books, convertedBook];
          
          // ストアを更新
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

  // 読書セッション完了時の処理
  const handleFinishReading = () => {
    if (!selectedBook) return;
    
    // TimerServiceを使って読書セッションを完了
    TimerService.completeReading(selectedBook.currentPage);
    
    // モーダル表示用の状態を設定
    setModalCurrentPage(selectedBook.currentPage);
    setModalTotalPages(selectedBook.totalPages);
    setShowCompletionModal(true);
  };

  // セッションの保存処理
  const handleSaveSession = () => {
    if (!selectedBook) return;
    
    // 現在のページと総ページ数を更新
    dispatch(updateCurrentPage({ 
      id: selectedBook.id, 
      page: modalCurrentPage || selectedBook.currentPage || 0 
    }));
    
    dispatch(updateTotalPages({ 
      id: selectedBook.id, 
      pages: modalTotalPages || selectedBook.totalPages || 0 
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
  
  // モーダルの進捗率を計算
  const calculateModalProgress = (): number => {
    return calculateProgress(modalCurrentPage, modalTotalPages);
  };

  // 読んだページ数を計算
  const getReadPages = (): number => {
    return calculateReadPages(startPage, modalCurrentPage);
  };

  // 目標時間設定の処理を追加
  const handleSetGoalTime = (seconds: number) => {
    dispatch(setGoalTime(seconds));
  };

  // クイックエントリーモーダルを開く
  const handleOpenQuickEntry = () => {
    setQuickEntryModalVisible(true);
  };

  // クイックエントリーモーダルを閉じる
  const handleCloseQuickEntry = () => {
    setQuickEntryModalVisible(false);
  };

  // 本の選択表示コンポーネント
  const renderSelectedBook = () => {
    if (!selectedBook) {
      return (
        <TouchableOpacity 
          style={[styles.selectBookButton, { backgroundColor: colors.card }]} 
          onPress={handleOpenBookSelector}
        >
          <BookIcon size={18} color={colors.textSecondary} />
          <Typography variant="body" style={{ color: colors.text, marginLeft: spacing.small, fontSize: 14 }}>
            {t('timer.selectBook')}
          </Typography>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[styles.selectedBookContainer, { backgroundColor: colors.card }]} 
        onPress={handleOpenBookSelector}
      >
        {selectedBook.coverImage ? (
          <Image source={{ uri: selectedBook.coverImage }} style={styles.bookCover} />
        ) : (
          <View style={[styles.placeholderCover, { backgroundColor: colors.border }]}>
            <BookIcon size={18} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.bookInfo}>
          <Typography variant="body" style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>
            {selectedBook.title}
          </Typography>
          <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12 }} numberOfLines={1}>
            {selectedBook.author}
          </Typography>
          {selectedBook.currentPage !== undefined && selectedBook.totalPages !== undefined && (
            <View style={styles.bookProgress}>
              <ProgressBar 
                progress={calculateProgress(selectedBook.currentPage, selectedBook.totalPages)} 
                height={3} 
                showPercentage={false}
              />
              <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 9, marginTop: 2 }}>
                {selectedBook.currentPage} / {selectedBook.totalPages} {t('timer.page')}
              </Typography>
            </View>
          )}
        </View>
        <View style={styles.changeButton}>
          <Typography variant="caption" style={{ color: colors.primary, fontSize: 12, fontWeight: '500' }}>
            {t('timer.change')}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={t('navigation.timer')}
        notificationCount={0}
        onNotificationPress={() => {}}
      />
      
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          {/* 本の選択表示 */}
          <View style={styles.selectorContainer}>
            {renderSelectedBook()}
          </View>
          
          {/* タイマーと進捗表示エリア */}
          <View style={styles.timerContainer}>
            {/* タイマーコンポーネント */}
            <ReadingTimer 
              book={selectedBook}
              onFinish={handleFinishReading}
              goalTime={state.timer?.goalTime || null}
              onSetGoalTime={handleSetGoalTime}
              compact={true}
            />
            
            {/* ページ進捗コンポーネント */}
            {selectedBook && (
              <PageProgress
                book={selectedBook}
                onCurrentPageChange={handleCurrentPageChange}
                onTotalPagesChange={handleTotalPagesChange}
              />
            )}
          </View>
          
          {/* クイックエントリーのフローティングボタン */}
          {selectedBook && (
            <TouchableOpacity 
              style={[styles.quickEntryButton, { backgroundColor: colors.primary }]} 
              onPress={handleOpenQuickEntry}
              accessibilityLabel={t('book.quickEntry')}
              accessibilityRole="button"
            >
              <Typography variant="body" style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                {t('book.quickEntry')}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* 本選択モーダル */}
      <Modal
        visible={showBookSelectorModal}
        title={t('timer.selectBook')}
        onClose={handleCloseBookSelector}
      >
        <View style={styles.bookSelectorModalWrapper}>
          <BookSelector
            books={books.filter((book: Book) => book.status === 'reading')}
            selectedBookId={selectedBookId}
            onSelectBook={handleSelectBook}
            isModal={true}
          />
        </View>
      </Modal>
      
      {/* 読書完了モーダル */}
      <CompletionModal
        visible={showCompletionModal}
        onClose={handleCloseCompletionModal}
        onSave={handleSaveSession}
        startPage={startPage}
        initialCurrentPage={modalCurrentPage}
        initialTotalPages={modalTotalPages}
        readingTime={displaySeconds}
        bookTitle={selectedBook?.title}
        bookAuthor={selectedBook?.author}
        coverImage={selectedBook?.coverImage}
      />
      
      {/* クイックエントリーモーダル */}
      <QuickEntryModal
        visible={quickEntryModalVisible}
        onClose={handleCloseQuickEntry}
        bookId={selectedBookId || ''}
        currentPage={selectedBook?.currentPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    flex: 1,
  },
  selectorContainer: {
    marginBottom: 10,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  pageProgressContainer: {
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    marginBottom: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  pageInputSection: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    alignItems: 'center',
  },
  pageInput: {
    width: 50,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 15,
  },
  progressSection: {
    width: '100%',
    marginTop: 8,
  },
  progressBarWithPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressText: {
    width: 42,
    textAlign: 'right',
    fontSize: 12,
  },
  modalContent: {
    padding: 20,
  },
  bookInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalCoverImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBookInfo: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  sessionInfoContainer: {
    marginBottom: 24,
  },
  sessionHighlight: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sessionHighlightContent: {
    alignItems: 'center',
  },
  achievementSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputSection: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sessionInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputColumn: {
    alignItems: 'center',
    width: '48%',
  },
  modalInput: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 8,
  },
  // 選択中の本の表示用スタイル
  selectedBookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bookCover: {
    width: 36,
    height: 54,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  placeholderCover: {
    width: 36,
    height: 54,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 10,
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  bookProgress: {
    marginTop: 4,
    width: '100%',
  },
  changeButton: {
    paddingHorizontal: 8,
  },
  selectBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  // 本選択モーダル用スタイル
  bookSelectorModalWrapper: {
    paddingBottom: spacing.md,
  },
  floatingQuickEntryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 14,
    marginBottom: 12,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  quickEntryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 14,
    marginBottom: 12,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
}); 