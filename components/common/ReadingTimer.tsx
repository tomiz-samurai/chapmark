import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { Button } from './Button';
import { Book } from '../../types/models/book';
import TimerService, { formatTime } from '../../lib/services/TimerService';
import { useTheme } from '../../lib/hooks/useTheme';
import { BookIcon } from 'lucide-react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { GoalTimeSelector } from './GoalTimeSelector';
import { useAppSelector } from '../../lib/hooks/useAppSelector';
import { useAppDispatch } from '../../lib/hooks/useAppDispatch';

interface ReadingTimerProps {
  book: Book | null;
  onFinish?: () => void;
  goalTime?: number | null;
  onSetGoalTime?: (seconds: number) => void;
  compact?: boolean;
}

export function ReadingTimer({ 
  book, 
  onFinish,
  goalTime,
  onSetGoalTime,
  compact = false
}: ReadingTimerProps) {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector(state => state.timer);
  const { isRunning, displaySeconds, goalReached } = timerState;
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  // アニメーション値
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  // タイマー開始/停止時のアニメーション
  useEffect(() => {
    if (isRunning) {
      // タイマー開始時のアニメーション
      scale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    } else {
      // タイマー停止時のアニメーション
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isRunning]);
  
  // ゴール達成時のアニメーション
  useEffect(() => {
    if (goalReached) {
      // ゴール達成時のアニメーション
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      scale.value = withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.exp) }),
        withTiming(1, { duration: 300 }),
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
      
      rotation.value = withSequence(
        withTiming(-0.05, { duration: 150 }),
        withTiming(0.05, { duration: 300 }),
        withTiming(0, { duration: 150 })
      );
    }
  }, [goalReached]);
  
  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}rad` }
      ],
      opacity: opacity.value,
    };
  });

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

  // 目標時間の設定
  const handleGoalTimeSelect = (seconds: number) => {
    if (onSetGoalTime) {
      onSetGoalTime(seconds);
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
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        padding: compact ? 16 : 24,
        marginVertical: compact ? 8 : 16 
      }
    ]}>
      <View style={styles.timerLayout}>
        {/* 本のカバー画像 - compact モードでは非表示 */}
        {!compact && (
          <View style={styles.coverContainer}>
            <Image
              source={getCoverSource()}
              style={styles.coverImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* タイマー表示部分 */}
        <Animated.View style={[styles.timerSection, animatedStyle]}>
          <Typography 
            variant="display" 
            style={[
              styles.timerText, 
              { 
                color: goalReached 
                  ? colors.success || colors.secondary
                  : colors.secondary,
                fontSize: compact ? 48 : 60
              }
            ]}
          >
            {formatTime(displaySeconds)}
          </Typography>
          
          {/* 目標時間表示（設定されている場合） */}
          {goalTime && (
            <Typography 
              variant="caption" 
              style={[styles.goalText, { color: colors.textSecondary }]}
            >
              {t('timer.goalTime')}: {formatTime(goalTime)}
            </Typography>
          )}
        </Animated.View>
        
        {/* 目標時間セレクター */}
        {onSetGoalTime && (
          <GoalTimeSelector
            currentGoalTime={goalTime || null}
            onSelectGoalTime={handleGoalTimeSelect}
            disabled={isRunning}
            compact={compact}
          />
        )}
      </View>

      {/* コントロールボタン部分 */}
      <View style={styles.controlsSection}>
        <Button
          onPress={handleToggleTimer}
          title={isRunning ? t('timer.pause') : t('timer.start')}
          variant="primary"
          size={compact ? "medium" : "large"}
          style={styles.mainButton}
        />
        <Button
          onPress={handleResetTimer}
          title={t('timer.reset')}
          variant="outline"
          size={compact ? "medium" : "large"}
          style={styles.secondaryButton}
        />
        
        {/* 読書終了ボタン（タイマーが一時停止で、かつ0秒より大きい場合のみ表示） */}
        {!isRunning && displaySeconds > 0 && (
          <Button
            onPress={handleFinishReading}
            title={t('timer.finishReading')}
            variant="secondary"
            size={compact ? "medium" : "large"}
            style={styles.finishButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    width: '100%',
  },
  emptyContainer: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  timerLayout: {
    marginBottom: 20,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImageCompact: {
    width: 70,
    height: 105,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontWeight: '300',
    letterSpacing: 2,
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  mainButton: {
    flex: 1,
    marginRight: 8,
    marginBottom: 10,
    borderRadius: 12,
  },
  secondaryButton: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 10,
    borderRadius: 12,
  },
  finishButton: {
    width: '100%',
    marginTop: 6,
    borderRadius: 12,
  },
  selectPrompt: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  goalText: {
    marginTop: 8,
    fontSize: 14,
  },
}); 