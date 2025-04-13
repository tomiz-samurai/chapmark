import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TextInput, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useSelector, useDispatch } from 'react-redux';
import { Book as BookIcon } from 'lucide-react-native';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { ReadingTimer } from '../../components/common/ReadingTimer';
import { BookSelector } from '../../components/common/BookSelector';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Typography } from '../../components/Typography';
import { Book } from '../../lib/types';
import { RootState } from '../../lib/store';
import { selectBook, updateCurrentPage, updateTotalPages, fetchBooksSuccess } from '../../lib/store/bookSlice';
import { clearCurrentSession } from '../../lib/store/sessionSlice';
import { resetTimer, finishSession } from '../../lib/store/timerSlice';
import TimerService, { formatTime, calculateProgress, calculateReadPages } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';

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
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  
  const dispatch = useDispatch();
  
  // Redux状態の取得
  const state = useSelector((state: RootState) => state);
  
  // Redux状態へのアクセス
  // 型アサーションを使用して型エラーを回避
  const books = (state as any).book?.books || [];
  const selectedBookId = (state as any).book?.selectedBookId || null;
  const displaySeconds = (state as any).timer?.displaySeconds || 0;
  const startPage = (state as any).timer?.startPage || null;
  const currentSession = (state as any).session?.currentSession || null;
  
  // ローカル状態
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showBookSelectorModal, setShowBookSelectorModal] = useState(false);
  const [modalCurrentPage, setModalCurrentPage] = useState<number | undefined>(undefined);
  const [modalTotalPages, setModalTotalPages] = useState<number | undefined>(undefined);
  
  // 選択中の書籍
  const selectedBook = selectedBookId 
    ? books.find((book: Book) => book.id === selectedBookId) || null
    : null;
  
  // 初期データのロード
  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooksSuccess(READING_BOOKS));
    }
  }, [dispatch, books.length]);
  
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
    Alert.alert("保存しました", "読書の記録を保存しました。");
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

  // 選択中の本表示コンポーネント
  const renderSelectedBook = () => {
    if (!selectedBook) {
      return (
        <TouchableOpacity 
          style={[styles.selectBookButton, { backgroundColor: colors.card }]} 
          onPress={handleOpenBookSelector}
        >
          <BookIcon size={24} color={colors.textSecondary} />
          <Typography variant="body" style={{ color: colors.text, marginLeft: spacing.medium }}>
            読書する本を選択
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
            <BookIcon size={24} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.bookInfo}>
          <Typography variant="body" style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>
            {selectedBook.title}
          </Typography>
          <Typography variant="caption" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {selectedBook.author}
          </Typography>
          {selectedBook.currentPage !== undefined && selectedBook.totalPages !== undefined && (
            <View style={styles.bookProgress}>
              <ProgressBar 
                progress={calculateProgress(selectedBook.currentPage, selectedBook.totalPages)} 
                height={4} 
                showPercentage={false}
              />
              <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 10, marginTop: 2 }}>
                {selectedBook.currentPage} / {selectedBook.totalPages}ページ
              </Typography>
            </View>
          )}
        </View>
        <View style={styles.changeButton}>
          <Typography variant="caption" style={{ color: colors.primary }}>
            変更
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
      <Header title="読書タイマー" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}
      >
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
            />
            
            {/* ページ進捗コンポーネント */}
            {selectedBook && (
              <View style={[styles.pageProgressContainer, { backgroundColor: colors.card }]}>
                <View style={styles.pageInputSection}>
                  <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                      <Typography variant="caption" style={{ color: colors.textSecondary }}>
                        現在
                      </Typography>
                      <TextInput
                        style={[styles.pageInput, { 
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text
                        }]}
                        value={selectedBook.currentPage?.toString()}
                        onChangeText={(text) => {
                          const page = parseInt(text, 10);
                          if (!isNaN(page)) handleCurrentPageChange(page);
                        }}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        placeholder="0"
                      />
                    </View>
                    
                    <Typography style={{ color: colors.textSecondary, marginHorizontal: 6 }}>
                      /
                    </Typography>
                    
                    <View style={styles.inputWrapper}>
                      <Typography variant="caption" style={{ color: colors.textSecondary }}>
                        全体
                      </Typography>
                      <TextInput
                        style={[styles.pageInput, { 
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text
                        }]}
                        value={selectedBook.totalPages?.toString()}
                        onChangeText={(text) => {
                          const pages = parseInt(text, 10);
                          if (!isNaN(pages)) handleTotalPagesChange(pages);
                        }}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        placeholder="0"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.progressSection}>
                    <View style={styles.progressBarWithPercentage}>
                      <View style={styles.progressBarContainer}>
                        <ProgressBar progress={calculateProgress(selectedBook.currentPage, selectedBook.totalPages)} />
                      </View>
                      <Typography variant="caption" style={[styles.progressText, { color: colors.textSecondary }]}>
                        {calculateProgress(selectedBook.currentPage, selectedBook.totalPages)}%
                      </Typography>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 本選択モーダル */}
      <Modal
        visible={showBookSelectorModal}
        onClose={handleCloseBookSelector}
        title="読書する本を選択"
      >
        <View style={styles.bookSelectorModalContainer}>
          <BookSelector 
            books={books} 
            selectedBookId={selectedBookId}
            onSelectBook={handleSelectBook}
            isModal={true}
          />
        </View>
      </Modal>

      {/* 読書完了モーダル */}
      <Modal
        visible={showCompletionModal}
        onClose={handleCloseCompletionModal}
        title="読書記録"
      >
        {currentSession && selectedBook && (
          <View style={styles.modalContent}>
            {/* 書籍情報 */}
            <View style={styles.bookInfoContainer}>
              {selectedBook.coverImage && (
                <Image 
                  source={{ uri: selectedBook.coverImage }} 
                  style={styles.modalCoverImage} 
                />
              )}
              <View style={styles.modalBookInfo}>
                <Typography variant="title" style={{ color: colors.text }}>
                  {selectedBook.title}
                </Typography>
                <Typography variant="body" style={{ color: colors.textSecondary }}>
                  {selectedBook.author}
                </Typography>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* 読書セッション情報 */}
            <View style={styles.sessionInfoContainer}>
              <View style={styles.sessionInfoRow}>
                <Typography variant="label" style={{ color: colors.textSecondary }}>読書時間</Typography>
                <Typography variant="title" style={{ color: colors.text }}>
                  {formatTime(displaySeconds)}
                </Typography>
              </View>
              
              <View style={styles.sessionInfoRow}>
                <Typography variant="label" style={{ color: colors.textSecondary }}>読了ページ数</Typography>
                <Typography variant="title" style={{ color: colors.text }}>
                  {getReadPages()} ページ
                </Typography>
              </View>
              
              <View style={styles.sessionInfoRow}>
                <Typography variant="label" style={{ color: colors.textSecondary }}>現在のページ</Typography>
                <TextInput
                  style={[styles.modalInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.background,
                    color: colors.text
                  }]}
                  value={modalCurrentPage !== undefined ? modalCurrentPage.toString() : ''}
                  onChangeText={validateAndUpdateModalCurrentPage}
                  keyboardType="number-pad"
                  placeholder="ページ数"
                />
              </View>
              
              <View style={styles.sessionInfoRow}>
                <Typography variant="label" style={{ color: colors.textSecondary }}>全ページ数</Typography>
                <TextInput
                  style={[styles.modalInput, { 
                    borderColor: colors.border, 
                    backgroundColor: colors.background,
                    color: colors.text
                  }]}
                  value={modalTotalPages !== undefined ? modalTotalPages.toString() : ''}
                  onChangeText={validateAndUpdateModalTotalPages}
                  keyboardType="number-pad"
                  placeholder="全ページ"
                />
              </View>
              
              <View style={styles.progressContainer}>
                <ProgressBar progress={calculateModalProgress()} />
                <Typography variant="caption" style={[styles.progressText, { color: colors.textSecondary }]}>
                  進捗: {calculateModalProgress()}%
                </Typography>
              </View>
            </View>

            <Button 
              title="保存する" 
              onPress={handleSaveSession} 
              style={styles.saveButton}
            />
          </View>
        )}
      </Modal>
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
    flex: 1,
    padding: 16,
  },
  selectorContainer: {
    marginBottom: 12,
  },
  timerContainer: {
    flex: 1,
  },
  pageProgressContainer: {
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  pageInputSection: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputWrapper: {
    alignItems: 'center',
  },
  pageInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 4,
  },
  progressSection: {
    width: '100%',
  },
  progressBarWithPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    width: 50,
    textAlign: 'right',
  },
  modalContent: {
    padding: 16,
  },
  bookInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modalCoverImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
  },
  modalBookInfo: {
    marginLeft: 16,
    justifyContent: 'center',
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  sessionInfoContainer: {
    marginBottom: 24,
  },
  sessionInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalInput: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
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
    padding: 12,
    marginBottom: 8,
  },
  bookCover: {
    width: 50,
    height: 70,
    borderRadius: 4,
  },
  placeholderCover: {
    width: 50,
    height: 70,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontWeight: 'bold',
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
    padding: 16,
    marginBottom: 8,
  },
  // 本選択モーダル用スタイル
  bookSelectorModalContainer: {
    height: 400,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
}); 