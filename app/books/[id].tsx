import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Star, Clock, BookOpen, Calendar, Building, Tag } from 'lucide-react-native';

import { Typography } from '../../components/Typography';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { getBookById } from '../../lib/services/BookService';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const bookId = typeof id === 'string' ? id : '';
  const { goBack } = useBookNavigation();
  
  // 画像エラー状態の追加
  const [imageError, setImageError] = useState(false);
  
  // BookServiceを使用して書籍情報を取得
  const book = getBookById(bookId);
  
  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ChevronLeft size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Typography variant="title">書籍が見つかりませんでした</Typography>
        </View>
      </SafeAreaView>
    );
  }

  // ステータスの表示テキストを取得
  const getStatusText = (status?: string) => {
    if (!status) return '';
    
    switch(status) {
      case 'reading': return '読書中';
      case 'completed': return '読了';
      case 'planned': return 'これから読む';
      case 'on-hold': return '中断中';
      case 'dropped': return '中止';
      default: return '';
    }
  };

  const statusText = getStatusText(book.status);
  // デフォルトのカバー画像URL
  const defaultCoverUrl = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
  
  // Amazonの画像URL問題を対処する関数
  const getFixedImageUrl = (url?: string) => {
    if (!url) return null;
    
    // AmazonのURLを修正 (CORSとセキュリティ対応)
    if (url.includes('amazon.com') || url.includes('media-amazon.com')) {
      // URLパラメータを削除して単純化 (AmazonのCORS問題を回避)
      const baseUrl = url.split('?')[0];
      return baseUrl;
    }
    
    return url;
  };
  
  // カバー画像のソース取得ロジック
  const getCoverSource = () => {
    if (imageError) {
      return { uri: defaultCoverUrl };
    }
    
    // 修正されたURLを取得
    const fixedCoverUrl = getFixedImageUrl(book.coverUrl);
    const fixedCoverImage = getFixedImageUrl(book.coverImage);
    
    if (fixedCoverUrl) {
      return { uri: fixedCoverUrl };
    }
    
    if (fixedCoverImage) {
      return { uri: fixedCoverImage };
    }
    
    return { uri: defaultCoverUrl };
  };
  
  // 画像読み込みエラー処理
  const handleImageError = () => {
    console.log(`Book detail image error for book: ${book.title}`);
    setImageError(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
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
          <Image 
            source={getCoverSource()} 
            style={styles.coverImage}
            onError={handleImageError}
          />
          <View style={styles.infoContainer}>
            <Typography variant="title" style={styles.title}>
              {book.title}
            </Typography>
            <Typography variant="body" color={colors.gray[600]} style={styles.author}>
              {book.author}
            </Typography>
            
            {statusText ? (
              <View style={styles.statusContainer}>
                <Typography variant="caption" style={styles.statusText}>
                  ステータス: {statusText}
                </Typography>
              </View>
            ) : book.rating ? (
              <View style={styles.ratingContainer}>
                <Star size={16} color={colors.accent.main} fill={colors.accent.main} />
                <Typography variant="body" style={styles.rating}>
                  {book.rating.toFixed(1)}
                </Typography>
              </View>
            ) : null}
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
              {book.status ? 'ステータス変更' : '本棚に追加'}
            </Typography>
          </TouchableOpacity>
        </View>
        
        {/* 詳細情報（拡張データがある場合のみ表示） */}
        {(book.pageCount || book.publishedDate || book.publisher || book.category) && (
          <View style={styles.detailsCard}>
            <Typography variant="title" style={styles.sectionTitle}>
              書籍情報
            </Typography>
            
            <View style={styles.detailRow}>
              {book.pageCount && (
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
              )}
              
              {book.publishedDate && (
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
              )}
            </View>
            
            {(book.publisher || (book.category && book.category.length > 0)) && (
              <View style={styles.detailRow}>
                {book.publisher && (
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
                )}
                
                {book.category && book.category.length > 0 && (
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
                )}
              </View>
            )}
          </View>
        )}
        
        {/* 概要 */}
        {book.description && (
          <View style={styles.descriptionCard}>
            <Typography variant="title" style={styles.sectionTitle}>
              概要
            </Typography>
            <Typography variant="body" color={colors.gray[700]} style={styles.description}>
              {book.description}
            </Typography>
          </View>
        )}
        
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholder: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: colors.primary.dark,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: spacing.xl * 2,
  },
}); 