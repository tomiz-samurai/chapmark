import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { BookCard } from '../../components/common/BookCard';
import { CategoryButton } from '../../components/common/CategoryButton';
import { CollectionHeader } from '../../components/common/CollectionHeader';

import { 
  recommendedBooks, 
  newReleaseBooks, 
  popularCategories, 
  recommendationCollections 
} from '../../lib/mockData';
import { colors, spacing } from '../../constants/theme';

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const filteredBooks = selectedCategory
    ? recommendedBooks.filter(book => book.category.includes(selectedCategory))
    : recommendedBooks;

  const navigateToScreen = (path: string) => {
    // @ts-ignore
    router.push(path);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* ヘッダー */}
      <View style={styles.header}>
        <Typography variant="display" style={styles.headerTitle}>
          発見
        </Typography>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={() => navigateToScreen('/search')}
        >
          <Search size={24} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* カテゴリー */}
        <View style={styles.section}>
          <CollectionHeader 
            title="人気のジャンル" 
            showSeeAll={false}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {popularCategories.map((category) => (
              <CategoryButton
                key={category}
                title={category}
                isActive={selectedCategory === category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* おすすめ書籍 */}
        <View style={styles.section}>
          <CollectionHeader 
            title={selectedCategory || "おすすめ書籍"} 
            onSeeAllPress={() => navigateToScreen('/books/recommended')}
          />
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.bookRow}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                onPress={() => navigateToScreen(`/books/${item.id}`)}
              />
            )}
          />
        </View>

        {/* 新着書籍 */}
        <View style={styles.section}>
          <CollectionHeader 
            title="新着書籍" 
            onSeeAllPress={() => navigateToScreen('/books/new-releases')}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {newReleaseBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                variant="grid"
                onPress={() => navigateToScreen(`/books/${book.id}`)}
                style={styles.horizontalBookCard}
              />
            ))}
          </ScrollView>
        </View>

        {/* まとめコレクション */}
        {recommendationCollections.map((collection) => (
          <View key={collection.id} style={styles.section}>
            <CollectionHeader 
              title={collection.title} 
              onSeeAllPress={() => navigateToScreen(`/collections/${collection.id}`)}
            />
            <FlatList
              data={collection.books}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              renderItem={({ item }) => (
                <BookCard
                  book={item}
                  variant="horizontal"
                  onPress={() => navigateToScreen(`/books/${item.id}`)}
                  style={styles.collectionBookCard}
                />
              )}
            />
          </View>
        ))}
        
        {/* 余白 */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    color: colors.primary.dark,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: spacing.xl,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  bookRow: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.md,
  },
  horizontalBookCard: {
    marginRight: spacing.md,
    width: 140,
  },
  collectionBookCard: {
    width: 300,
    marginRight: spacing.md,
  },
  bottomPadding: {
    height: spacing.xl * 2,
  },
}); 