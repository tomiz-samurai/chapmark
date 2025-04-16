import React, { useState } from 'react';
import { View, StyleSheet, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Typography } from '../Typography';
import { QuoteInput } from '../quotes/QuoteInput';
import { NoteInput } from '../notes/NoteInput';
import { Button } from '../common';
import { colors, spacing } from '../../constants/theme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useTheme } from '../../lib/hooks/useTheme';

type EntryType = 'quote' | 'note';

interface QuickEntryModalProps {
  visible: boolean;
  onClose: () => void;
  bookId: string;
  currentPage?: number;
}

export const QuickEntryModal = ({ 
  visible, 
  onClose, 
  bookId,
  currentPage 
}: QuickEntryModalProps) => {
  const dispatch = useDispatch();
  const { t } = useAppTranslation();
  const { colors } = useTheme();
  const [entryType, setEntryType] = useState<EntryType>('quote');
  
  // 保存完了時の処理
  const handleSaveComplete = () => {
    onClose();
  };

  // モーダル外タップ時の処理
  const handleBackdropPress = () => {
    onClose();
  };

  // モーダル本体タップ時の伝播を止める
  const handleModalPress = (e: any) => {
    e.stopPropagation();
  };

  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <SafeAreaView style={[styles.modalView, { backgroundColor: colors.card }]}>
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Typography variant="title" style={{ color: colors.text }}>
                  {t('book.quickEntry')}
                </Typography>
                <TouchableOpacity 
                  onPress={onClose} 
                  style={styles.closeButton}
                  accessibilityLabel={t('common.close')}
                  accessibilityRole="button"
                >
                  <Typography variant="body" style={{ fontSize: 20, color: colors.textSecondary }}>
                    ✕
                  </Typography>
                </TouchableOpacity>
              </View>

              <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    entryType === 'quote' ? [styles.activeTabButton, { borderBottomColor: colors.primary }] : null
                  ]}
                  onPress={() => setEntryType('quote')}
                  accessibilityLabel={t('book.quotes')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: entryType === 'quote' }}
                >
                  <Typography
                    variant="body"
                    style={[
                      styles.tabButtonText,
                      { color: entryType === 'quote' ? colors.primary : colors.textSecondary }
                    ]}
                  >
                    {t('book.quotes')}
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    entryType === 'note' ? [styles.activeTabButton, { borderBottomColor: colors.primary }] : null
                  ]}
                  onPress={() => setEntryType('note')}
                  accessibilityLabel={t('book.notes')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: entryType === 'note' }}
                >
                  <Typography
                    variant="body"
                    style={[
                      styles.tabButtonText,
                      { color: entryType === 'note' ? colors.primary : colors.textSecondary }
                    ]}
                  >
                    {t('book.notes')}
                  </Typography>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps="handled">
                {entryType === 'quote' ? (
                  <QuoteInput 
                    bookId={bookId} 
                    onSave={handleSaveComplete} 
                    initialQuote={
                      currentPage ? { text: '', insight: '', pageNumber: currentPage } : undefined
                    }
                  />
                ) : (
                  <NoteInput 
                    bookId={bookId} 
                    onSave={handleSaveComplete} 
                    initialNote={
                      currentPage ? { content: '', pageNumber: currentPage } : undefined
                    }
                  />
                )}
              </ScrollView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 16,
  },
}); 