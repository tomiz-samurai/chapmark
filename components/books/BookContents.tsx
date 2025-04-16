import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react-native';
import { TabView } from '../common';
import { QuoteList } from '../quotes/QuoteList';
import { NoteList } from '../notes/NoteList';
import { Typography } from '../Typography';
import { colors, spacing } from '../../constants/theme';
import { useBookContents } from '../../lib/hooks/useBookContents';
import { Quote, Note } from '../../types/models';
import { removeQuote } from '../../lib/store/quoteSlice';
import { removeNote } from '../../lib/store/noteSlice';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface BookContentsProps {
  bookId: string;
  onAddQuote?: () => void;
  onAddNote?: () => void;
  onEditQuote?: (quote: Quote) => void;
  onEditNote?: (note: Note) => void;
}

export const BookContents: React.FC<BookContentsProps> = ({
  bookId,
  onAddQuote,
  onAddNote,
  onEditQuote,
  onEditNote,
}) => {
  const { t } = useAppTranslation();
  const dispatch = useDispatch();
  const { quotes, notes, quotesLoading, notesLoading } = useBookContents(bookId);
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);

  // 引用削除ハンドラー
  const handleDeleteQuote = (quote: Quote) => {
    dispatch(removeQuote(quote.id));
  };

  // メモ削除ハンドラー
  const handleDeleteNote = (note: Note) => {
    dispatch(removeNote(note.id));
  };

  // タグをタップしたときのフィルタリング
  const handleTagPress = (tag: string) => {
    setFilterTag(prevTag => prevTag === tag ? undefined : tag);
  };

  // タブコンテンツの定義
  const tabs = [
    {
      key: 'quotes',
      title: t('book.quotes', '引用') + ` (${quotes.length})`,
      content: (
        <View style={styles.tabContent}>
          <QuoteList
            quotes={quotes}
            onPressQuote={() => {}}
            onEditQuote={onEditQuote}
            onDeleteQuote={handleDeleteQuote}
            loading={quotesLoading}
            emptyMessage={t('book.noQuotes', '引用がありません')}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddQuote}
          >
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'notes',
      title: t('book.notes', 'メモ') + ` (${notes.length})`,
      content: (
        <View style={styles.tabContent}>
          <NoteList
            notes={notes}
            onPressNote={() => {}}
            onEditNote={onEditNote}
            onDeleteNote={handleDeleteNote}
            loading={notesLoading}
            emptyMessage={t('book.noNotes', 'メモがありません')}
            filterTag={filterTag}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddNote}
          >
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Typography variant="title" style={styles.sectionTitle}>
        {t('book.contents', 'コンテンツ')}
      </Typography>
      
      <TabView tabs={tabs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  tabContent: {
    flex: 1,
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 