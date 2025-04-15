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
import { resetTimer, finishSession, setGoalTime } from '../../lib/store/timerSlice';
import TimerService, { formatTime, calculateProgress, calculateReadPages } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';
import { getAllBooks, getBookById } from '../../lib/services/BookService';
import { useAppTranslation } from '../../hooks/useAppTranslation';

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
          status: book.status as any, // 型を互換性を持たせる
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
            status: bookFromService.status as any, // 型を互換性を持たせる
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

  // 本の選択表示コンポーネント
  const renderSelectedBook = () => {
    if (!selectedBook) {
      return (
        <TouchableOpacity 
          style={[styles.selectBookButton, { backgroundColor: colors.card }]} 
          onPress={handleOpenBookSelector}
        >
          <BookIcon size={20} color={colors.textSecondary} />
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
            <BookIcon size={20} color={colors.textSecondary} />
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
          <Typography variant="caption" style={{ color: colors.primary, fontSize: 12 }}>
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
            <View style={styles.timerAndProgressWrapper}>
              {/* タイマーコンポーネント */}
              <ReadingTimer 
                book={selectedBook}
                onFinish={handleFinishReading}
                goalTime={(state as any).timer?.goalTime || null}
                onSetGoalTime={handleSetGoalTime}
                compact={true}
              />
              
              {/* ページ進捗コンポーネント */}
              {selectedBook && (
                <View style={[styles.pageProgressContainer, { backgroundColor: colors.card }]}>
                  <View style={styles.pageInputSection}>
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {t('timer.current')}
                        </Typography>
                        <TextInput
                          style={[styles.pageInput, { 
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.text,
                            height: 30,
                            fontSize: 14
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
                      
                      <Typography style={{ color: colors.textSecondary, marginHorizontal: 4 }}>
                        /
                      </Typography>
                      
                      <View style={styles.inputWrapper}>
                        <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12 }}>
                          {t('timer.total')}
                        </Typography>
                        <TextInput
                          style={[styles.pageInput, { 
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.text,
                            height: 30,
                            fontSize: 14
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
                    
                    <View style={[styles.progressSection, { marginTop: 2 }]}>
                      <View style={styles.progressBarWithPercentage}>
                        <View style={styles.progressBarContainer}>
                          <ProgressBar 
                            progress={calculateProgress(selectedBook.currentPage, selectedBook.totalPages)} 
                            height={3}
                          />
                        </View>
                        <Typography variant="caption" style={[styles.progressText, { color: colors.textSecondary, fontSize: 10 }]}>
                          {calculateProgress(selectedBook.currentPage, selectedBook.totalPages)}%
                        </Typography>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 本選択モーダル */}
      <Modal
        visible={showBookSelectorModal}
        onClose={handleCloseBookSelector}
        title={t('timer.selectBook')}
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
        title={t('timer.readingRecord')}
      >
        {selectedBook && (
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
              {/* 読書時間 - ハイライトセクション */}
              <View style={[styles.sessionHighlight, { backgroundColor: colors.secondaryLight }]}>
                <View style={styles.sessionHighlightContent}>
                  <Typography variant="label" style={{ color: colors.primaryDark, marginBottom: 2 }}>
                    {t('timer.readingTime')}
                  </Typography>
                  <Typography variant="display" style={{ color: colors.primaryDark, fontSize: 24 }}>
                    {formatTime(displaySeconds)}
                  </Typography>
                </View>
              </View>
              
              {/* 読了ページ数と進捗率 */}
              <View style={styles.achievementSection}>
                <View style={styles.achievementItem}>
                  <View style={[styles.achievementIcon, { backgroundColor: colors.primary }]}>
                    <Typography variant="title" style={{ color: colors.secondaryLight, fontSize: 16 }}>
                      {getReadPages()}
                    </Typography>
                  </View>
                  <Typography variant="caption" style={{ color: colors.textSecondary, marginTop: 2, fontSize: 10 }}>
                    {t('timer.pagesRead')}
                  </Typography>
                </View>
                
                <View style={styles.achievementItem}>
                  <View style={[styles.achievementIcon, { backgroundColor: colors.secondaryDark }]}>
                    <Typography variant="title" style={{ color: colors.background, fontSize: 16 }}>
                      {calculateModalProgress()}%
                    </Typography>
                  </View>
                  <Typography variant="caption" style={{ color: colors.textSecondary, marginTop: 2, fontSize: 10 }}>
                    {t('timer.progressRate')}
                  </Typography>
                </View>
              </View>
              
              {/* 入力フィールド */}
              <View style={[styles.inputSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>
                      {t('timer.currentPage')}
                    </Typography>
                    <TextInput
                      style={[styles.modalInput, { 
                        borderColor: colors.border, 
                        backgroundColor: colors.background,
                        color: colors.text
                      }]}
                      value={modalCurrentPage !== undefined ? modalCurrentPage.toString() : ''}
                      onChangeText={validateAndUpdateModalCurrentPage}
                      keyboardType="number-pad"
                      placeholder="0"
                    />
                  </View>
                  
                  <View style={styles.inputColumn}>
                    <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>
                      {t('timer.totalPages')}
                    </Typography>
                    <TextInput
                      style={[styles.modalInput, { 
                        borderColor: colors.border, 
                        backgroundColor: colors.background,
                        color: colors.text
                      }]}
                      value={modalTotalPages !== undefined ? modalTotalPages.toString() : ''}
                      onChangeText={validateAndUpdateModalTotalPages}
                      keyboardType="number-pad"
                      placeholder="0"
                    />
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={calculateModalProgress()} 
                    height={6}
                    progressColor={colors.secondary}
                    backgroundColor={colors.neutralLight}
                  />
                </View>
              </View>
            </View>

            <Button 
              title={t('timer.save')} 
              onPress={handleSaveSession} 
              variant="primary"
              size="medium"
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  selectorContainer: {
    marginBottom: 12,
  },
  timerContainer: {
    flex: 1,
  },
  timerAndProgressWrapper: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    alignItems: 'center',
  },
  pageInput: {
    width: 50,
    borderWidth: 1,
    borderRadius: 6,
    textAlign: 'center',
    marginTop: 4,
  },
  progressSection: {
    width: '100%',
    marginTop: 4,
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
    width: 40,
    textAlign: 'right',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHighlightContent: {
    alignItems: 'center',
  },
  achievementSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputSection: {
    borderWidth: 1,
    borderRadius: 12,
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
    marginBottom: 12,
  },
  bookCover: {
    width: 40,
    height: 60,
    borderRadius: 4,
  },
  placeholderCover: {
    width: 40,
    height: 60,
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
    fontSize: 14,
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
    padding: 14,
    marginBottom: 12,
  },
  // 本選択モーダル用スタイル
  bookSelectorModalContainer: {
    height: 400,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
}); 