import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Image, TextInput, Keyboard } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { ReadingTimer } from '../../components/common/ReadingTimer';
import { BookSelector } from '../../components/common/BookSelector';
import { PageInput } from '../../components/common/PageInput';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Typography } from '../../components/Typography';
import { colors, spacing, typography } from '../../constants/theme';
import { Book, ReadingSession } from '../../lib/types';

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
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const startPageRef = useRef<number | null>(null);
  const [modalCurrentPage, setModalCurrentPage] = useState<number | undefined>(undefined);
  const [modalTotalPages, setModalTotalPages] = useState<number | undefined>(undefined);

  // 本の選択時に呼ばれる
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setIsTimerRunning(false);
    setSeconds(0);
    startTimeRef.current = null;
  };

  // 現在のページ数更新
  const handleCurrentPageChange = (page: number) => {
    if (selectedBook) {
      setSelectedBook({
        ...selectedBook,
        currentPage: page
      });
    }
  };

  // 全ページ数更新
  const handleTotalPagesChange = (pages: number) => {
    if (selectedBook) {
      setSelectedBook({
        ...selectedBook,
        totalPages: pages
      });
    }
  };

  // タイマー制御
  useEffect(() => {
    if (isTimerRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = new Date();
        // 読書開始時の現在ページを記録
        if (selectedBook?.currentPage !== undefined) {
          startPageRef.current = selectedBook.currentPage;
        }
      }
      
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // クリーンアップ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const handleToggleTimer = () => {
    if (!selectedBook) return;
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSeconds(0);
    startTimeRef.current = null;
    startPageRef.current = null;
  };

  const handleFinishReading = () => {
    if (!selectedBook || !startTimeRef.current) return;
    
    // 読書セッション情報を作成
    const endTime = new Date();
    const newSession: ReadingSession = {
      id: Date.now().toString(),
      bookId: selectedBook.id,
      startTime: startTimeRef.current,
      endTime: endTime,
      duration: seconds,
      completed: true,
      startPage: startPageRef.current || undefined,
      endPage: selectedBook.currentPage,
    };
    
    setCurrentSession(newSession);
    
    // モーダル表示前に現在のページと全ページ数をモーダル用の状態に設定
    setModalCurrentPage(selectedBook.currentPage);
    setModalTotalPages(selectedBook.totalPages);
    
    setShowCompletionModal(true);
    
    // リセット
    setIsTimerRunning(false);
  };

  const handleSaveSession = () => {
    if (!selectedBook) return;
    
    // ページ情報を更新
    const updatedBook = {
      ...selectedBook,
      currentPage: modalCurrentPage,
      totalPages: modalTotalPages
    };
    
    // 実際のアプリではここで本の情報を更新するAPI呼び出しなどを行う
    // updateBookInfo(updatedBook);
    
    // 選択中の本を更新
    setSelectedBook(updatedBook);
    
    // モーダルを閉じる
    handleCloseCompletionModal();
    
    // 成功メッセージ表示
    Alert.alert("保存しました", "読書の記録を保存しました。");
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    setSeconds(0);
    startTimeRef.current = null;
    startPageRef.current = null;
    
    // ここで実際にはセッション情報をストアに保存するなどの処理を行う
    console.log('読書セッション完了:', currentSession);
  };

  // 時間のフォーマット変換（秒数 → 時:分:秒）表示用
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}時間${minutes}分${seconds}秒`;
    } else if (minutes > 0) {
      return `${minutes}分${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  // 読書の進捗率を計算
  const calculateProgress = (): number => {
    if (!selectedBook?.currentPage || !selectedBook?.totalPages || selectedBook.totalPages === 0) {
      return 0;
    }
    return Math.min(100, Math.round((selectedBook.currentPage / selectedBook.totalPages) * 100));
  };

  // 読書中に読んだページ数を計算
  const calculateReadPages = (): number => {
    if (!currentSession?.startPage || !currentSession?.endPage) {
      return 0;
    }
    return currentSession.endPage - currentSession.startPage;
  };

  // モーダルでのページ入力処理
  const validateAndUpdateModalCurrentPage = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      if (modalTotalPages && numValue > modalTotalPages) {
        setModalCurrentPage(modalTotalPages);
      } else {
        setModalCurrentPage(numValue);
      }
    } else if (value === '') {
      setModalCurrentPage(0);
    }
  };

  const validateAndUpdateModalTotalPages = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setModalTotalPages(numValue);
      if (modalCurrentPage && modalCurrentPage > numValue) {
        setModalCurrentPage(numValue);
      }
    } else if (value === '') {
      setModalTotalPages(0);
    }
  };

  // モーダル用の進捗率計算
  const calculateModalProgress = (): number => {
    if (!modalCurrentPage || !modalTotalPages || modalTotalPages === 0) {
      return 0;
    }
    return Math.min(100, Math.round((modalCurrentPage / modalTotalPages) * 100));
  };

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title="読書タイマー" />

      <View style={styles.content}>
        {/* タイマーコンポーネント */}
        <ReadingTimer 
          book={selectedBook}
          seconds={seconds}
          isRunning={isTimerRunning}
          onToggle={handleToggleTimer}
          onReset={handleResetTimer}
          onFinish={handleFinishReading}
        />

        {/* ページ入力コンポーネント */}
        {selectedBook && (
          <View style={styles.pageInputContainer}>
            <PageInput
              currentPage={selectedBook.currentPage}
              totalPages={selectedBook.totalPages}
              onCurrentPageChange={handleCurrentPageChange}
              onTotalPagesChange={handleTotalPagesChange}
            />
          </View>
        )}

        {/* 読書中の本選択コンポーネント */}
        <BookSelector 
          books={READING_BOOKS}
          selectedBookId={selectedBook?.id || null}
          onSelectBook={handleSelectBook}
        />
      </View>

      {/* 読書完了モーダル */}
      {showCompletionModal && currentSession && selectedBook && (
        <Modal
          visible={showCompletionModal}
          onClose={handleCloseCompletionModal}
          title="読書完了！"
        >
          <View style={styles.modalContent}>
            <Typography variant="body" style={styles.modalText}>
              読書お疲れ様でした！
            </Typography>
            
            {/* 本の情報エリア - カバー画像と詳細を横並びに */}
            <View style={styles.bookInfoContainer}>
              {selectedBook.coverImage && (
                <Image 
                  source={{ uri: selectedBook.coverImage }} 
                  style={styles.modalCoverImage}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.bookDetailsContainer}>
                <Typography variant="body" style={styles.infoLabel}>本のタイトル:</Typography>
                <Typography variant="body" style={styles.infoValue} numberOfLines={2}>
                  {selectedBook.title}
                </Typography>
                
                <Typography variant="body" style={styles.infoLabel}>著者:</Typography>
                <Typography variant="body" style={styles.infoValue} numberOfLines={1}>
                  {selectedBook.author}
                </Typography>
              </View>
            </View>
            
            {/* セッション情報 */}
            <View style={styles.sessionInfo}>
              <View style={styles.sessionRow}>
                <View style={styles.sessionColumn}>
                  <Typography variant="body" style={styles.infoLabel}>読書時間:</Typography>
                  <Typography variant="body" style={styles.infoValue}>
                    {formatTime(currentSession.duration)}
                  </Typography>
                </View>
                
                {currentSession.startPage !== undefined && currentSession.endPage !== undefined && (
                  <View style={styles.sessionColumn}>
                    <Typography variant="body" style={styles.infoLabel}>読了ページ:</Typography>
                    <Typography variant="body" style={styles.infoValue}>
                      {calculateReadPages()}ページ
                    </Typography>
                  </View>
                )}
              </View>
            </View>
            
            {/* ページ数入力エリア */}
            <View style={styles.modalPageInputContainer}>
              <Typography variant="body" style={[styles.infoLabel, styles.pageInputLabel]}>
                ページ数を更新:
              </Typography>
              
              <View style={styles.modalInputRow}>
                <View style={styles.modalInputGroup}>
                  <Typography variant="caption" style={styles.modalInputLabel}>
                    現在のページ
                  </Typography>
                  <TextInput
                    style={styles.modalInput}
                    value={modalCurrentPage?.toString() || ''}
                    onChangeText={validateAndUpdateModalCurrentPage}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="0"
                    maxLength={5}
                  />
                </View>

                <Typography variant="body" style={styles.modalSeparator}>
                  /
                </Typography>

                <View style={styles.modalInputGroup}>
                  <Typography variant="caption" style={styles.modalInputLabel}>
                    全ページ数
                  </Typography>
                  <TextInput
                    style={styles.modalInput}
                    value={modalTotalPages?.toString() || ''}
                    onChangeText={validateAndUpdateModalTotalPages}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="0"
                    maxLength={5}
                  />
                </View>
              </View>
              
              <View style={styles.modalProgressContainer}>
                <ProgressBar progress={calculateModalProgress()} />
              </View>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <Button
                title="キャンセル"
                onPress={handleCloseCompletionModal}
                variant="outline"
                style={styles.modalCancelButton}
              />
              <Button
                title="保存"
                onPress={handleSaveSession}
                style={styles.modalSaveButton}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  pageInputContainer: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  modalContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  modalText: {
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
  },
  coverImageContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  modalCoverImage: {
    width: 80,
    height: 110,
    borderRadius: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionInfo: {
    marginBottom: spacing.sm,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingBottom: spacing.sm,
  },
  sessionColumn: {
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  infoValue: {
    marginBottom: spacing.xs,
    fontSize: typography.fontSize.sm,
  },
  modalProgressContainer: {
    marginVertical: spacing.xs,
  },
  modalPageInputContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  pageInputLabel: {
    marginBottom: spacing.xs,
    fontSize: typography.fontSize.sm,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  modalInputGroup: {
    alignItems: 'center',
  },
  modalInputLabel: {
    marginBottom: spacing.xs,
    color: colors.gray[600],
    fontSize: typography.fontSize.xs,
  },
  modalInput: {
    width: 60,
    height: 35,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.xs,
    textAlign: 'center',
    padding: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray[800],
  },
  modalSeparator: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.lg,
    color: colors.gray[500],
  },
  modalButtonContainer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    marginRight: spacing.xs,
  },
  modalSaveButton: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  bookInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingBottom: spacing.sm,
  },
  bookDetailsContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
}); 