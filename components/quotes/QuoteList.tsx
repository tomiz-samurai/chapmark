import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Text 
} from 'react-native';
import { Quote } from '../../types/models';
import { QuoteItem } from '../common/QuoteItem';
import { colors, spacing } from '../../constants/theme';
import { Book } from 'lucide-react-native';

interface QuoteListProps {
  quotes: Quote[];
  onPressQuote?: (quote: Quote) => void;
  onEditQuote?: (quote: Quote) => void;
  onDeleteQuote?: (quote: Quote) => void;
  loading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
}

/**
 * 引用リスト表示コンポーネント
 */
export const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  onPressQuote,
  onEditQuote,
  onDeleteQuote,
  loading = false,
  emptyMessage = '引用がありません',
  showActions = true
}) => {
  // ローディング表示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  // 引用がない場合の表示
  if (quotes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Book size={48} color={colors.gray[400]} />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  // 引用リスト表示
  return (
    <FlatList
      data={quotes}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <QuoteItem
          quote={item}
          onPress={onPressQuote}
          onEdit={onEditQuote}
          onDelete={onDeleteQuote}
          showActions={showActions}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyContainer: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.md,
    color: colors.gray[500],
    textAlign: 'center',
  },
}); 