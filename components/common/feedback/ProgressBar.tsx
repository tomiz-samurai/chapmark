import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  style?: object;
  showPercentage?: boolean;
  backgroundColor?: string;
  progressColor?: string;
  animated?: boolean;
  animationDuration?: number;
}

export function ProgressBar({
  progress,
  height = 8,
  style,
  showPercentage = false,
  backgroundColor = colors.gray[200],
  progressColor = colors.primary.main,
  animated = true,
  animationDuration = 500,
}: ProgressBarProps) {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Animation value for the width
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: normalizedProgress,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(normalizedProgress);
    }
  }, [normalizedProgress, animated, animationDuration, progressAnim]);
  
  // Calculate percentage for display
  const percentage = Math.round(normalizedProgress * 100);
  
  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.progressBackground, 
          { 
            height, 
            backgroundColor 
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.progressFill, 
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              height,
              backgroundColor: progressColor 
            }
          ]}
        />
      </View>
      
      {showPercentage && (
        <Text style={styles.percentageText}>{percentage}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  progressBackground: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  percentageText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    textAlign: 'right',
  },
}); 