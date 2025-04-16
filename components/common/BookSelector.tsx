import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Book } from 'lucide-react-native';
import { Typography } from '../Typography';
import { EmptyState } from './EmptyState';
import { ProgressBar } from './ProgressBar';
import { spacing } from '../../constants/theme';
import { Book as BookType } from '../../types/models/book';
import { useTheme } from '../../lib/hooks/useTheme';

interface BookSelectorProps {
  books: BookType[];
  selectedBookId: string | null;
  onSelectBook: (book: BookType) => void;
  title?: string;
  isModal?: boolean;
}

export function BookSelector({
  books,
  selectedBookId,
  onSelectBook,
  title = '読書中の本',
  isModal = false
}: BookSelectorProps) {
  const { colors } = useTheme();
  
  // 進捗率を計算
  const calculateProgress = (book: BookType): number => {
    if (!book.currentPage || !book.totalPages || book.totalPages === 0) {
      return 0;
    }
    return Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
  };

  return (
    <View style={[styles.container, isModal && styles.modalContainer]}>
      {!isModal && (
        <Typography variant="body" style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Typography>
      )}

      <ScrollView 
        style={styles.booksList} 
        contentContainerStyle={[
          styles.booksListContent,
          isModal && styles.modalBooksListContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        {books.length === 0 ? (
          <EmptyState
            icon={<Book size={48} color={colors.textSecondary} />}
            title="読書中の本がありません"
            message="本棚から本を追加してください"
          />
        ) : (
          books.map((book) => (
            <Pressable
              key={book.id}
              style={[
                styles.bookItem,
                { backgroundColor: colors.card },
                selectedBookId === book.id && [styles.selectedBookItem, { borderColor: colors.primary }],
                isModal && styles.modalBookItem
              ]}
              onPress={() => onSelectBook(book)}
            >
              {book.coverImage ? (
                <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
              ) : (
                <View style={[styles.placeholderCover, { backgroundColor: colors.border }]}>
                  <Book size={24} color={colors.textSecondary} />
                </View>
              )}
              <View style={styles.bookItemInfo}>
                <Typography variant="body" style={[styles.bookItemTitle, { color: colors.text }]} numberOfLines={2}>
                  {book.title}
                </Typography>
                <Typography variant="caption" style={[styles.bookItemAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                  {book.author}
                </Typography>
                
                {book.currentPage !== undefined && book.totalPages !== undefined && (
                  <View style={styles.progressWrapper}>
                    <ProgressBar 
                      progress={calculateProgress(book)} 
                      height={4} 
                      showPercentage={false}
                    />
                    <Typography variant="caption" style={[styles.progressText, { color: colors.textSecondary }]}>
                      {book.currentPage} / {book.totalPages}ページ ({calculateProgress(book)}%)
                    </Typography>
                  </View>
                )}
              </View>
              {isModal && selectedBookId === book.id && (
                <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                  <Typography variant="caption" style={[styles.selectedText, { color: colors.card }]}>
                    選択中
                  </Typography>
                </View>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  booksList: {
    flex: 1,
  },
  booksListContent: {
    paddingVertical: spacing.sm,
  },
  modalBooksListContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  modalBookItem: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    paddingVertical: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedBookItem: {
    borderWidth: 2,
  },
  bookCover: {
    width: 60,
    height: 84,
    borderRadius: spacing.xs,
  },
  placeholderCover: {
    width: 60,
    height: 84,
    borderRadius: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookItemInfo: {
    marginLeft: spacing.md,
    flex: 1,
    paddingRight: spacing.sm,
  },
  bookItemTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  bookItemAuthor: {
    marginBottom: spacing.xs,
  },
  progressWrapper: {
    marginTop: spacing.xs,
  },
  progressText: {
    fontSize: 10,
    marginTop: 4,
  },
  selectedIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  selectedText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
}); 