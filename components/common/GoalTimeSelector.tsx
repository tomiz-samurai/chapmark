import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { useTheme } from '../../lib/hooks/useTheme';
import { Clock } from 'lucide-react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import * as Haptics from 'expo-haptics';

interface GoalTimeSelectorProps {
  onSelectGoalTime: (time: number) => void;
  currentGoalTime: number | null;
  disabled?: boolean;
  compact?: boolean;
}

const PRESET_TIMES = [
  { label: 'timer.time15min', value: 15 * 60 },
  { label: 'timer.time30min', value: 30 * 60 },
  { label: 'timer.time1hour', value: 60 * 60 },
  { label: 'timer.time2hours', value: 120 * 60 },
];

export function GoalTimeSelector({ 
  onSelectGoalTime, 
  currentGoalTime,
  disabled = false,
  compact = false
}: GoalTimeSelectorProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  const handlePress = (time: number) => {
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectGoalTime(time);
  };

  return (
    <View style={[
      styles.container, 
      compact && styles.containerCompact
    ]}>
      <View style={styles.labelContainer}>
        <Clock size={compact ? 14 : 16} color={colors.textSecondary} />
        <Typography 
          variant="body" 
          style={[
            styles.label, 
            { color: colors.textSecondary },
            compact && styles.labelCompact
          ]}
        >
          {t('timer.targetTime')}
        </Typography>
      </View>
      
      <View style={styles.buttonContainer}>
        {PRESET_TIMES.map((time) => (
          <TouchableOpacity
            key={time.value}
            style={[
              styles.timeButton,
              compact && styles.timeButtonCompact,
              { 
                backgroundColor: currentGoalTime === time.value 
                  ? colors.secondary 
                  : colors.neutralLight,
                borderColor: currentGoalTime === time.value 
                  ? colors.secondary 
                  : colors.border,
                opacity: disabled ? 0.6 : 1
              }
            ]}
            onPress={() => handlePress(time.value)}
            disabled={disabled}
          >
            <Typography 
              variant="body" 
              style={[
                styles.timeText, 
                compact && styles.timeTextCompact,
                { 
                  color: currentGoalTime === time.value 
                    ? colors.primary
                    : colors.text 
                }
              ]}
            >
              {t(time.label)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  containerCompact: {
    marginVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
  },
  labelCompact: {
    fontSize: 12,
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
    marginHorizontal: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  timeButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
    marginHorizontal: 2,
    minWidth: 68,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 14,
  },
  timeTextCompact: {
    fontSize: 12,
  },
}); 