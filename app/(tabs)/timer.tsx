import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TextInput, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book as BookIcon } from 'lucide-react-native';
import { Loading } from '../../components/common';
import { Header } from '../../components/layouts/Header';
import { ReadingTimer } from '../../components/common';
import { BookSelector } from '../../components/common';
import { ProgressBar } from '../../components/common';
import { Modal } from '../../components/common';
import { Button } from '../../components/common';
import { Typography } from '../../components/Typography';
import { Book, BookStatus } from '../../types/models';
import { clearCurrentSession } from '../../lib/store/sessionSlice';
import { setGoalTime } from '../../lib/store/timerSlice';
import TimerService, { formatTime, calculateProgress, calculateReadPages } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { QuickEntryModal } from '../../components/modals/QuickEntryModal';
import { useAppSelector } from '../../lib/hooks/useAppSelector';
import { useAppDispatch } from '../../lib/hooks/useAppDispatch';
import { TimerControls } from '../../components/timer/TimerControls';
import { PageProgress } from '../../components/timer/PageProgress';
import { CompletionModal } from '../../components/modals/CompletionModal';
import { spacing } from '../../constants/theme';
import { BookSelection } from '../../components/books/BookSelection';
import { useBookSelection } from '../../lib/hooks/useBookSelection';
import { useReadingSession } from '../../lib/hooks/useReadingSession';

export default function TimerScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();
  const dispatch = useAppDispatch();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  
  // カスタムフックを使用して本の選択と管理機能を取得
  const { 
    books, 
    selectedBookId, 
    selectedBook,
    showBookSelectorModal,
    handleSelectBook,
    handleOpenBookSelector,
    handleCloseBookSelector,
    handleCurrentPageChange,
    handleTotalPagesChange
  } = useBookSelection();
  
  // カスタムフックを使用して読書セッション機能を取得
  const {
    displaySeconds,
    startPage,
    showCompletionModal,
    modalCurrentPage, 
    modalTotalPages,
    handleFinishReading,
    handleSaveSession,
    handleCloseCompletionModal
  } = useReadingSession();
  
  // タイマーの状態
  const isTimerRunning = useAppSelector(state => state.timer?.isRunning || false);
  
  // 目標時間の状態
  const goalTime = useAppSelector(state => state.timer?.goalTime || null);
  
  // クイックエントリーモーダルの状態
  const [quickEntryModalVisible, setQuickEntryModalVisible] = useState(false);
  
  // 目標時間設定の処理
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

  if (!fontsLoaded) {
    return <Loading />;
  }

  // 読書中の本をfilter
  const readingBooks = books.filter(book => book.status === 'reading');

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
            <BookSelection
              books={readingBooks}
              selectedBookId={selectedBookId}
              onSelectBook={(book) => handleSelectBook(book)}
              onOpenModal={handleOpenBookSelector}
            />
          </View>
          
          {/* タイマーと進捗表示エリア */}
          <View style={styles.timerContainer}>
            {/* タイマーコンポーネント */}
            <ReadingTimer 
              book={selectedBook}
              onFinish={() => handleFinishReading(selectedBook)}
              goalTime={goalTime}
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
        title="timer.selectBook"
        isTitleTranslationKey={true}
        onClose={handleCloseBookSelector}
      >
        <View style={styles.bookSelectorModalWrapper}>
          <BookSelector
            books={readingBooks}
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
        onSave={() => handleSaveSession(selectedBook)}
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
  // 本選択モーダル用スタイル
  bookSelectorModalWrapper: {
    paddingBottom: spacing.md,
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