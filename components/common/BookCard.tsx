import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Book } from '../../lib/mockData';
import { colors, shadows, borderRadius, spacing, typography } from '../../constants/theme';
import { Typography } from '../Typography';
import { Star } from 'lucide-react-native';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  style?: any;
  variant?: 'grid' | 'horizontal';
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onPress, 
  style,
  variant = 'grid'
}) => {
  const { title, author, coverUrl, rating } = book;
  
  const renderRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Star size={14} color={colors.accent.main} fill={colors.accent.main} />
        <Typography 
          variant="caption" 
          style={styles.ratingText}
        >
          {rating.toFixed(1)}
        </Typography>
      </View>
    );
  };

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity 
        style={[styles.horizontalCard, style]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image source={{ uri: coverUrl }} style={styles.horizontalCover} />
        <View style={styles.horizontalContent}>
          <Typography variant="title" numberOfLines={2} style={styles.title}>
            {title}
          </Typography>
          <Typography variant="caption" color={colors.gray[500]} numberOfLines={1} style={styles.author}>
            {author}
          </Typography>
          {renderRating()}
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
      <Image source={{ uri: coverUrl }} style={styles.gridCover} />
      <View style={styles.gridContent}>
        <Typography variant="body" numberOfLines={2} style={styles.title}>
          {title}
        </Typography>
        <Typography variant="caption" color={colors.gray[500]} numberOfLines={1} style={styles.author}>
          {author}
        </Typography>
        {renderRating()}
      </View>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;
const gridCardWidth = (windowWidth - (spacing.md * 2) - spacing.md) / 2;

const styles = StyleSheet.create({
  gridCard: {
    width: gridCardWidth,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  gridCover: {
    width: '100%',
    height: gridCardWidth * 1.5,
    resizeMode: 'cover',
  },
  gridContent: {
    padding: spacing.md,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  horizontalCover: {
    width: 80,
    height: 120,
    resizeMode: 'cover',
  },
  horizontalContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: spacing.xs,
  },
  author: {
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: spacing.xs,
    color: colors.gray[700],
    fontFamily: typography.fontFamily.semiBold,
  },
}); 