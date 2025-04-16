import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Text 
} from 'react-native';
import { Note } from '../../types/models';
import { NoteItem } from './NoteItem';
import { colors, spacing } from '../../constants/theme';
import { FileText } from 'lucide-react-native';

interface NoteListProps {
  notes: Note[];
  onPressNote?: (note: Note) => void;
  onEditNote?: (note: Note) => void;
  onDeleteNote?: (note: Note) => void;
  loading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  filterTag?: string;
}

/**
 * メモリスト表示コンポーネント
 */
export const NoteList: React.FC<NoteListProps> = ({
  notes,
  onPressNote,
  onEditNote,
  onDeleteNote,
  loading = false,
  emptyMessage = 'メモがありません',
  showActions = true,
  filterTag
}) => {
  // タグでフィルタリング
  const filteredNotes = filterTag 
    ? notes.filter(note => note.tags && note.tags.includes(filterTag))
    : notes;

  // ローディング表示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  // メモがない場合の表示
  if (filteredNotes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FileText size={48} color={colors.gray[400]} />
        <Text style={styles.emptyText}>
          {filterTag ? `タグ "${filterTag}" のメモはありません` : emptyMessage}
        </Text>
      </View>
    );
  }

  // メモリスト表示
  return (
    <FlatList
      data={filteredNotes}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <NoteItem
          note={item}
          onPress={onPressNote}
          onEdit={onEditNote}
          onDelete={onDeleteNote}
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