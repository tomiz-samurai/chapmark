import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Pressable, TouchableOpacity, Modal, TextInput, Alert, Platform, ScrollView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book, Plus, X, Save, Search, Grid, List, Filter, ArrowUp, ArrowDown } from 'lucide-react-native';
import { colors, spacing } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { EmptyState } from '../../components/common/EmptyState';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { getBooksByStatus, Book as BookType, addBookToLibrary, getUserBooks, getUserBooksByStatus, searchBooks } from '../../lib/services/BookService';
import { BookCard } from '../../components/common/BookCard';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// BookServiceで使用するためにエクスポート (互換性のため)
export const MOCK_BOOKS = [
  {
    id: '1',
    title: 'エッセンシャル思考',
    author: 'グレッグ・マキューン',
    status: 'reading',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
  },
  {
    id: '2',
    title: '独学大全',
    author: '読書猿',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1976&ixlib=rb-4.0.3',
  },
  {
    id: '3',
    title: 'ハリー・ポッターと賢者の石',
    author: 'J.K.ローリング',
    status: 'planned',
    coverImage: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3',
  },
  // モックデータから追加した本
  {
    id: '101',
    title: '原因と結果の経済学',
    author: 'ジョシュア・D・アングリスト, ヨーン=スタイン・ピスケ',
    description: 'ビッグデータ時代の「因果関係」の見つけ方を解説する革新的な入門書。様々な実例を通じて、相関と因果の違いやバイアスを回避する方法を学べます。',
    coverUrl: 'https://m.media-amazon.com/images/I/71xZh4-WDIL._AC_UF1000,1000_QL80_.jpg',
    publisher: '日経BP',
    publishedDate: '2021-06-17',
    pageCount: 464,
    category: ['ビジネス', '経済学', 'データサイエンス'],
    rating: 4.5,
    status: 'reading',
  },
  {
    id: '102',
    title: 'FACTFULNESS（ファクトフルネス）',
    author: 'ハンス・ロスリング, オーラ・ロスリング, アンナ・ロスリング・ロンランド',
    description: '私たちはなぜ世界を誤解するのか。統計データを基に、世界の真実を伝え、ものの見方を変える10の思考法を紹介します。',
    coverUrl: 'https://m.media-amazon.com/images/I/71L6xSMpoPL._AC_UF1000,1000_QL80_.jpg',
    publisher: '日経BP',
    publishedDate: '2019-01-31',
    pageCount: 400,
    category: ['自己啓発', '思考法', '国際関係'],
    rating: 4.7,
    status: 'planned',
  },
  {
    id: '103',
    title: 'マーケティング5.0',
    author: 'フィリップ・コトラー',
    description: 'AIやIoTなどのテクノロジーを活用した次世代マーケティングの全貌。顧客体験を最大化するための実践的フレームワークを提供します。',
    coverUrl: 'https://m.media-amazon.com/images/I/71dBnK8aGqL._AC_UF1000,1000_QL80_.jpg',
    publisher: 'KADOKAWA',
    publishedDate: '2023-10-25',
    pageCount: 360,
    category: ['マーケティング', 'デジタル戦略', 'ビジネス'],
    rating: 4.2,
    status: 'reading',
  },
  {
    id: '104',
    title: 'アルゴリズムマネジメント',
    author: '及川卓也',
    description: '複雑化する現代社会で成果を上げるための「思考と実行の最適化」を解説。ソフトウェア開発の知見からビジネスパーソンの生産性向上に役立つ方法論を紹介。',
    coverUrl: 'https://m.media-amazon.com/images/I/714rk+aGc9L._AC_UF1000,1000_QL80_.jpg',
    publisher: 'ダイヤモンド社',
    publishedDate: '2023-11-30',
    pageCount: 288,
    category: ['生産性向上', 'マネジメント', 'テクノロジー'],
    rating: 4.4,
    status: 'completed',
  },
  {
    id: '105',
    title: 'LEADERSHIP（リーダーシップ）論文と事例で学ぶ',
    author: 'ハーバード・ビジネス・レビュー編集部',
    description: 'リーダーシップに関する最重要概念と実践的手法を集めた一冊。ハーバード・ビジネス・レビューの名論文と事例から、効果的なリーダーシップを学びます。',
    coverUrl: 'https://m.media-amazon.com/images/I/81GXwrKT9ML._AC_UF1000,1000_QL80_.jpg',
    publisher: 'ダイヤモンド社', 
    publishedDate: '2018-11-22',
    pageCount: 352,
    category: ['ビジネス', 'リーダーシップ', 'マネジメント'],
    rating: 4.3,
    status: 'completed',
  },
];

