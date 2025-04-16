import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '../Typography';
import { Button } from '../common/Button';
import { colors, spacing, typography } from '../../constants/theme';
import { addQuote } from '../../lib/store/quoteSlice';
import { RootState } from '../../lib/store';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useTheme } from '../../lib/hooks/useTheme';

interface QuoteInputProps {
  bookId: string;
  onSave?: () => void;
  initialQuote?: {
    text: string;
    insight: string;
    pageNumber?: number;
    chapter?: string;
  };
}

export const QuoteInput = ({ bookId, onSave, initialQuote }: QuoteInputProps) => {
  const dispatch = useDispatch();
  const { t } = useAppTranslation();
  const { colors } = useTheme();
  const book = useSelector((state: RootState) => {
    const books = (state as any).book?.books || [];
    return books.find((b: any) => b.id === bookId);
  });

  // 状態管理
  const [quoteText, setQuoteText] = useState(initialQuote?.text || '');
  const [insight, setInsight] = useState(initialQuote?.insight || '');
  const [pageNumber, setPageNumber] = useState(
    initialQuote?.pageNumber?.toString() || ''
  );
  const [chapter, setChapter] = useState(initialQuote?.chapter || '');
  const [isPublic, setIsPublic] = useState(true);
  
  // 文字数カウント
  const quoteCharCount = quoteText.length;
  const insightCharCount = insight.length;
  
  // 文字数制限
  const QUOTE_MAX_LENGTH = 200;
  const INSIGHT_MAX_LENGTH = 150;
  
  // 保存可能かどうかのバリデーション
  const canSave = quoteText.trim().length > 0;
  
  // ページ番号の検証処理
  const validatePageNumber = (text: string) => {
    // 数値のみ受け付ける
    if (text === '' || /^\d+$/.test(text)) {
      setPageNumber(text);
    }
  };
  
  // 保存ハンドラー
  const handleSave = () => {
    if (!canSave) return;
    
    const quoteData = {
      bookId,
      text: quoteText.trim(),
      insight: insight.trim() || undefined,
      pageNumber: pageNumber ? parseInt(pageNumber, 10) : undefined,
      chapter: chapter.trim() || undefined,
      isPublic
    };
    
    dispatch(addQuote(quoteData));
    
    // 保存後のコールバック
    if (onSave) {
      onSave();
    }
    
    // フォームをリセット（必要に応じて）
    if (!initialQuote) {
      setQuoteText('');
      setInsight('');
      setPageNumber('');
      setChapter('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {book && (
        <View style={[styles.bookInfo, { borderBottomColor: colors.border }]}>
          <Typography variant="subtitle" style={{ color: colors.text, fontWeight: 'bold' }}>
            {book.title}
          </Typography>
          <Typography variant="caption" style={{ color: colors.textSecondary }}>
            {book.author}
          </Typography>
        </View>
      )}
      
      <View style={styles.formGroup}>
        <View style={styles.labelContainer}>
          <Typography variant="caption" style={[styles.label, { color: colors.text }]}>
            {t('book.quoteText')}
          </Typography>
          <Typography 
            variant="caption" 
            style={[
              styles.counter, 
              quoteCharCount > QUOTE_MAX_LENGTH ? { color: colors.error } : { color: colors.textSecondary }
            ]}
          >
            {quoteCharCount}/{QUOTE_MAX_LENGTH}
          </Typography>
        </View>
        
        <TextInput
          style={[styles.textArea, { 
            borderColor: colors.border, 
            color: colors.text,
            backgroundColor: colors.background
          }]}
          multiline
          value={quoteText}
          onChangeText={setQuoteText}
          placeholder={t('book.quotePlaceholder')}
          maxLength={QUOTE_MAX_LENGTH + 10} // 少し余裕を持たせる
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <View style={styles.labelContainer}>
          <Typography variant="caption" style={[styles.label, { color: colors.text }]}>
            {t('book.quoteInsight')}
          </Typography>
          <Typography 
            variant="caption" 
            style={[
              styles.counter, 
              insightCharCount > INSIGHT_MAX_LENGTH ? { color: colors.error } : { color: colors.textSecondary }
            ]}
          >
            {insightCharCount}/{INSIGHT_MAX_LENGTH}
          </Typography>
        </View>
        
        <TextInput
          style={[styles.textArea, { 
            borderColor: colors.border, 
            color: colors.text,
            backgroundColor: colors.background
          }]}
          multiline
          value={insight}
          onChangeText={setInsight}
          placeholder={t('book.insightPlaceholder')}
          maxLength={INSIGHT_MAX_LENGTH + 10} // 少し余裕を持たせる
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <View style={styles.row}>
        <View style={styles.formGroupHalf}>
          <Typography variant="caption" style={[styles.label, { color: colors.text }]}>
            {t('timer.page')}
          </Typography>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              color: colors.text,
              backgroundColor: colors.background
            }]}
            value={pageNumber}
            onChangeText={validatePageNumber}
            placeholder={t('book.pagePlaceholder')}
            keyboardType="number-pad"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.formGroupHalf}>
          <Typography variant="caption" style={[styles.label, { color: colors.text }]}>
            {t('book.chapterSection')}
          </Typography>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              color: colors.text,
              backgroundColor: colors.background
            }]}
            value={chapter}
            onChangeText={setChapter}
            placeholder={t('book.chapterPlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>
      
      <View style={styles.visibilityContainer}>
        <Typography variant="caption" style={[styles.label, { color: colors.text }]}>
          {t('book.visibilitySettings')}
        </Typography>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isPublic ? [styles.toggleButtonActive, { backgroundColor: colors.primary }] : null
            ]}
            onPress={() => setIsPublic(true)}
          >
            <Typography 
              variant="caption" 
              style={{ color: isPublic ? colors.neutralLight : colors.textSecondary }}
            >
              {t('book.public')}
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isPublic ? [styles.toggleButtonActive, { backgroundColor: colors.primary }] : null
            ]}
            onPress={() => setIsPublic(false)}
          >
            <Typography 
              variant="caption" 
              style={{ color: !isPublic ? colors.neutralLight : colors.textSecondary }}
            >
              {t('book.private')}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
        title={'common.post'}
        variant="primary"
        onPress={handleSave}
        disabled={!canSave}
        style={styles.saveButton}
        isTranslationKey={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
  },
  bookInfo: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  bookTitle: {
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  bookAuthor: {
    color: colors.gray[600],
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formGroupHalf: {
    flex: 1,
    marginBottom: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.gray[700],
    fontWeight: '500',
  },
  counter: {
    color: colors.gray[500],
    fontSize: typography.fontSize.xs,
  },
  counterError: {
    color: colors.accent.error,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.xs,
    padding: spacing.sm,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: typography.fontSize.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.xs,
    padding: spacing.sm,
    fontSize: typography.fontSize.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  visibilityContainer: {
    marginBottom: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  toggleButton: {
    backgroundColor: colors.gray[100],
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.xs,
    marginRight: spacing.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary.light,
  },
  toggleText: {
    color: colors.gray[600],
  },
  toggleTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: spacing.sm,
  },
}); 