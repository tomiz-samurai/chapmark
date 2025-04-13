import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Star, Clock, BookOpen, Calendar, Building, Tag } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { recommendedBooks, newReleaseBooks } from '../../lib/mockData';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const bookId = typeof id === 'string' ? id : '';
  
  // モックデータから書籍を検索
  const book = [...recommendedBooks, ...newReleaseBooks].find(b => b.id === bookId);
  
  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Typography variant="title">書籍が見つかりませんでした</Typography>
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
        <Typography variant="title" style={styles.headerTitle}>
          書籍詳細
        </Typography>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 書籍情報 */}
        <View style={styles.bookInfo}>
          <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
          <View style={styles.infoContainer}>
            <Typography variant="title" style={styles.title}>
              {book.title}
            </Typography>
            <Typography variant="body" color={colors.gray[600]} style={styles.author}>
              {book.author}
            </Typography>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.accent.main} fill={colors.accent.main} />
              <Typography variant="body" style={styles.rating}>
                {book.rating.toFixed(1)}
              </Typography>
            </View>
          </View>
        </View>
        
        {/* アクションボタン */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Typography variant="body" color={colors.white}>
              読書を開始
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Typography variant="body" color={colors.primary.main}>
              本棚に追加
            </Typography>
          </TouchableOpacity>
        </View>
        
        {/* 詳細情報 */}
        <View style={styles.detailsCard}>
          <Typography variant="title" style={styles.sectionTitle}>
            書籍情報
          </Typography>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <BookOpen size={16} color={colors.primary.main} />
              </View>
              <Typography variant="caption" color={colors.gray[600]}>
                ページ数
              </Typography>
              <Typography variant="body">
                {book.pageCount}ページ
              </Typography>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar size={16} color={colors.primary.main} />
              </View>
              <Typography variant="caption" color={colors.gray[600]}>
                出版日
              </Typography>
              <Typography variant="body">
                {book.publishedDate}
              </Typography>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Building size={16} color={colors.primary.main} />
              </View>
              <Typography variant="caption" color={colors.gray[600]}>
                出版社
              </Typography>
              <Typography variant="body">
                {book.publisher}
              </Typography>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Tag size={16} color={colors.primary.main} />
              </View>
              <Typography variant="caption" color={colors.gray[600]}>
                カテゴリ
              </Typography>
              <Typography variant="body">
                {book.category[0]}
              </Typography>
            </View>
          </View>
        </View>
        
        {/* 概要 */}
        <View style={styles.descriptionCard}>
          <Typography variant="title" style={styles.sectionTitle}>
            概要
          </Typography>
          <Typography variant="body" color={colors.gray[700]} style={styles.description}>
            {book.description}
          </Typography>
        </View>
        
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
  content: {
    flex: 1,
  },
  bookInfo: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.xs,
  },
  author: {
    marginBottom: spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: spacing.xs,
    color: colors.gray[700],
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  detailsCard: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  descriptionCard: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  description: {
    lineHeight: 22,
  },
  bottomPadding: {
    height: spacing.xl * 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 