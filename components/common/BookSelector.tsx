import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Book } from 'lucide-react-native';
import { Typography } from '../Typography';
import { EmptyState } from './EmptyState';
import { colors, spacing } from '../../constants/theme';
import { Book as BookType } from '../../lib/types';

interface BookSelectorProps {
  books: BookType[];
  selectedBookId: string | null;
  onSelectBook: (book: BookType) => void;
  title?: string;
}

export function BookSelector({
  books,
  selectedBookId,
  onSelectBook,
  title = '読書中の本'
}: BookSelectorProps) {
  return (
    <View style={styles.container}>
      <Typography variant="body" style={styles.sectionTitle}>
        {title}
      </Typography>

      <ScrollView style={styles.booksList} contentContainerStyle={styles.booksListContent}>
        {books.length === 0 ? (
          <EmptyState
            icon={<Book size={48} color={colors.gray[400]} />}
            title="読書中の本がありません"
            message="本棚から本を追加してください"
          />
        ) : (
          books.map((book) => (
            <Pressable
              key={book.id}
              style={[
                styles.bookItem,
                selectedBookId === book.id && styles.selectedBookItem,
              ]}
              onPress={() => onSelectBook(book)}
            >
              {book.coverImage ? (
                <Image source={{ uri: book.coverImage }} style={styles.bookCover} />
              ) : (
                <View style={styles.placeholderCover}>
                  <Book size={24} color={colors.gray[400]} />
                </View>
              )}
              <View style={styles.bookItemInfo}>
                <Typography variant="body" style={styles.bookItemTitle} numberOfLines={1}>
                  {book.title}
                </Typography>
                <Typography variant="caption" style={styles.bookItemAuthor} numberOfLines={1}>
                  {book.author}
                </Typography>
              </View>
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
  sectionTitle: {
    marginBottom: spacing.sm,
    color: colors.gray[800],
    fontWeight: 'bold',
  },
  booksList: {
    flex: 1,
  },
  booksListContent: {
    paddingVertical: spacing.sm,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedBookItem: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  bookCover: {
    width: 50,
    height: 70,
    borderRadius: spacing.xs,
  },
  placeholderCover: {
    width: 50,
    height: 70,
    backgroundColor: colors.gray[200],
    borderRadius: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookItemInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  bookItemTitle: {
    color: colors.gray[800],
    fontWeight: 'bold',
  },
  bookItemAuthor: {
    color: colors.gray[600],
  },
}); 