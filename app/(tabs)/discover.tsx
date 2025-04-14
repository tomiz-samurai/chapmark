import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { BookCard } from '../../components/common/BookCard';
import { CategoryButton } from '../../components/common/CategoryButton';
import { CollectionHeader } from '../../components/common/CollectionHeader';

import { popularCategories, recommendationCollections, recommendedBooks as mockRecommendedBooks, newReleaseBooks as mockNewReleaseBooks } from '../../lib/mockData';
import { colors, spacing } from '../../constants/theme';
import { getBooksByCategory } from '../../lib/services/BookService';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { navigateToBookDetail, navigateToBookList, navigateToCollection } = useBookNavigation();

  // デバッグ用: コンポーネントマウント時に一度だけ実行
  useEffect(() => {
    // 全データのカバー画像URLをログに表示
    console.log("=== BOOK COVER DEBUG ===");
    
    // おすすめ本の情報表示
    mockRecommendedBooks.forEach((book, index) => {
      console.log(`Recommended Book ${index + 1}: ${book.title}`);
      console.log(`- coverUrl: ${book.coverUrl || 'undefined'}`);
    });
    
    // 新着本の情報表示
    mockNewReleaseBooks.forEach((book, index) => {
      console.log(`New Release Book ${index + 1}: ${book.title}`);
      console.log(`- coverUrl: ${book.coverUrl || 'undefined'}`);
    });
    
    console.log("=== END DEBUG ===");
  }, []);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  // モックデータの配列を直接使用（代入ではなく）
  // カテゴリーでフィルタリング
  const filteredBooks = selectedCategory
    ? mockRecommendedBooks.filter(book => 
        book.category && book.category.some(cat => 
          cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : mockRecommendedBooks;

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
          onPress={() => navigateToBookList('search')}
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
            onSeeAllPress={() => navigateToBookList('recommended')}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                variant="compact"
                onPress={() => navigateToBookDetail(book.id, '/(tabs)/discover')}
                style={styles.recommendedBookCard}
              />
            ))}
          </ScrollView>
        </View>

        {/* 新着書籍 */}
        <View style={styles.section}>
          <CollectionHeader 
            title="新着書籍" 
            onSeeAllPress={() => navigateToBookList('new-releases')}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {mockNewReleaseBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                variant="compact"
                onPress={() => navigateToBookDetail(book.id, '/(tabs)/discover')}
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
              onSeeAllPress={() => navigateToCollection(collection.id)}
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
                  onPress={() => navigateToBookDetail(item.id, '/(tabs)/discover')}
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
    marginBottom: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.md,
  },
  horizontalBookCard: {
    marginRight: spacing.sm,
    width: 110,
  },
  collectionBookCard: {
    width: 240,
    marginRight: spacing.sm,
  },
  bottomPadding: {
    height: spacing.xl * 2,
  },
  recommendedBookCard: {
    marginRight: spacing.sm,
    width: 110,
  },
}); 