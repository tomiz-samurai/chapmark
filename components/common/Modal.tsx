import React from 'react';
import { View, StyleSheet, Modal as RNModal, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { X } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors, spacing } from '../../constants/theme';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isTitleTranslationKey?: boolean;
}

export function Modal({ visible, onClose, title, children, isTitleTranslationKey = false }: ModalProps) {
  const { t } = useAppTranslation();
  
  const displayTitle = title && isTitleTranslationKey ? t(title) : title;
  
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                {displayTitle ? (
                  <Typography variant="title" style={styles.title}>
                    {displayTitle}
                  </Typography>
                ) : (
                  <View style={styles.titlePlaceholder} />
                )}
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.gray[700]} />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                style={styles.contentScrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  titlePlaceholder: {
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  contentScrollView: {
    maxHeight: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
});