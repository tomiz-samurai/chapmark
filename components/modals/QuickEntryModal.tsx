import React, { useState } from 'react';
import { View, StyleSheet, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { Typography } from '../Typography';
import { QuoteInput } from '../quotes/QuoteInput';
import { NoteInput } from '../notes/NoteInput';
import { Button } from '../common/Button';
import { colors, spacing } from '../../constants/theme';

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
  const [entryType, setEntryType] = useState<EntryType>('note');
  
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
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Typography variant="title" style={styles.title}>
                  {entryType === 'quote' ? '引用を追加' : 'メモを追加'}
                </Typography>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Typography variant="body" style={styles.closeButtonText}>
                    ✕
                  </Typography>
                </TouchableOpacity>
              </View>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    entryType === 'quote' ? styles.activeTabButton : null
                  ]}
                  onPress={() => setEntryType('quote')}
                >
                  <Typography
                    variant="body"
                    style={[
                      styles.tabButtonText,
                      entryType === 'quote' ? styles.activeTabButtonText : null
                    ]}
                  >
                    引用
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    entryType === 'note' ? styles.activeTabButton : null
                  ]}
                  onPress={() => setEntryType('note')}
                >
                  <Typography
                    variant="body"
                    style={[
                      styles.tabButtonText,
                      entryType === 'note' ? styles.activeTabButtonText : null
                    ]}
                  >
                    メモ
                  </Typography>
                </TouchableOpacity>
              </View>

              <View style={styles.contentContainer}>
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
              </View>
            </View>
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
    backgroundColor: colors.gray[50],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    color: colors.gray[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.gray[500],
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.main,
  },
  tabButtonText: {
    color: colors.gray[600],
  },
  activeTabButtonText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: spacing.md,
  },
}); 