import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '../Typography';
import { Button } from './Button';
import { Book } from '../../lib/types';
import { RootState } from '../../lib/store';
import TimerService, { formatTime } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';

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

  if (!book) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Typography variant="body" style={[styles.selectPrompt, { color: colors.textSecondary }]}>
          本を選択してください
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
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
          title={isRunning ? "一時停止" : "開始"}
          variant="primary"
          size="medium"
          style={styles.mainButton}
        />
        <Button
          onPress={handleResetTimer}
          title="リセット"
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
            title="読書終了"
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