import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { ReadingTimer } from '../../components/common/ReadingTimer';
import { BookSelector } from '../../components/common/BookSelector';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../constants/theme';
import { Book, ReadingSession } from '../../lib/types';

// ダミーデータ（実際の実装では本のリストはストアまたはAPIから取得）
const READING_BOOKS: Book[] = [
  {
    id: '1',
    title: 'エッセンシャル思考',
    author: 'グレッグ・マキューン',
    status: 'reading',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
  },
  {
    id: '4',
    title: 'アトミック・ハビット',
    author: 'ジェームズ・クリアー',
    status: 'reading',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1798&ixlib=rb-4.0.3',
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

  // タイマー制御
  useEffect(() => {
    if (isTimerRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = new Date();
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
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setIsTimerRunning(false);
    setSeconds(0);
    startTimeRef.current = null;
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
    };
    
    setCurrentSession(newSession);
    setShowCompletionModal(true);
    
    // リセット
    setIsTimerRunning(false);
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    setSeconds(0);
    startTimeRef.current = null;
    
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

        {/* 読書中の本選択コンポーネント */}
        <BookSelector 
          books={READING_BOOKS}
          selectedBookId={selectedBook?.id || null}
          onSelectBook={handleSelectBook}
        />
      </View>

      {/* 読書完了モーダル */}
      {showCompletionModal && currentSession && (
        <Modal
          visible={showCompletionModal}
          onClose={handleCloseCompletionModal}
          title="読書完了！"
        >
          <View style={styles.modalContent}>
            <Typography variant="body" style={styles.modalText}>
              読書お疲れ様でした！
            </Typography>
            
            <View style={styles.sessionInfo}>
              <Typography variant="body" style={styles.infoLabel}>本のタイトル:</Typography>
              <Typography variant="body" style={styles.infoValue}>
                {selectedBook?.title}
              </Typography>
              
              <Typography variant="body" style={styles.infoLabel}>著者:</Typography>
              <Typography variant="body" style={styles.infoValue}>
                {selectedBook?.author}
              </Typography>
              
              <Typography variant="body" style={styles.infoLabel}>読書時間:</Typography>
              <Typography variant="body" style={styles.infoValue}>
                {formatTime(currentSession.duration)}
              </Typography>
            </View>
            
            <Button
              title="閉じる"
              onPress={handleCloseCompletionModal}
              style={styles.modalButton}
            />
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
  modalContent: {
    padding: spacing.md,
  },
  modalText: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sessionInfo: {
    marginVertical: spacing.md,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  infoValue: {
    marginBottom: spacing.sm,
  },
  modalButton: {
    marginTop: spacing.md,
  },
}); 