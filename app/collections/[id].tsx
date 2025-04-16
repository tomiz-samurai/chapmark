import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { BookCard } from '../../components/common';
import { recommendationCollections } from '../../lib/mockData';
import { colors, spacing } from '../../constants/theme';

export default function CollectionDetail() {
  const { id } = useLocalSearchParams();
  const collectionId = typeof id === 'string' ? id : '';
  
  // モックデータからコレクションを検索
  const collection = recommendationCollections.find(c => c.id === collectionId);
  
  if (!collection) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Typography variant="title">コレクションが見つかりませんでした</Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Typography variant="title" style={styles.headerTitle} numberOfLines={1}>
          {collection.title}
        </Typography>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.container}>
        <Typography variant="body" style={styles.description} color={colors.gray[600]}>
          キャリア志向のビジネスパーソンにおすすめの厳選書籍です。これらの本から得られる知識やスキルは、あなたのキャリア成長に役立ちます。
        </Typography>
        
        <FlatList
          data={collection.books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              variant="horizontal"
              onPress={() => {
                // @ts-ignore
                router.push(`/books/${item.id}`);
              }}
              style={styles.bookCard}
            />
          )}
        />
      </View>
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  bookCard: {
    marginBottom: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 