import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { BookCard } from '../../components/common';
import { CategoryButton } from '../../components/common';
import { CollectionHeader } from '../../components/layouts';
import { Header } from '../../components/layouts/Header';
import DiscoverCategoryBar from '../../components/discover/DiscoverCategoryBar';
import RecommendedBooksSection from '../../components/discover/RecommendedBooksSection';
import NewReleasesSection from '../../components/discover/NewReleasesSection';
import CollectionSection from '../../components/discover/CollectionSection';

import { popularCategories, recommendationCollections, recommendedBooks as mockRecommendedBooks, newReleaseBooks as mockNewReleaseBooks } from '../../lib/mockData';
import { colors, spacing } from '../../constants/theme';
import { getBooksByCategory, getAllBooks, Book as ServiceBook } from '../../lib/services/BookService';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useDiscoverCategory } from '../../lib/hooks/useDiscoverCategory';
import { useDiscoverBooks } from '../../lib/hooks/useDiscoverBooks';

export default function DiscoverScreen() {
  const { selectedCategory, handleCategoryPress } = useDiscoverCategory();
  const { navigateToBookDetail, navigateToBookList, navigateToCollection } = useBookNavigation();
  const { t } = useAppTranslation();

  // 全ての本データを取得
  const allBooks: ServiceBook[] = getAllBooks();

  // カテゴリフィルタ
  const filteredBooks = useDiscoverBooks(allBooks, selectedCategory);

  // 新着書籍（例: publishedDate降順で上位3件）
  const newReleaseBooks = [...allBooks]
    .filter(book => book.publishedDate)
    .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''))
    .slice(0, 3);

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

  return (
    <View style={styles.container}>
      <Header
        title={t('navigation.discover')}
        notificationCount={0}
        onNotificationPress={() => console.log('Notification pressed')}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* カテゴリー */}
        <DiscoverCategoryBar
          categories={popularCategories}
          selectedCategory={selectedCategory}
          onCategoryPress={handleCategoryPress}
          title={t('discover.popularCategories')}
        />

        {/* おすすめ書籍 */}
        <RecommendedBooksSection
          books={filteredBooks}
          selectedCategory={selectedCategory}
          onBookPress={(bookId) => navigateToBookDetail(bookId, '/(tabs)/discover')}
          onSeeAllPress={() => navigateToBookList('recommended')}
          title={t('discover.recommendedBooks')}
        />

        {/* 新着書籍 */}
        <NewReleasesSection
          books={newReleaseBooks}
          onBookPress={(bookId) => navigateToBookDetail(bookId, '/(tabs)/discover')}
          onSeeAllPress={() => navigateToBookList('new-releases')}
          title={t('discover.newReleases')}
        />

        {/* まとめコレクション */}
        {recommendationCollections.map((collection) => (
          <CollectionSection
            key={collection.id}
            collectionId={collection.id}
            title={t(collection.titleKey)}
            books={collection.books.map(colBook => allBooks.find(b => b.id === colBook.id)).filter(Boolean) as ServiceBook[]}
            onBookPress={(bookId) => navigateToBookDetail(bookId, '/(tabs)/discover')}
            onSeeAllPress={navigateToCollection}
          />
        ))}
        
        {/* 余白 */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.md,
  },
  recommendedBookCard: {
    marginRight: spacing.sm,
  },
  horizontalBookCard: {
    marginRight: spacing.sm,
  },
  collectionBookCard: {
    width: 240,
    marginRight: spacing.md,
  },
  bottomPadding: {
    height: spacing.xxl,
  }
}); 