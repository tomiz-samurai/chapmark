import React from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import { Typography } from '../Typography';
import { ProgressBar } from './ProgressBar';
import { colors, spacing, typography } from '../../constants/theme';

interface PageInputProps {
  currentPage: number | undefined;
  totalPages: number | undefined;
  onCurrentPageChange: (page: number) => void;
  onTotalPagesChange: (pages: number) => void;
}

export function PageInput({
  currentPage,
  totalPages,
  onCurrentPageChange,
  onTotalPagesChange,
}: PageInputProps) {
  // 入力値をバリデーションして数値に変換
  const validateAndUpdateCurrentPage = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      // 全ページより大きい値は入力できないようにする
      if (totalPages && numValue > totalPages) {
        onCurrentPageChange(totalPages);
      } else {
        onCurrentPageChange(numValue);
      }
    } else if (value === '') {
      // 空の場合はundefinedとして扱う
      onCurrentPageChange(0);
    }
  };

  const validateAndUpdateTotalPages = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onTotalPagesChange(numValue);
      // 現在のページが全ページを超えている場合は調整
      if (currentPage && currentPage > numValue) {
        onCurrentPageChange(numValue);
      }
    } else if (value === '') {
      // 空の場合はundefinedとして扱う
      onTotalPagesChange(0);
    }
  };

  // 進捗率の計算
  const calculateProgress = (): number => {
    if (!currentPage || !totalPages || totalPages === 0) return 0;
    return Math.min(100, Math.round((currentPage / totalPages) * 100));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Typography variant="body" style={styles.label}>
            現在のページ
          </Typography>
          <TextInput
            style={styles.input}
            value={currentPage?.toString() || ''}
            onChangeText={validateAndUpdateCurrentPage}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="0"
            maxLength={5}
          />
        </View>

        <Typography variant="body" style={styles.separator}>
          /
        </Typography>

        <View style={styles.inputGroup}>
          <Typography variant="body" style={styles.label}>
            全ページ数
          </Typography>
          <TextInput
            style={styles.input}
            value={totalPages?.toString() || ''}
            onChangeText={validateAndUpdateTotalPages}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="0"
            maxLength={5}
          />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={calculateProgress()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    alignItems: 'center',
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.gray[600],
    fontSize: typography.fontSize.sm,
  },
  input: {
    width: 70,
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.xs,
    textAlign: 'center',
    padding: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.gray[800],
  },
  separator: {
    marginHorizontal: spacing.md,
    fontSize: 20,
    color: colors.gray[500],
  },
  progressContainer: {
    marginTop: spacing.md,
  },
}); 