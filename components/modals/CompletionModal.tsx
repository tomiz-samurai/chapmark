import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Typography } from '../Typography';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import TimerService, { calculateProgress, calculateReadPages, formatTime } from '../../lib/services/TimerService';

interface CompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (currentPage: number, totalPages: number) => void;
  startPage: number | null;
  initialCurrentPage?: number;
  initialTotalPages?: number;
  readingTime: number;
}

/**
 * 読書完了時のモーダルコンポーネント
 * 読書記録の最終確認や統計情報を表示する
 */
export function CompletionModal({
  visible,
  onClose,
  onSave,
  startPage,
  initialCurrentPage,
  initialTotalPages,
  readingTime,
}: CompletionModalProps) {
  const { colors } = useTheme();
  const { t } = useAppTranslation();
  
  // ローカル状態
  const [currentPage, setCurrentPage] = useState<number | undefined>(initialCurrentPage);
  const [totalPages, setTotalPages] = useState<number | undefined>(initialTotalPages);
  
  // 初期値が変更されたら状態を更新
  useEffect(() => {
    setCurrentPage(initialCurrentPage);
    setTotalPages(initialTotalPages);
  }, [initialCurrentPage, initialTotalPages]);
  
  // 現在のページ入力検証・更新
  const validateAndUpdateCurrentPage = (text: string) => {
    const page = parseInt(text, 10);
    
    if (!isNaN(page) && page >= 0) {
      setCurrentPage(page);
    } else if (text === '') {
      setCurrentPage(undefined);
    }
  };

  // 全ページ数入力検証・更新
  const validateAndUpdateTotalPages = (text: string) => {
    const pages = parseInt(text, 10);
    
    if (!isNaN(pages) && pages > 0) {
      setTotalPages(pages);
    } else if (text === '') {
      setTotalPages(undefined);
    }
  };
  
  // 進捗率を計算
  const getProgress = (): number => {
    return calculateProgress(currentPage, totalPages);
  };

  // 読んだページ数を計算
  const getReadPages = (): number => {
    return calculateReadPages(startPage, currentPage);
  };
  
  // 保存処理
  const handleSave = () => {
    if (currentPage !== undefined && totalPages !== undefined) {
      onSave(currentPage, totalPages);
    }
  };
  
  return (
    <Modal
      visible={visible}
      title={t('timer.sessionCompleted')}
      onClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Typography variant="caption" style={{ color: colors.textSecondary }}>
              {t('timer.readingTime')}
            </Typography>
            <Typography variant="body" style={{ color: colors.text, fontWeight: '600' }}>
              {formatTime(readingTime)}
            </Typography>
          </View>
          
          <View style={styles.statItem}>
            <Typography variant="caption" style={{ color: colors.textSecondary }}>
              {t('timer.pagesRead')}
            </Typography>
            <Typography variant="body" style={{ color: colors.text, fontWeight: '600' }}>
              {getReadPages()} {t('timer.pages')}
            </Typography>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Typography variant="body" style={{ color: colors.text, marginBottom: 12 }}>
            {t('timer.confirmProgress')}
          </Typography>
          
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Typography variant="caption" style={{ color: colors.textSecondary }}>
                {t('timer.current')}
              </Typography>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text
                }]}
                value={currentPage?.toString()}
                onChangeText={validateAndUpdateCurrentPage}
                keyboardType="number-pad"
                returnKeyType="done"
                accessibilityLabel={t('timer.current')}
                accessibilityHint={t('timer.currentPage')}
              />
            </View>
            
            <Typography style={{ color: colors.textSecondary, marginHorizontal: 12 }}>
              /
            </Typography>
            
            <View style={styles.inputGroup}>
              <Typography variant="caption" style={{ color: colors.textSecondary }}>
                {t('timer.total')}
              </Typography>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text
                }]}
                value={totalPages?.toString()}
                onChangeText={validateAndUpdateTotalPages}
                keyboardType="number-pad"
                returnKeyType="done"
                accessibilityLabel={t('timer.total')}
                accessibilityHint={t('timer.totalPages')}
              />
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={getProgress()} 
              height={6} 
              showPercentage={true}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={t('timer.saveRecord')}
            onPress={handleSave}
            variant="primary"
            disabled={currentPage === undefined || totalPages === undefined}
          />
          
          <Button
            title={t('common.cancel')}
            onPress={onClose}
            variant="outline"
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    alignItems: 'center',
  },
  input: {
    width: 80,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  progressContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
}); 