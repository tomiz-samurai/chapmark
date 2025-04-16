import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book as BookIcon, Plus, X, Save, Search, Grid, List, Filter } from 'lucide-react-native';
import { View, StyleSheet, Modal, Alert, Platform, TouchableOpacity } from 'react-native';
import { Header } from '../../components/layouts/Header';
import { Loading } from '../../components/common';
import { Typography } from '../../components/Typography';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useLibrary, SORT_OPTIONS } from '../../lib/hooks/useLibrary';
import { BookGrid } from '../../components/books/BookGrid';
import { BookList } from '../../components/books/BookList';
import { Book } from '../../types/models/book';
import { FilterBar } from '../../components/books/FilterBar';
import { useTheme } from '../../lib/hooks/useTheme';
import { Input } from '../../components/common/inputs/Input';
import { useState } from 'react';
import { colors as baseColors } from '../../constants/theme';
import { EmptyState } from '../../components/common/displays/EmptyState';

export default function LibraryScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();
  const { navigateToBookDetail } = useBookNavigation();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  
  // useLibraryフックから状態と関数を取得
  const {
    filteredBooks,
    selectedStatus,
    viewMode,
    searchQuery,
    showSearch,
    sortOption,
    sortDirection,
    showSortModal,
    isAddModalVisible,
    newBookTitle,
    newBookAuthor,
    newBookStatus,
    error,
    setError,
    
    setSelectedStatus,
    setSearchQuery,
    toggleViewMode,
    toggleSearch,
    setShowSortModal,
    handleSortChange,
    setAddModalVisible,
    setNewBookTitle,
    setNewBookAuthor,
    setNewBookStatus,
    handleAddBook,
    resetAddForm,
    refreshBooks
  } = useLibrary();

  // 追加: バリデーションエラー状態
  const [titleError, setTitleError] = useState<string | undefined>(undefined);
  const [authorError, setAuthorError] = useState<string | undefined>(undefined);

  const handleNotificationPress = () => {
    // 通知画面への遷移などの処理
    console.log('Notification pressed');
  };
  
  // 本追加の処理
  const submitAddBook = () => {
    let hasError = false;
    if (!newBookTitle.trim()) {
      setTitleError(t('books.form.requiredTitleError'));
      hasError = true;
    } else {
      setTitleError(undefined);
    }
    if (!newBookAuthor.trim()) {
      setAuthorError(t('books.form.requiredAuthorError'));
      hasError = true;
    } else {
      setAuthorError(undefined);
    }
    if (hasError) return;
    const success = handleAddBook();
    if (!success) {
      // 追加失敗時のエラー（通常はここに来ない想定）
      Alert.alert(t('common.error'), t('books.form.requiredFieldsError'));
    } else {
      // 成功時はフォームリセット
      setTitleError(undefined);
      setAuthorError(undefined);
    }
  };
  
  // ソートアイコンの表示
  const renderSortIcon = (option: typeof SORT_OPTIONS[number]['value']) => {
    if (sortOption !== option) return null;
    
    return (
      <Typography variant="body" color={colors.primary}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </Typography>
    );
  };

  if (!fontsLoaded) {
    return <Loading />;
  }

  // 致命的エラー時はEmptyStateで表示
  if (error) {
    return (
      <EmptyState
        icon={<X size={48} color={colors.error} />}
        title={t('common.error')}
        message={t(error)}
        actionLabel={t('common.retry')}
        onAction={() => {
          setError(null);
          refreshBooks();
        }}
        isTitleTranslationKey={false}
        isMessageTranslationKey={false}
        isActionLabelTranslationKey={false}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={t('navigation.books')}
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
        rightContent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleSearch} style={styles.headerButton}>
              <Search size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSortModal(true)} style={styles.headerButton}>
              <Filter size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleViewMode} style={styles.headerButton}>
              {viewMode === 'list' ? 
                <Grid size={22} color={colors.text} /> : 
                <List size={22} color={colors.text} />
              }
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* フィルターバー */}
      <FilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showSearch={showSearch}
        onToggleSearch={toggleSearch}
      />
      
      {/* 本の一覧表示（グリッドまたはリスト） */}
      {viewMode === 'grid' ? (
        <BookGrid
          books={filteredBooks}
          onBookPress={(id) => navigateToBookDetail(id, '/(tabs)/library')}
          searchQuery={searchQuery}
        />
      ) : (
        <BookList
          books={filteredBooks}
          onBookPress={(id) => navigateToBookDetail(id, '/(tabs)/library')}
          searchQuery={searchQuery}
        />
      )}
      
      {/* 追加ボタン */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]} 
        onPress={() => setAddModalVisible(true)}
        accessibilityLabel={t('books.addBook')}
        accessibilityRole="button"
      >
        <Plus size={24} color={baseColors.white} />
      </TouchableOpacity>
      
      {/* 本追加モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.background }]}>
              <Typography variant="title">{t('books.addBook')}</Typography>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Input
                  label={t('books.form.title') + ' *'}
                  value={newBookTitle}
                  onChangeText={setNewBookTitle}
                  placeholder={t('books.form.titlePlaceholder')}
                  error={titleError}
                  autoFocus
                />
              </View>
              
              <View style={styles.formGroup}>
                <Input
                  label={t('books.form.author') + ' *'}
                  value={newBookAuthor}
                  onChangeText={setNewBookAuthor}
                  placeholder={t('books.form.authorPlaceholder')}
                  error={authorError}
                />
              </View>
              
              {/* 本のステータス選択 */}
              <View style={styles.formGroup}>
                <Typography variant="caption" color={colors.text}>
                  {t('books.status')}
                </Typography>
                <View style={styles.statusButtonsContainer}>
                  {Array.from(new Set(
                    ['reading', 'completed', 'planned', 'on-hold', 'dropped']
                  )).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        { backgroundColor: colors.background },
                        newBookStatus === status && [
                          styles.selectedStatusButton,
                          { backgroundColor: colors.primary }
                        ],
                      ]}
                      onPress={() => setNewBookStatus(status as any)}
                    >
                      <Typography
                        variant="caption"
                        style={[
                          { color: colors.text },
                          newBookStatus === status && { color: baseColors.white },
                        ]}
                      >
                        {t(`books.filters.${status === 'on-hold' ? 'onHold' : status}`)}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={submitAddBook}
            >
              <Save size={20} color={baseColors.white} style={styles.saveIcon} />
              <Typography variant="body" color={baseColors.white}>
                {t('common.save')}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* 並び替えモーダル */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSortModal}
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          style={styles.sortModalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModalContainer}>
            <TouchableOpacity 
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
            >
              <View style={[styles.sortModalContent, { backgroundColor: colors.card }]}>
                <View style={[styles.sortModalHeader, { borderBottomColor: colors.background }]}>
                  <Typography variant="title">{t('books.sort.title')}</Typography>
                  <TouchableOpacity onPress={() => setShowSortModal(false)}>
                    <X size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
                
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      { borderBottomColor: colors.background },
                      sortOption === option.value && { backgroundColor: colors.background }
                    ]}
                    onPress={() => handleSortChange(option.value as any)}
                  >
                    <Typography 
                      variant="body" 
                      color={sortOption === option.value ? colors.primary : colors.text}
                    >
                      {t(option.label)}
                    </Typography>
                    {renderSortIcon(option.value)}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  formContainer: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginTop: 6,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedStatusButton: {},
  saveButton: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    marginRight: 8,
  },
  sortModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sortModalContainer: {
    backgroundColor: 'transparent',
  },
  sortModalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});