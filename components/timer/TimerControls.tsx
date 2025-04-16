import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../common/Button';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface TimerControlsProps {
  isRunning: boolean;
  hasElapsedTime: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFinish: () => void;
  compact?: boolean;
}

/**
 * タイマー操作用のコントロールコンポーネント
 * 開始/一時停止、リセット、読書完了ボタンを表示
 */
export function TimerControls({
  isRunning,
  hasElapsedTime,
  onStart,
  onPause,
  onReset,
  onFinish,
  compact = false,
}: TimerControlsProps) {
  const { t } = useAppTranslation();
  const { spacing } = useTheme();
  
  // タイマー開始/停止ボタンの処理
  const handleToggleTimer = () => {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };
  
  return (
    <View style={styles.controlsSection}>
      <Button
        onPress={handleToggleTimer}
        title={isRunning ? t('timer.pause') : t('timer.start')}
        variant="primary"
        size={compact ? "medium" : "large"}
        style={styles.mainButton}
      />
      <Button
        onPress={onReset}
        title={t('timer.reset')}
        variant="outline"
        size={compact ? "medium" : "large"}
        style={styles.secondaryButton}
      />
      
      {/* 読書終了ボタン（タイマーが一時停止で、かつ0秒より大きい場合のみ表示） */}
      {!isRunning && hasElapsedTime && (
        <Button
          onPress={onFinish}
          title={t('timer.finishReading')}
          variant="secondary"
          size={compact ? "medium" : "large"}
          style={styles.finishButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 