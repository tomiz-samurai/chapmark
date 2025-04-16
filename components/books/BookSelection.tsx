import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Book as BookIcon } from 'lucide-react-native';
import { Typography } from '../Typography';
import { ProgressBar } from '../common/ProgressBar';
import { Book } from '../../types/models';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { calculateProgress } from '../../lib/services/TimerService';

interface BookSelectionProps {
  books: Book[];
  selectedBookId: string | null;
  onSelectBook: (book: Book) => void;
  onOpenModal?: () => void; // モーダルを開くための関数
}

/**
 * タイマー画面で使用する本の選択表示コンポーネント
 * 選択中の本がない場合は選択を促すボタンを表示し、
 * 選択中の本がある場合はその情報と進捗を表示する
 */
export function BookSelection({ books, selectedBookId, onSelectBook, onOpenModal }: BookSelectionProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  // 選択中の書籍
  const selectedBook = selectedBookId 
    ? books.find(book => book.id === selectedBookId) || null
    : null;

  // モーダルを開く処理
  const handleOpenBookSelector = () => {
    // onOpenModalが渡されている場合はそれを呼び出す
    if (onOpenModal) {
      onOpenModal();
      return;
    }
    
    // 後方互換性のための処理
    // モーダルは親コンポーネントで管理するため、
    // 選択中の本がない場合は最初の本を選択、ある場合はそのまま返す
    if (!selectedBook && books.length > 0) {
      onSelectBook(books[0]);
    } else if (selectedBook) {
      onSelectBook(selectedBook);
    }
  };

  if (!selectedBook) {
    return (
      <TouchableOpacity 
        style={[styles.selectBookButton, { backgroundColor: colors.card }]} 
        onPress={handleOpenBookSelector}
      >
        <BookIcon size={18} color={colors.textSecondary} />
        <Typography variant="body" style={{ color: colors.text, marginLeft: spacing.small, fontSize: 14 }}>
          {t('timer.selectBook')}
        </Typography>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.selectedBookContainer, { backgroundColor: colors.card }]} 
      onPress={handleOpenBookSelector}
    >
      {selectedBook.coverImage ? (
        <Image source={{ uri: selectedBook.coverImage }} style={styles.bookCover} />
      ) : (
        <View style={[styles.placeholderCover, { backgroundColor: colors.border }]}>
          <BookIcon size={18} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.bookInfo}>
        <Typography variant="body" style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>
          {selectedBook.title}
        </Typography>
        <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 12 }} numberOfLines={1}>
          {selectedBook.author}
        </Typography>
        {selectedBook.currentPage !== undefined && selectedBook.totalPages !== undefined && (
          <View style={styles.bookProgress}>
            <ProgressBar 
              progress={calculateProgress(selectedBook.currentPage, selectedBook.totalPages)} 
              height={3} 
              showPercentage={false}
            />
            <Typography variant="caption" style={{ color: colors.textSecondary, fontSize: 9, marginTop: 2 }}>
              {t('timer.pageDisplay', { current: selectedBook.currentPage, total: selectedBook.totalPages })}
            </Typography>
          </View>
        )}
      </View>
      <View style={styles.changeButton}>
        <Typography variant="caption" style={{ color: colors.primary, fontSize: 12, fontWeight: '500' }}>
          {t('timer.change')}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selectedBookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bookCover: {
    width: 36,
    height: 54,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  placeholderCover: {
    width: 36,
    height: 54,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 10,
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  bookProgress: {
    marginTop: 4,
    width: '100%',
  },
  changeButton: {
    paddingHorizontal: 8,
  },
  selectBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
}); 