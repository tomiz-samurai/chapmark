import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { BookCard } from '../../components/common/BookCard';
import { newReleaseBooks } from '../../lib/mockData';
import { colors, spacing } from '../../constants/theme';

export default function NewReleaseBooks() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Typography variant="title" style={styles.headerTitle}>
          新着書籍
        </Typography>
        <View style={styles.headerRight} />
      </View>
      
      <FlatList
        data={newReleaseBooks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.bookRow}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => {
              // @ts-ignore
              router.push(`/books/${item.id}`);
            }}
          />
        )}
      />
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
  listContent: {
    padding: spacing.md,
  },
  bookRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
}); 