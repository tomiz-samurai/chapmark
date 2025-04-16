import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Typography } from '../Typography';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { Book } from '../../types/models';

interface PageProgressProps {
  book: Book;
  onCurrentPageChange: (page: number) => void;
  onTotalPagesChange: (pages: number) => void;
}

/**
 * ページ進捗入力コンポーネント
 * 現在のページと総ページ数を入力・表示する
 */
export function PageProgress({
  book,
  onCurrentPageChange,
  onTotalPagesChange,
}: PageProgressProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();
  
  // 現在のページ入力処理
  const handleCurrentPageChange = (text: string) => {
    const page = parseInt(text, 10);
    if (!isNaN(page)) {
      onCurrentPageChange(page);
    }
  };
  
  // 総ページ数入力処理
  const handleTotalPagesChange = (text: string) => {
    const pages = parseInt(text, 10);
    if (!isNaN(pages)) {
      onTotalPagesChange(pages);
    }
  };
  
  return (
    <View style={[styles.pageProgressContainer, { backgroundColor: colors.card }]}>
      <View style={styles.pageInputSection}>
        <Typography variant="body" style={[styles.progressTitle, { color: colors.text }]}>
          {t('timer.pageProgress')}
        </Typography>
        
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12 }}>
              {t('timer.current')}
            </Typography>
            <TextInput
              style={[styles.pageInput, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }]}
              value={book.currentPage?.toString()}
              onChangeText={handleCurrentPageChange}
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder="0"
            />
          </View>
          
          <Typography style={{ color: colors.textSecondary, marginHorizontal: 8 }}>
            /
          </Typography>
          
          <View style={styles.inputWrapper}>
            <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12 }}>
              {t('timer.total')}
            </Typography>
            <TextInput
              style={[styles.pageInput, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }]}
              value={book.totalPages?.toString()}
              onChangeText={handleTotalPagesChange}
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder="0"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageProgressContainer: {
    padding: 12,
    borderRadius: 16,
    marginTop: 12,
  },
  pageInputSection: {
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    alignItems: 'center',
  },
  pageInput: {
    width: 80,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 16,
  },
}); 