import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Typography } from '../Typography';
import { Button } from './Button';
import { colors, spacing } from '../../constants/theme';
import { Book } from '../../lib/types';

interface ReadingTimerProps {
  book: Book | null;
  seconds: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function ReadingTimer({ 
  book, 
  seconds,
  isRunning,
  onToggle,
  onReset
}: ReadingTimerProps) {
  
  // タイマーのフォーマット変換（秒数 → 時:分:秒）
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <View style={styles.timerContainer}>
      <Typography variant="display" style={styles.timerText}>
        {formatTime(seconds)}
      </Typography>

      {book ? (
        <View style={styles.selectedBookContainer}>
          {book.coverImage && (
            <Image 
              source={{ uri: book.coverImage }} 
              style={styles.coverThumbnail} 
            />
          )}
          <View style={styles.bookInfo}>
            <Typography variant="body" style={styles.bookTitle}>
              {book.title}
            </Typography>
            <Typography variant="caption" style={styles.bookAuthor}>
              {book.author}
            </Typography>
          </View>
        </View>
      ) : (
        <Typography variant="body" style={styles.selectPrompt}>
          本を選択してください
        </Typography>
      )}

      <View style={styles.controls}>
        {book && (
          <>
            <Button
              onPress={onToggle}
              title={isRunning ? "一時停止" : "開始"}
              variant="primary"
              size="large"
              style={styles.controlButton}
            />
            <Button
              onPress={onReset}
              title="リセット"
              variant="outline"
              size="large"
              style={styles.controlButton}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: 48,
    textAlign: 'center',
    marginVertical: spacing.md,
    color: colors.primary.main,
  },
  selectedBookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  coverThumbnail: {
    width: 50,
    height: 70,
    borderRadius: spacing.xs,
  },
  bookInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  bookTitle: {
    color: colors.gray[800],
    fontWeight: 'bold',
  },
  bookAuthor: {
    color: colors.gray[600],
  },
  selectPrompt: {
    color: colors.gray[600],
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  controlButton: {
    marginHorizontal: spacing.sm,
    minWidth: 120,
  },
}); 