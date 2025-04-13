import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { colors, spacing } from '../../constants/theme';
import { Quote } from '../../lib/types';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../lib/utils/dateUtils';

interface QuoteItemProps {
  quote: Quote;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const QuoteItem = ({ 
  quote, 
  onPress, 
  onEdit, 
  onDelete, 
  showActions = false 
}: QuoteItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.quoteContainer}>
        <View style={styles.quoteIconContainer}>
          <Ionicons name="quote" size={20} color={colors.primary.main} />
        </View>
        <Typography variant="body" style={styles.quoteText}>
          {quote.text}
        </Typography>
      </View>

      {quote.insight && (
        <View style={styles.insightContainer}>
          <Typography variant="body" style={styles.insightText}>
            {quote.insight}
          </Typography>
        </View>
      )}

      <View style={styles.metaContainer}>
        <View style={styles.leftMeta}>
          {quote.pageNumber && (
            <Typography variant="caption" style={styles.pageText}>
              P.{quote.pageNumber}
            </Typography>
          )}
          {quote.chapter && (
            <Typography variant="caption" style={styles.chapterText}>
              | {quote.chapter}
            </Typography>
          )}
        </View>

        <Typography variant="caption" style={styles.dateText}>
          {formatDate(quote.createdAt)}
        </Typography>
      </View>

      {showActions && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color={colors.gray[600]} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color={colors.gray[600]} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.main,
  },
  quoteContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  quoteIconContainer: {
    marginRight: spacing.xs,
    alignSelf: 'flex-start',
  },
  quoteText: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[800],
    fontStyle: 'italic',
    lineHeight: 22,
  },
  insightContainer: {
    marginBottom: spacing.sm,
    paddingLeft: spacing.lg,
  },
  insightText: {
    color: colors.gray[700],
    fontSize: 14,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageText: {
    color: colors.gray[600],
    fontSize: 12,
  },
  chapterText: {
    color: colors.gray[600],
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  dateText: {
    color: colors.gray[500],
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
}); 