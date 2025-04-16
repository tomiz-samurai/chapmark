import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { CollectionHeader } from '../layouts/CollectionHeader';
import { BookCard } from '../common/cards/BookCard';
import { spacing } from '../../constants/theme';

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