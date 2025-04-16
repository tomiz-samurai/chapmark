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
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { BookContents } from '../../components/books/BookContents';
import { Modal as CommonModal } from '../../components/common/Modal';
import { QuoteInput } from '../../components/quotes/QuoteInput';
import { NoteInput } from '../../components/notes/NoteInput';
import { Quote, Note } from '../../lib/types';

// ステータスのオプション
const STATUS_OPTIONS = [
  { value: 'reading', label: 'books.reading', color: colors.primary.main },
  { value: 'completed', label: 'books.completed', color: colors.accent.main },
  { value: 'planned', label: 'books.toRead', color: colors.gray[500] },
  { value: 'on-hold', label: 'books.onHold', color: colors.status.warning },
  { value: 'dropped', label: 'books.dropped', color: colors.status.error },
];

/**
 * 将来的なGoogle Books API連携のためのコメント:
 * 
 * 1. 現在の実装:
 *    - 静的なローカルデータを使用して書籍情報を表示
 *    - 言語設定に関わらず同じデータを表示
 * 
 * 2. 将来の実装予定:
 *    - Google Books APIを使用して動的にデータを取得
 *    - ユーザーの言語設定(i18n.language)に基づいて適切な言語のデータを取得
 *    - 英語圏(en)ではUS国コード、日本語(ja)ではJP国コードを使用
 *    - 検索結果が少ない場合は代替言語でフォールバック処理
 * 
 * 3. 予定API実装例:
 *    const fetchBookDetails = async (bookId) => {
 *      const { i18n } = useAppTranslation();
 *      const currentLanguage = i18n.language;
 *      
 *      const params = new URLSearchParams();
 *      params.append('country', currentLanguage === 'ja' ? 'JP' : 'US');
 *      
 *      const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?${params.toString()}`;
 *      const response = await fetch(apiUrl);
 *      return response.json();
 *    };
 */

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const bookId = typeof id === 'string' ? id : '';
  const { goBack, navigateToLibrary } = useBookNavigation();
  const dispatch = useDispatch();
  const { t, i18n } = useAppTranslation();
  
  // 画像エラー状態の追加
  const [imageError, setImageError] = useState(false);
  
  // ステータス変更モーダルの状態
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  
  // 引用・メモ入力モーダルの状態
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // 本の状態を管理
  const [book, setBook] = useState(getBookById(bookId));

  // 書籍説明の言語情報（将来のAPI連携用）
  const [descriptionLanguage, setDescriptionLanguage] = useState('');
  
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
          <Typography variant="title">{t('books.notFound')}</Typography>
        </View>
      </SafeAreaView>
    );
  }

  // ステータスの表示テキストを取得
  const getStatusText = (status?: string) => {
    if (!status) return '';
    
    switch(status) {
      case 'reading': return t('books.reading');
      case 'completed': return t('books.completed');
      case 'planned': return t('books.toRead');
      case 'on-hold': return t('books.onHold');
      case 'dropped': return t('books.dropped');
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
        ? t('books.detail.alreadyCompletedMessage') 
        : t('books.detail.changeStatusToReadingMessage', { status: getStatusText(book.status) });
      
      Alert.alert(
        t('books.detail.confirmStatusChange'),
        statusMessage,
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('books.detail.startReading'), 
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
      Alert.alert(
        t('common.success'),
        t('books.detail.statusChangeSuccess', { status: getStatusText(status) }),
        [
          { text: t('common.close'), style: 'cancel' },
          { text: t('books.detail.goToLibrary'), onPress: navigateToLibrary }
        ]
      );
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
        Alert.alert(
          t('common.success'),
          t('books.detail.addedToLibrary'),
          [
            { text: t('common.close'), style: 'cancel' },
            { text: t('books.detail.goToLibrary'), onPress: navigateToLibrary }
          ]
        );
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

  /**
   * 書籍の説明を表示する関数
   * 将来的にGoogle Books APIから取得したデータに対応するため、
   * 言語設定に応じた処理を行う
   */
  const renderDescription = () => {
    if (!book.description) return null;
    
    // 現在のバージョンでは単純に説明文を表示
    // 将来的には言語情報に基づいた処理を追加予定
    return (
      <View style={styles.descriptionCard}>
        <Typography variant="title" style={styles.sectionTitle}>
          {t('books.detail.description')}
        </Typography>
        
        {/* 説明文が現在の言語と異なる場合、注釈を表示（将来実装） */}
        {descriptionLanguage && descriptionLanguage !== i18n.language && (
          <Typography 
            variant="caption" 
            color={colors.status.warning} 
            style={styles.descriptionLanguageNote}
          >
            {t('books.detail.descriptionLanguageNote', { language: descriptionLanguage === 'en' ? '英語' : '日本語' })}
          </Typography>
        )}
        
        <Typography variant="body" color={colors.gray[700]} style={styles.description}>
          {book.description}
        </Typography>
      </View>
    );
  };

  // 引用追加モーダルを開く
  const handleAddQuote = () => {
    setEditingQuote(null);
    setQuoteModalVisible(true);
  };
  
  // メモ追加モーダルを開く
  const handleAddNote = () => {
    setEditingNote(null);
    setNoteModalVisible(true);
  };
  
  // 引用編集モーダルを開く
  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteModalVisible(true);
  };
  
  // メモ編集モーダルを開く
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteModalVisible(true);
  };
  
  // 引用保存完了時
  const handleQuoteSaved = () => {
    setQuoteModalVisible(false);
    setEditingQuote(null);
  };
  
  // メモ保存完了時
  const handleNoteSaved = () => {
    setNoteModalVisible(false);
    setEditingNote(null);
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
          {t('books.detail.title')}
        </Typography>
        <View style={styles.headerRight}>
          {/* ステータスボタンを削除 */}
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
                  {t('books.detail.statusLabel')}: {statusText}
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
                {t('books.detail.startReading')}
              </Typography>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.secondaryButton, !book.status && { flex: 1 }]}
            onPress={handleAddToLibrary}
          >
            <Typography variant="body" color={colors.primary.main}>
              {book.status ? t('books.detail.changeStatus') : t('books.detail.addToLibrary')}
            </Typography>
          </TouchableOpacity>
        </View>
        
        {/* 詳細情報（拡張データがある場合のみ表示） */}
        {(book.pageCount || book.publishedDate || book.publisher || book.category) && (
          <View style={styles.detailsCard}>
            <Typography variant="title" style={styles.sectionTitle}>
              {t('books.detail.bookInfo')}
            </Typography>
            
            <View style={styles.detailRow}>
              {book.pageCount && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <BookOpen size={16} color={colors.primary.main} />
                  </View>
                  <Typography variant="caption" color={colors.gray[600]}>
                    {t('books.detail.pageCount')}
                  </Typography>
                  <Typography variant="body">
                    {book.pageCount}{t('books.detail.pages')}
                  </Typography>
                </View>
              )}
              
              {book.publishedDate && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <Calendar size={16} color={colors.primary.main} />
                  </View>
                  <Typography variant="caption" color={colors.gray[600]}>
                    {t('books.detail.publishDate')}
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
                      {t('books.detail.publisher')}
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
                      {t('books.detail.category')}
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
        
        {/* 概要 - カスタム関数を使用 */}
        {renderDescription()}
        
        {/* 引用・メモタブ */}
        {book.status && (
          <BookContents
            bookId={bookId}
            onAddQuote={handleAddQuote}
            onAddNote={handleAddNote}
            onEditQuote={handleEditQuote}
            onEditNote={handleEditNote}
          />
        )}
        
        {/* 余白 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* ステータス変更モーダル */}
      <CommonModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        title={t('books.detail.selectStatus')}
      >
        <View style={styles.statusModalContent}>
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.statusOption}
              onPress={() => handleSelectStatus(option.value as any)}
            >
              <View style={[styles.statusColor, { backgroundColor: option.color }]} />
              <Typography variant="body" style={{ flex: 1 }}>
                {t(option.label)}
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
            <Typography variant="body" color={colors.gray[500]}>
              {t('common.cancel')}
            </Typography>
          </TouchableOpacity>
        </View>
      </CommonModal>
      
      {/* 引用入力モーダル */}
      <CommonModal
        visible={quoteModalVisible}
        onClose={() => setQuoteModalVisible(false)}
        title={editingQuote ? t('book.editQuote', '引用を編集') : t('book.addQuote', '引用を追加')}
      >
        <QuoteInput
          bookId={bookId}
          onSave={handleQuoteSaved}
          initialQuote={editingQuote ? {
            text: editingQuote.text,
            insight: editingQuote.insight || '',
            pageNumber: editingQuote.pageNumber,
            chapter: editingQuote.chapter
          } : undefined}
        />
      </CommonModal>
      
      {/* メモ入力モーダル */}
      <CommonModal
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        title={editingNote ? t('book.editNote', 'メモを編集') : t('book.addNote', 'メモを追加')}
      >
        <NoteInput
          bookId={bookId}
          onSave={handleNoteSaved}
          initialNote={editingNote ? {
            content: editingNote.content,
            pageNumber: editingNote.pageNumber,
            tags: editingNote.tags
          } : undefined}
        />
      </CommonModal>
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
  descriptionLanguageNote: {
    marginBottom: spacing.sm,
    fontStyle: 'italic',
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
  statusModalContent: {
    padding: spacing.md,
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
}); 