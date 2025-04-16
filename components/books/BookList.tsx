import React from 'react';
import { FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { Book as BookIcon } from 'lucide-react-native';
import { Book } from '../../lib/services/BookService';
import { BookCard } from '../common';
import { EmptyState } from '../common';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface BookListProps {
  books: Book[];
  onBookPress: (bookId: string) => void;
  searchQuery?: string;
}

/**
 * 本をリスト形式で表示するコンポーネント
 */
export function BookList({ books, onBookPress, searchQuery = '' }: BookListProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  // 安全にbooksを扱う
  const safeBooks = Array.isArray(books) ? books : [];

  const renderItem = ({ item }: ListRenderItemInfo<Book>) => (
    <BookCard
      book={item}
      variant="list"
      showRating={false}
      showStatus={true}
      onPress={() => onBookPress(item.id)}
      style={styles.listCard}
    />
  );

  return (
    <FlatList
      data={safeBooks}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={[
        styles.contentContainer,
        safeBooks.length === 0 && styles.emptyContentContainer
      ]}
      ListEmptyComponent={
        <EmptyState
          icon={<BookIcon size={48} color={colors.text} />}
          title={searchQuery ? 'books.searchNoResults' : 'books.emptyState.title'}
          message={searchQuery ? 'books.searchNoResultsMessage' : 'books.emptyState.message'}
          isTitleTranslationKey={true}
          isMessageTranslationKey={true}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listCard: {
    marginBottom: 12,
  },
}); 