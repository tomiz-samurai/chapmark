import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '../Typography';
import { Button } from '../common/Button';
import { colors, spacing, typography } from '../../constants/theme';
import { addNote } from '../../lib/store/noteSlice';
import { RootState } from '../../lib/store';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useTheme } from '../../lib/hooks/useTheme';

interface NoteInputProps {
  bookId: string;
  onSave?: () => void;
  initialNote?: {
    content: string;
    pageNumber?: number;
    tags?: string[];
  };
}

export const NoteInput = ({ bookId, onSave, initialNote }: NoteInputProps) => {
  const dispatch = useDispatch();
  const { t } = useAppTranslation();
  const { colors } = useTheme();
  const book = useSelector((state: RootState) => {
    const books = (state as any).book?.books || [];
    return books.find((b: any) => b.id === bookId);
  });

  // 状態管理
  const [content, setContent] = useState(initialNote?.content || '');
  const [pageNumber, setPageNumber] = useState(
    initialNote?.pageNumber?.toString() || ''
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);
  
  // 保存可能かどうかのバリデーション
  const canSave = content.trim().length > 0;
  
  // ページ番号の検証処理
  const validatePageNumber = (text: string) => {
    // 数値のみ受け付ける
    if (text === '' || /^\d+$/.test(text)) {
      setPageNumber(text);
    }
  };
  
  // タグ追加処理
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  // タグ削除処理
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // タグ入力時の処理
  const handleTagInputChange = (text: string) => {
    // カンマが入力されたらタグを追加
    if (text.includes(',')) {
      const parts = text.split(',');
      const lastPart = parts.pop() || '';
      
      // カンマの前の部分をタグとして追加
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed && !tags.includes(trimmed)) {
          setTags(prev => [...prev, trimmed]);
        }
      });
      
      // 残りの部分を入力欄に残す
      setTagInput(lastPart);
    } else {
      setTagInput(text);
    }
  };
  
  // キーボードのEnterキー押下時の処理
  const handleTagInputSubmit = () => {
    addTag();
  };
  
  // 保存ハンドラー
  const handleSave = () => {
    if (!canSave) return;
    
    const noteData = {
      bookId,
      content: content.trim(),
      pageNumber: pageNumber ? parseInt(pageNumber, 10) : undefined,
      tags: tags.length > 0 ? tags : undefined
    };
    
    dispatch(addNote(noteData));
    
    // 保存後のコールバック
    if (onSave) {
      onSave();
    }
    
    // フォームをリセット（必要に応じて）
    if (!initialNote) {
      setContent('');
      setPageNumber('');
      setTags([]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {book && (
        <View style={[styles.bookInfo, { borderBottomColor: colors.border }]}>
          <Typography variant="body" style={{ color: colors.text, fontWeight: 'bold' }}>
            {book.title}
          </Typography>
          <Typography variant="caption" style={{ color: colors.textSecondary }}>
            {book.author}
          </Typography>
        </View>
      )}
      
      <View style={styles.formGroup}>
        <Typography variant="caption" style={{ color: colors.text, fontWeight: '500', marginBottom: spacing.xs }}>
          {t('book.noteContent')}
        </Typography>
        <TextInput
          style={[styles.textArea, { 
            borderColor: colors.border, 
            color: colors.text,
            backgroundColor: colors.background
          }]}
          multiline
          value={content}
          onChangeText={setContent}
          placeholder={t('book.noteContentPlaceholder')}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <View style={styles.row}>
        <View style={styles.formGroupHalf}>
          <Typography variant="caption" style={{ color: colors.text, fontWeight: '500', marginBottom: spacing.xs }}>
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
          <Typography variant="caption" style={{ color: colors.text, fontWeight: '500', marginBottom: spacing.xs }}>
            {t('book.tags')}
          </Typography>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              color: colors.text,
              backgroundColor: colors.background
            }]}
            value={tagInput}
            onChangeText={handleTagInputChange}
            placeholder={t('book.tagsPlaceholder')}
            onSubmitEditing={handleTagInputSubmit}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>
      
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.secondaryLight }]}>
              <Typography variant="caption" style={{ color: colors.textSecondary }}>
                {tag}
              </Typography>
              <TouchableOpacity
                onPress={() => removeTag(tag)}
                style={styles.tagRemove}
              >
                <Typography variant="caption" style={{ color: colors.textSecondary }}>
                  ×
                </Typography>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
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
    color: colors.gray[800],
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
  label: {
    color: colors.gray[700],
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.xs,
    padding: spacing.sm,
    minHeight: 150,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    color: colors.primary[800],
    fontSize: typography.fontSize.xs,
  },
  tagRemove: {
    marginLeft: spacing.xs,
  },
  tagRemoveText: {
    color: colors.primary[800],
    fontSize: typography.fontSize.xs,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
}); 