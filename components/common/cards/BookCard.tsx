import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, ImageSourcePropType } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors, shadows, borderRadius, spacing, typography } from '../../../constants/theme';
import { Typography } from '../../Typography';
import { Book } from '../../lib/services/BookService';
import { useAppTranslation } from '../../../hooks/useAppTranslation';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  style?: any;
  variant?: 'grid' | 'horizontal' | 'list' | 'compact';
  showRating?: boolean;
  showStatus?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onPress, 
  style,
  variant = 'grid',
  showRating = true,
  showStatus = false
}) => {
  const { title, author, coverImage, coverUrl, rating, status } = book;
  const { t } = useAppTranslation();
  // 画像ソースの状態管理
  const [imageError, setImageError] = useState(false);
  
  // 安全で確実に表示できる画像URL
  const defaultBookCover = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
  
  // Amazonの画像URL問題を対処する関数
  const getFixedImageUrl = (url?: string) => {
    if (!url) return null;
    
    console.log(`処理前のURL: ${url}`);
    
    // AmazonのURLを修正 (CORSとセキュリティ対応)
    if (url.includes('amazon.com') || url.includes('media-amazon.com')) {
      // URLパラメータを削除して単純化 (AmazonのCORS問題を回避)
      const baseUrl = url.split('?')[0];
      console.log(`Amazon画像URL修正後: ${baseUrl}`);
      return baseUrl;
    }
    
    console.log(`最終的なURL: ${url}`);
    return url;
  };
  
  // 共通の画像ソース処理をuseMemoで効率化
  const coverSource = useMemo(() => {
    console.log(`Book: ${title} - coverUrl: ${coverUrl}, coverImage: ${coverImage}`);
    
    if (imageError) {
      console.log(`${title}: エラーが発生したため、デフォルト画像を使用`);
      return { uri: defaultBookCover } as ImageSourcePropType;
    }
    
    // 修正されたURLを取得
    const fixedCoverUrl = getFixedImageUrl(coverUrl);
    const fixedCoverImage = getFixedImageUrl(coverImage);
    
    if (fixedCoverUrl) {
      console.log(`${title}: coverUrlを使用 - ${fixedCoverUrl}`);
      return { uri: fixedCoverUrl } as ImageSourcePropType;
    }
    
    if (fixedCoverImage) {
      console.log(`${title}: coverImageを使用 - ${fixedCoverImage}`);
      return { uri: fixedCoverImage } as ImageSourcePropType;
    }
    
    console.log(`${title}: デフォルト画像を使用`);
    return { uri: defaultBookCover } as ImageSourcePropType;
  }, [book, imageError, coverUrl, coverImage, title]);
  
  // 画像読み込みエラー処理
  const handleImageError = () => {
    console.log(`Image error for book: ${title}`);
    setImageError(true);
  };
  
  // レーティング表示
  const renderRating = () => {
    if (!showRating || !rating) return null;
    
    return (
      <View style={styles.ratingContainer}>
        <Star size={12} color={colors.accent.main} fill={colors.accent.main} />
        <Typography 
          variant="caption" 
          style={styles.ratingText}
        >
          {rating.toFixed(1)}
        </Typography>
      </View>
    );
  };

  const renderStatus = () => {
    if (!showStatus || !status) return null;
    
    let statusText = '';
    let statusColor = '';
    
    switch(status) {
      case 'reading':
        statusText = t('books.reading');
        statusColor = colors.primary.main;
        break;
      case 'completed':
        statusText = t('books.completed');
        statusColor = colors.accent.main;
        break;
      case 'planned':
        statusText = t('books.toRead');
        statusColor = colors.gray[500];
        break;
      case 'on-hold':
        statusText = t('books.onHold');
        statusColor = colors.status.warning;
        break;
      case 'dropped':
        statusText = t('books.dropped');
        statusColor = colors.status.error;
        break;
    }
    
    return (
      <View style={[styles.statusContainer, { backgroundColor: `${statusColor}20` }]}>
        <Typography 
          variant="caption" 
          color={statusColor}
          style={styles.statusText}
        >
          {statusText}
        </Typography>
      </View>
    );
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity 
        style={[styles.listCard, style]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.listCoverContainer}>
          <Image 
            source={coverSource} 
            style={styles.listCover}
            onError={handleImageError}
          />
        </View>
        <View style={styles.listContent}>
          <View style={styles.listContentTop}>
            <Typography variant="title" numberOfLines={2} style={styles.title}>
              {title}
            </Typography>
            <Typography variant="caption" color={colors.gray[500]} numberOfLines={1} style={styles.author}>
              {author}
            </Typography>
          </View>
          <View style={styles.listContentBottom}>
            {renderStatus()}
            {renderRating()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity 
        style={[styles.horizontalCard, style]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.horizontalCoverWrapper}>
          <Image 
            source={coverSource} 
            style={styles.horizontalCover}
            onError={handleImageError}
          />
        </View>
        <View style={styles.horizontalContent}>
          <View>
            <Typography variant="title" numberOfLines={2} style={styles.title}>
              {title}
            </Typography>
            <Typography variant="caption" color={colors.gray[500]} numberOfLines={1} style={styles.author}>
              {author}
            </Typography>
          </View>
          <View>
            {renderStatus()}
            {renderRating()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[styles.compactCard, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactCoverWrapper}>
          <Image 
            source={coverSource} 
            style={styles.compactCover}
            onError={handleImageError}
          />
        </View>
        <View style={styles.compactContent}>
          <Typography variant="caption" numberOfLines={2} style={styles.compactTitle}>
            {title}
          </Typography>
          <Typography variant="caption" color={colors.gray[500]} numberOfLines={1} style={styles.author}>
            {author}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.gridCard, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.coverShadow}>
        <Image 
          source={coverSource} 
          style={styles.gridCover}
          onError={handleImageError}
        />
      </View>
      <View style={styles.gridContent}>
        <Typography variant="body" numberOfLines={2} style={styles.title}>
          {title}
        </Typography>
        <Typography variant="caption" color={colors.gray[500]} numberOfLines={1} style={styles.author}>
          {author}
        </Typography>
        {renderStatus()}
        {renderRating()}
      </View>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;
const gridCardWidth = (windowWidth - (spacing.md * 3) - spacing.md) / 2;
const CARD_ASPECT_RATIO = 0.6; // 幅と高さの比率

const styles = StyleSheet.create({
  gridCard: {
    width: gridCardWidth,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  coverShadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  gridCover: {
    backgroundColor: colors.gray[100],
    width: "100%",
    height: 140,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  gridCoverPlaceholder: {
    width: '100%',
    height: gridCardWidth * 1.5,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContent: {
    padding: spacing.sm,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
    padding: spacing.sm,
  },
  horizontalCoverWrapper: {
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  horizontalCover: {
    width: 70,
    height: 105,
    borderRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  horizontalCoverPlaceholder: {
    width: 70,
    height: 105,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContent: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'space-between',
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  listCoverContainer: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    borderRadius: borderRadius.md,
  },
  listCover: {
    width: 50,
    height: 75,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  listCoverPlaceholder: {
    width: 50,
    height: 75,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'space-between',
  },
  listContentTop: {
    flex: 1,
  },
  listContentBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  author: {
    marginBottom: spacing.xs,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: spacing.xs,
    color: colors.gray[700],
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
  },
  compactCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    width: 110,
  },
  compactCoverWrapper: {
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  compactCover: {
    width: 110,
    height: 150,
    borderRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  compactCoverPlaceholder: {
    width: 110,
    height: 150,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContent: {
    padding: spacing.sm,
  },
  compactTitle: {
    marginBottom: spacing.xs,
    fontSize: 12,
  },
}); 