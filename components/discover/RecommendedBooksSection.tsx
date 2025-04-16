import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { CollectionHeader } from '../layouts/CollectionHeader';
import { BookCard } from '../common/cards/BookCard';
import { spacing } from '../../constants/theme';
import { EmptyState } from '../common/displays/EmptyState';

interface Book {
  id: string;
  title: string;
  // 必要に応じて他のプロパティも追加
}

interface RecommendedBooksSectionProps {
  books: Book[];
  selectedCategory: string | null;
  onBookPress: (bookId: string) => void;
  onSeeAllPress: () => void;
  title: string;
  cardStyle?: ViewStyle;
}

const RecommendedBooksSection: React.FC<RecommendedBooksSectionProps> = ({
  books,
  selectedCategory,
  onBookPress,
  onSeeAllPress,
  title,
  cardStyle,
}) => {
  if (!books || books.length === 0) {
    return (
      <EmptyState
        title="おすすめ書籍がありません"
        message="条件に合致する書籍が見つかりませんでした。"
      />
    );
  }
  return (
    <View style={styles.section}>
      <CollectionHeader 
        title={selectedCategory || title}
        onSeeAllPress={onSeeAllPress}
      />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            variant="compact"
            onPress={() => onBookPress(book.id)}
            style={[styles.recommendedBookCard, cardStyle]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.md,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.md,
  },
  recommendedBookCard: {
    marginRight: spacing.sm,
  },
});

export default RecommendedBooksSection; 