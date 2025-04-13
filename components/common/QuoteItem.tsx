import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getRelativeTime } from '../../lib/utils/dateUtils';
import { Quote } from '../../lib/types';

interface QuoteItemProps {
  quote: Quote;
  onPress?: (quote: Quote) => void;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quote: Quote) => void;
  showActions?: boolean;
}

/**
 * 引用を表示するカードコンポーネント
 */
export const QuoteItem: React.FC<QuoteItemProps> = ({
  quote,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress && onPress(quote)}
    >
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>{quote.text}</Text>
        {quote.insight && (
          <Text style={styles.insightText}>{quote.insight}</Text>
        )}
      </View>
      
      <View style={styles.metadataContainer}>
        <View style={styles.pageInfo}>
          {quote.pageNumber && (
            <Text style={styles.metadataText}>P.{quote.pageNumber}</Text>
          )}
          {quote.chapter && (
            <Text style={styles.metadataText}> | {quote.chapter}</Text>
          )}
        </View>
        
        <Text style={styles.dateText}>
          {getRelativeTime(quote.createdAt)}
        </Text>
      </View>
      
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit && onEdit(quote)}
          >
            <MaterialIcons name="edit" size={18} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete && onDelete(quote)}
          >
            <MaterialIcons name="delete" size={18} color="#555" />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quoteContainer: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginTop: 8,
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  pageInfo: {
    flexDirection: 'row',
  },
  metadataText: {
    fontSize: 12,
    color: '#777',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  actionsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
}); 