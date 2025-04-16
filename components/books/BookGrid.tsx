import React from 'react';
import { FlatList, StyleSheet, View, ListRenderItemInfo } from 'react-native';
import { Book as BookIcon } from 'lucide-react-native';
import { Book } from '../../lib/services/BookService';
import { BookCard } from '../common';
import { EmptyState } from '../common';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface BookGridProps {
  books: Book[];
  onBookPress: (bookId: string) => void;
  searchQuery?: string;
  columnCount?: number;
}

/**
 * 本をグリッド形式で表示するコンポーネント
 */
export function BookGrid({ 
  books, 
  onBookPress, 
  searchQuery = '', 
  columnCount = 2 
}: BookGridProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  // 安全にbooksを扱う
  const safeBooks = Array.isArray(books) ? books : [];

  const renderItem = ({ item }: ListRenderItemInfo<Book>) => (
    <BookCard
      book={item}
      variant="grid"
      showRating={false}
      showStatus={true}
      onPress={() => onBookPress(item.id)}
      style={styles.gridCard}
    />
  );

  return (
    <FlatList
      data={safeBooks}
      numColumns={columnCount}
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
  gridCard: {
    flex: 1,
    marginHorizontal: '1%',
    marginBottom: 16,
    maxWidth: '48%',
  },
}); 