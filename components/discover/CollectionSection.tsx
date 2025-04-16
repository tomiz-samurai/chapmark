import React from 'react';
import { View, StyleSheet, FlatList, ViewStyle } from 'react-native';
import { CollectionHeader } from '../layouts/CollectionHeader';
import { BookCard } from '../common/cards/BookCard';
import { spacing } from '../../constants/theme';
import { EmptyState } from '../common/displays/EmptyState';

interface Book {
  id: string;
  title: string;
  // 必要に応じて他のプロパティも追加
}

interface CollectionSectionProps {
  collectionId: string;
  title: string;
  books: Book[];
  onBookPress: (bookId: string) => void;
  onSeeAllPress: (collectionId: string) => void;
  cardStyle?: ViewStyle;
}

const CollectionSection: React.FC<CollectionSectionProps> = ({
  collectionId,
  title,
  books,
  onBookPress,
  onSeeAllPress,
  cardStyle,
}) => {
  if (!books || books.length === 0) {
    return (
      <EmptyState
        title="コレクションが空です"
        message="このコレクションには書籍がありません。"
      />
    );
  }
  return (
    <View style={styles.section}>
      <CollectionHeader 
        title={title}
        onSeeAllPress={() => onSeeAllPress(collectionId)}
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            variant="horizontal"
            onPress={() => onBookPress(item.id)}
            style={[styles.collectionBookCard, cardStyle]}
          />
        )}
      />
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
  collectionBookCard: {
    width: 240,
    marginRight: spacing.md,
  },
});

export default CollectionSection; 