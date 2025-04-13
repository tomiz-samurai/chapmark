import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors, spacing } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-100の値
  height?: number;
  showPercentage?: boolean;
  colorFill?: string;
  colorTrack?: string;
  style?: any;
}

export function ProgressBar({
  progress,
  height = 6,
  showPercentage = true,
  colorFill = colors.accent.main,
  colorTrack = colors.gray[200],
  style,
}: ProgressBarProps) {
  // 0-100の範囲に収める
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.track, 
          { 
            height, 
            backgroundColor: colorTrack 
          }
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${safeProgress}%`,
              height: '100%',
              backgroundColor: colorFill,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Typography variant="caption" style={styles.progressText}>
          {safeProgress}% 完了
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 3,
  },
  progressText: {
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.gray[600],
  },
}); 