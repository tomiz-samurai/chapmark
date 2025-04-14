import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Star, Clock, BookOpen, Calendar, Building, Tag, Check } from 'lucide-react-native';
import { useDispatch } from 'react-redux';

import { Typography } from '../../components/Typography';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { getBookById, updateBookStatus, addBookToLibrary } from '../../lib/services/BookService';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { selectBook } from '../../lib/store/bookSlice';

// ステータスのオプション
const STATUS_OPTIONS = [
  { value: 'reading', label: '読書中', color: colors.primary.main },
  { value: 'completed', label: '読了', color: colors.accent.main },
  { value: 'planned', label: 'これから読む', color: colors.gray[500] },
  { value: 'on-hold', label: '中断中', color: colors.status.warning },
  { value: 'dropped', label: '中止', color: colors.status.error },
];

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const bookId = typeof id === 'string' ? id : '';
  const { goBack, navigateToLibrary } = useBookNavigation();
  const dispatch = useDispatch();
  
  // 画像エラー状態の追加
  const [imageError, setImageError] = useState(false);
  
  // ステータス変更モーダルの状態
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  
  // 本の状態を管理
  const [book, setBook] = useState(getBookById(bookId));
  
  // ステータス変更後に本の情報を更新する関数
  const refreshBookData = () => {
    const updatedBook = getBookById(bookId);
    setBook(updatedBook);
  };
  
  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
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
  
  // タイマー画面に遷移する関数
  const navigateToTimer = () => {
    router.push('/(tabs)/timer');
  };
  
  // 読書開始ボタンの処理
  const handleStartReading = () => {
    // 「読書中」以外のステータスの場合は確認アラートを表示
    if (book.status !== 'reading') {
      const statusMessage = book.status === 'completed' 
        ? 'この本は既に「読了」済みです。' 
        : `「${getStatusText(book.status)}」を「読書中」に`;
      
      Alert.alert(
        'ステータス変更の確認',
        `${statusMessage}変更して読書を開始しますか？`,
        [
          { text: 'キャンセル', style: 'cancel' },
          { 
            text: '読書開始', 
            onPress: () => {
              startReading();
            }
          }
        ]
      );
    } else {
      // 「読書中」の場合は直接読書を開始
      startReading();
    }
  };
  
  // 読書を開始する共通処理
  const startReading = () => {
    if (updateBookStatus(bookId, 'reading')) {
      refreshBookData();
      
      // Reduxストアに選択中の本を設定
      dispatch(selectBook(bookId));
      
      // タイマー画面に遷移
      router.push('/(tabs)/timer');
    }
  };
  
  // ステータスオプションを選択した時の処理
  const handleSelectStatus = (status: 'reading' | 'completed' | 'planned' | 'on-hold' | 'dropped') => {
    if (updateBookStatus(bookId, status)) {
      setStatusModalVisible(false);
      refreshBookData();
      Alert.alert('成功', `本のステータスを「${getStatusText(status)}」に変更しました`, [
        { text: '閉じる', style: 'cancel' },
        { text: '本棚へ移動', onPress: navigateToLibrary }
      ]);
    }
  };
  
  // 本棚へ追加ボタンの処理
  const handleAddToLibrary = () => {
    if (book.status) {
      // 既に本棚にある場合はステータス変更モーダルを表示
      setStatusModalVisible(true);
    } else {
      // 本棚にない場合はこれから読むステータスで追加
      if (addBookToLibrary(book, 'planned')) {
        refreshBookData();
        Alert.alert('成功', '本を本棚に追加しました', [
          { text: '閉じる', style: 'cancel' },
          { text: '本棚へ移動', onPress: navigateToLibrary }
        ]);
      }
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
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <ChevronLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Typography variant="title" style={styles.headerTitle}>
          書籍詳細
        </Typography>
        <View style={styles.headerRight}>
          {book.status && (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: STATUS_OPTIONS.find(opt => opt.value === book.status)?.color || colors.gray[500] }]}
              onPress={() => setStatusModalVisible(true)}
            >
              <Typography variant="label" style={styles.statusButtonText}>
                {statusText}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
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
          {book.status && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleStartReading}
            >
              <Typography variant="body" color={colors.white}>
                読書を開始
              </Typography>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.secondaryButton, !book.status && { flex: 1 }]}
            onPress={handleAddToLibrary}
          >
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

      {/* ステータス変更モーダル */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Typography variant="title" style={styles.modalTitle}>
              ステータスを選択
            </Typography>
            
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.statusOption}
                onPress={() => handleSelectStatus(option.value as any)}
              >
                <View style={[styles.statusColor, { backgroundColor: option.color }]} />
                <Typography variant="body" style={{ flex: 1 }}>
                  {option.label}
                </Typography>
                {book.status === option.value && (
                  <Check size={20} color={colors.primary.main} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Typography variant="body" color={colors.gray[600]}>
                キャンセル
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: spacing.md,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  statusColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  statusButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  statusButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
}); 