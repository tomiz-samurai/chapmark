import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '../Typography';
import { Button } from './Button';
import { Book } from '../../lib/types';
import { RootState } from '../../lib/store';
import TimerService, { formatTime } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';
import { BookIcon } from 'lucide-react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface ReadingTimerProps {
  book: Book | null;
  onFinish?: () => void;
}

export function ReadingTimer({ 
  book, 
  onFinish
}: ReadingTimerProps) {
  const dispatch = useDispatch();
  const { isRunning, displaySeconds } = useSelector((state: RootState) => (state as any).timer);
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  // コンポーネントのアンマウント時にタイマーリソースをクリーンアップ
  useEffect(() => {
    return () => {
      // コンポーネントのアンマウント時にタイマーのクリーンアップを実行
      TimerService.cleanup();
    };
  }, []);

  // タイマーの開始/一時停止を切り替え
  const handleToggleTimer = () => {
    if (!book) return;
    
    if (isRunning) {
      TimerService.pauseTimer();
    } else {
      if (book.id) {
        TimerService.startTimer(book.id, book.currentPage);
      }
    }
  };

  // タイマーのリセット
  const handleResetTimer = () => {
    TimerService.resetTimer();
  };

  // 読書セッションの完了
  const handleFinishReading = () => {
    if (!book) return;
    
    // 読書セッションを完了し、必要に応じてページ情報を渡す
    TimerService.completeReading(book.currentPage);
    
    // onFinishコールバックがあれば呼び出す（モーダル表示など）
    if (onFinish) {
      onFinish();
    }
  };

  // 安全で確実に表示できる画像URL
  const defaultBookCover = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
  
  // カバー画像を取得する関数
  const getCoverSource = () => {
    if (!book) return { uri: defaultBookCover };
    
    if (book.coverImage) {
      return { uri: book.coverImage };
    } else if (book.coverUrl) {
      return { uri: book.coverUrl };
    }
    
    return { uri: defaultBookCover };
  };

  if (!book) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Typography variant="body" style={[styles.selectPrompt, { color: colors.textSecondary }]}>
          {t('timer.pleaseSelectBook')}
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* 本のカバー画像 */}
      <View style={styles.coverContainer}>
        <Image
          source={getCoverSource()}
          style={styles.coverImage}
          resizeMode="contain"
        />
      </View>

      {/* タイマー表示部分 */}
      <View style={styles.timerSection}>
        <Typography variant="display" style={[styles.timerText, { color: colors.secondary }]}>
          {formatTime(displaySeconds)}
        </Typography>
      </View>

      {/* コントロールボタン部分 */}
      <View style={styles.controlsSection}>
        <Button
          onPress={handleToggleTimer}
          title={isRunning ? t('timer.pause') : t('timer.start')}
          variant="primary"
          size="medium"
          style={styles.mainButton}
        />
        <Button
          onPress={handleResetTimer}
          title={t('timer.reset')}
          variant="outline"
          size="medium"
          style={styles.secondaryButton}
        />
      </View>
      
      {/* 読書終了ボタン（タイマーが一時停止で、かつ0秒より大きい場合のみ表示） */}
      {!isRunning && displaySeconds > 0 && (
        <View style={styles.finishSection}>
          <Button
            onPress={handleFinishReading}
            title={t('timer.finishReading')}
            variant="secondary"
            size="medium"
            style={styles.finishButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginVertical: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coverImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '300',
    letterSpacing: 2,
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mainButton: {
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1,
    marginLeft: 8,
  },
  finishSection: {
    marginTop: 8,
  },
  finishButton: {
    width: '100%',
  },
  selectPrompt: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 