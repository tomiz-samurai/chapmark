import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Typography } from '../../../components/Typography';
import { useTheme } from '../../../lib/hooks/useTheme';

interface ProgressBarProps {
  progress: number; // 0から100の値
  height?: number;
  style?: any;
  showPercentage?: boolean;
  backgroundColor?: string;
  progressColor?: string;
  animated?: boolean;
  animationDuration?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  style,
  showPercentage = false,
  backgroundColor,
  progressColor,
  animated = true,
  animationDuration = 500,
}) => {
  const { colors } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  // progressが変更されたときにアニメーションを実行
  useEffect(() => {
    // 値を0〜100から0〜1の範囲に変換
    const normalizedProgress = progress / 100;
    const clampedProgress = Math.min(Math.max(normalizedProgress, 0), 1);
    
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [progress, animated, animationDuration]);

  return (
    <View 
      style={[
        styles.container, 
        style,
        { 
          height, 
          backgroundColor: backgroundColor || colors.background,
          borderRadius: height / 2,
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.progress,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            height,
            backgroundColor: progressColor || colors.secondary,
            borderRadius: height / 2,
          }
        ]}
      />
      {showPercentage && (
        <Typography variant="caption" style={styles.progressText}>
          {progress}%
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    position: 'absolute',
    right: 8,
  },
}); 