type BookStatus = 'reading' | 'completed' | 'planned' | 'on-hold' | 'dropped' | 'all';
type SortOption = 'title' | 'author' | 'recent' | 'none';
type SortDirection = 'asc' | 'desc';

const STATUS_TABS = [
  { label: 'books.filters.all', value: 'all' },
  { label: 'books.filters.reading', value: 'reading' },
  { label: 'books.filters.completed', value: 'completed' },
  { label: 'books.filters.planned', value: 'planned' },
  { label: 'books.filters.onHold', value: 'on-hold' },
  { label: 'books.filters.dropped', value: 'dropped' },
];

const SORT_OPTIONS = [
  { label: 'books.sort.title', value: 'title' },
  { label: 'books.sort.author', value: 'author' },
  { label: 'books.sort.recent', value: 'recent' },
];

// AsyncStorageのキー
const VIEW_MODE_STORAGE_KEY = 'chapmark_library_view_mode';
const SORT_OPTION_STORAGE_KEY = 'chapmark_library_sort_option';
const SORT_DIRECTION_STORAGE_KEY = 'chapmark_library_sort_direction';

export default function LibraryScreen() {
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortModal, setShowSortModal] = useState(false);
  const { navigateToBookDetail } = useBookNavigation();
  const { t } = useAppTranslation();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  
  // 追加モーダル関連の状態
  const [isModalVisible, setModalVisible] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookStatus, setNewBookStatus] = useState<BookStatus>('planned');
  
  // 本の一覧を保持する状態変数
  const [books, setBooks] = useState<BookType[]>([]);
  
  // 設定を読み込む
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedViewMode = await AsyncStorage.getItem(VIEW_MODE_STORAGE_KEY);
        if (savedViewMode) {
          setViewMode(savedViewMode as 'grid' | 'list');
        }
        
        const savedSortOption = await AsyncStorage.getItem(SORT_OPTION_STORAGE_KEY);
        if (savedSortOption) {
          setSortOption(savedSortOption as SortOption);
        }
        
        const savedSortDirection = await AsyncStorage.getItem(SORT_DIRECTION_STORAGE_KEY);
        if (savedSortDirection) {
          setSortDirection(savedSortDirection as SortDirection);
        }
      } catch (error) {
        console.error('設定の読み込みに失敗しました:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // 設定を保存する
  const saveViewMode = async (mode: 'grid' | 'list') => {
    try {
      await AsyncStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.error('表示モードの保存に失敗しました:', error);
    }
  };
  
  const saveSortSettings = async (option: SortOption, direction: SortDirection) => {
    try {
      await AsyncStorage.setItem(SORT_OPTION_STORAGE_KEY, option);
      await AsyncStorage.setItem(SORT_DIRECTION_STORAGE_KEY, direction);
    } catch (error) {
      console.error('並び替え設定の保存に失敗しました:', error);
    }
  };
  
  // 本の一覧を更新する関数
  const refreshBooks = () => {
    // 本棚に追加された本のみを取得
    const userBooks = getUserBooks();
    setBooks(userBooks);
  };
  
  // 初回レンダリング時と状態変更時に本の一覧を更新
  useEffect(() => {
    refreshBooks();
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  // 選択されたステータスに基づいて本をフィルタリング
  let filteredBooks: BookType[] = [];
  if (selectedStatus === 'all') {
    filteredBooks = books;
  } else {
    filteredBooks = getUserBooksByStatus(selectedStatus);
  }

  // 検索クエリが入力されている場合、さらにフィルタリング
  if (searchQuery.trim()) {
    const lowercaseQuery = searchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      book.author.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // 選択されたオプションで並び替え
  if (sortOption !== 'none') {
    filteredBooks = [...filteredBooks].sort((a, b) => {
      let compareResult = 0;
      
      switch (sortOption) {
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'author':
          compareResult = a.author.localeCompare(b.author);
          break;
        case 'recent':
          // IDにローカルタイムスタンプが含まれている場合の並び替え
          // 'local-1234567890' のような形式を想定
          const aTimestamp = a.id.startsWith('local-') ? parseInt(a.id.split('-')[1]) : 0;
          const bTimestamp = b.id.startsWith('local-') ? parseInt(b.id.split('-')[1]) : 0;
          compareResult = bTimestamp - aTimestamp; // 新しい順（降順）
          break;
      }
      
      // 昇順/降順の適用（recentの場合は反転しない）
      if (sortOption !== 'recent') {
        return sortDirection === 'asc' ? compareResult : -compareResult;
      }
      return compareResult;
    });
  }

  const handleNotificationPress = () => {
    // 通知画面への遷移などの処理
    console.log('Notification pressed');
  };
  
  // 新しい本を追加する処理
  const handleAddBook = () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      Alert.alert(t('common.error'), t('books.form.requiredFieldsError'));
      return;
    }
    
    // デフォルトのカバー画像URL
    const defaultCoverUrl = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    
    // 新しい本のデータを作成
    const newBook: BookType = {
      id: `local-${Date.now()}`, // 一意のID（タイムスタンプを含む）
      title: newBookTitle,
      author: newBookAuthor,
      coverUrl: defaultCoverUrl,
      coverImage: defaultCoverUrl, // 両方のプロパティを設定
      description: t('books.form.manuallyAddedDescription'),
    };
    
    // BookServiceを使用して本を追加
    const status = newBookStatus === 'all' ? 'planned' : newBookStatus;
    addBookToLibrary(newBook, status);
    
    // 本の一覧を更新
    refreshBooks();
    
    // モーダルを閉じてフォームをリセット
    setModalVisible(false);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookStatus('planned');
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(newMode);
    saveViewMode(newMode);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  const handleSortChange = (option: SortOption) => {
    // 同じオプションが選択された場合は昇順/降順を切り替える
    if (option === sortOption) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      saveSortSettings(option, newDirection);
    } else {
      // 新しいオプションが選択された場合
      setSortOption(option);
      setSortDirection('asc');
      saveSortSettings(option, 'asc');
    }
    setShowSortModal(false);
  };
  
  const renderSortIcon = (option: SortOption) => {
    if (sortOption !== option) return null;
    
    if (sortDirection === 'asc') {
      return <ArrowUp size={16} color={colors.primary.main} />;
    }
    return <ArrowDown size={16} color={colors.primary.main} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('navigation.books')}
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
        rightContent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleSearch} style={styles.headerButton}>
              <Search size={22} color={colors.gray[700]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSortModal(true)} style={styles.headerButton}>
              <Filter size={22} color={colors.gray[700]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleViewMode} style={styles.headerButton}>
              {viewMode === 'list' ? 
                <Grid size={22} color={colors.gray[700]} /> : 
                <List size={22} color={colors.gray[700]} />
              }
            </TouchableOpacity>
          </View>
        }
      />

      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={colors.gray[500]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('books.searchPlaceholder')}
              placeholderTextColor={colors.gray[400]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color={colors.gray[500]} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {STATUS_TABS.map((tab) => (
            <Pressable
              key={tab.value}
              style={[
                styles.tab,
                selectedStatus === tab.value && styles.selectedTab,
              ]}
              onPress={() => {
                setSelectedStatus(tab.value as BookStatus);
                // ステータスが変更された時も本のリストを更新
                if (tab.value === 'all') {
                  refreshBooks();
                }
              }}
            >
              <Typography
                variant="caption"
                style={[
                  styles.tabText,
                  selectedStatus === tab.value && styles.selectedTabText,
                ]}
              >
                {t(tab.label)}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredBooks}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // ビューモード切替時にリレイアウトさせるため
        renderItem={({item}) => (
          <BookCard
            book={item}
            variant={viewMode === 'grid' ? 'grid' : 'list'}
            showRating={false}
            showStatus={true}
            onPress={() => navigateToBookDetail(item.id, '/(tabs)/library')}
            style={viewMode === 'grid' ? styles.gridCard : styles.card}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.contentContainer,
          filteredBooks.length === 0 && styles.emptyContentContainer
        ]}
        ListEmptyComponent={
          <EmptyState
            icon={<Book size={48} color={colors.gray[400]} />}
            title={searchQuery ? 'books.searchNoResults' : 'books.emptyState.title'}
            message={searchQuery ? 'books.searchNoResultsMessage' : 'books.emptyState.message'}
            isTitleTranslationKey={true}
            isMessageTranslationKey={true}
          />
        }
      />
      
      {/* 追加ボタン */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
      
      {/* 本追加モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="title">{t('books.addBook')}</Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Typography variant="caption" color={colors.gray[600]}>
                  {t('books.form.title')} *
                </Typography>
                <TextInput
                  style={styles.input}
                  value={newBookTitle}
                  onChangeText={setNewBookTitle}
                  placeholder={t('books.form.titlePlaceholder')}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Typography variant="caption" color={colors.gray[600]}>
                  {t('books.form.author')} *
                </Typography>
                <TextInput
                  style={styles.input}
                  value={newBookAuthor}
                  onChangeText={setNewBookAuthor}
                  placeholder={t('books.form.authorPlaceholder')}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Typography variant="caption" color={colors.gray[600]}>
                  {t('books.status')}
                </Typography>
                <View style={styles.statusButtonsContainer}>
                  {STATUS_TABS.filter(tab => tab.value !== 'all').map((tab) => (
                    <Pressable
                      key={tab.value}
                      style={[
                        styles.statusButton,
                        newBookStatus === tab.value && styles.selectedStatusButton,
                      ]}
                      onPress={() => setNewBookStatus(tab.value as BookStatus)}
                    >
                      <Typography
                        variant="caption"
                        style={[
                          styles.statusButtonText,
                          newBookStatus === tab.value && styles.selectedStatusButtonText,
                        ]}
                      >
                        {t(tab.label)}
                      </Typography>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddBook}
            >
              <Save size={20} color={colors.white} style={styles.saveIcon} />
              <Typography variant="body" color={colors.white}>
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
              <View style={styles.sortModalContent}>
                <View style={styles.sortModalHeader}>
                  <Typography variant="title">{t('books.sort.title')}</Typography>
                  <TouchableOpacity onPress={() => setShowSortModal(false)}>
                    <X size={24} color={colors.gray[600]} />
                  </TouchableOpacity>
                </View>
                
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      sortOption === option.value && styles.selectedSortOption
                    ]}
                    onPress={() => handleSortChange(option.value as SortOption)}
                  >
                    <Typography 
                      variant="body" 
                      color={sortOption === option.value ? colors.primary.main : colors.gray[700]}
                    >
                      {t(option.label)}
                    </Typography>
                    {renderSortIcon(option.value as SortOption)}
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
    backgroundColor: colors.gray[50],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[800],
    paddingVertical: 4,
  },
  tabsContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  tabsScrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  selectedTab: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    color: colors.gray[600],
  },
  selectedTabText: {
    color: colors.white,
  },
  contentContainer: {
    padding: spacing.md,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: spacing.sm,
  },
  gridCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: spacing.md,
  },
  addButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
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
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  formContainer: {
    marginBottom: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: spacing.xs,
    padding: spacing.sm,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statusButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  selectedStatusButton: {
    backgroundColor: colors.primary.main,
  },
  statusButtonText: {
    color: colors.gray[600],
  },
  selectedStatusButtonText: {
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    marginRight: spacing.xs,
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
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
    padding: spacing.md,
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  selectedSortOption: {
    backgroundColor: colors.primary[50],
  },
});