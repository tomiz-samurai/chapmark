import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book, Plus, X, Save } from 'lucide-react-native';
import { colors, spacing } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { EmptyState } from '../../components/common/EmptyState';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { getBooksByStatus, Book as BookType, addBookToLibrary, getUserBooks, getUserBooksByStatus } from '../../lib/services/BookService';
import { BookCard } from '../../components/common/BookCard';
import { useAppTranslation } from '../../hooks/useAppTranslation';

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

type BookStatus = 'reading' | 'completed' | 'planned' | 'all';
type BookServiceStatus = 'reading' | 'completed' | 'planned' | 'on-hold' | 'dropped';

const STATUS_TABS = [
  { label: 'books.filters.all', value: 'all' },
  { label: 'books.filters.reading', value: 'reading' },
  { label: 'books.filters.completed', value: 'completed' },
  { label: 'books.filters.planned', value: 'planned' },
];

export default function LibraryScreen() {
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
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
      id: `local-${Date.now()}`, // 一意のID
      title: newBookTitle,
      author: newBookAuthor,
      coverUrl: defaultCoverUrl,
      coverImage: defaultCoverUrl, // 両方のプロパティを設定
      description: t('books.form.manuallyAddedDescription'),
    };
    
    // BookServiceを使用して本を追加
    const status = newBookStatus === 'all' ? 'planned' : newBookStatus as any;
    addBookToLibrary(newBook, status);
    
    // 本の一覧を更新
    refreshBooks();
    
    // モーダルを閉じてフォームをリセット
    setModalVisible(false);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookStatus('planned');
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('navigation.books')}
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
      />

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

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredBooks.length === 0 ? (
          <EmptyState
            icon={<Book size={48} color={colors.gray[400]} />}
            title={t('books.emptyState.title')}
            message={t('books.emptyState.message')}
            isTitleTranslationKey={true}
            isMessageTranslationKey={true}
          />
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              variant="list"
              showRating={false}
              showStatus={true}
              onPress={() => navigateToBookDetail(book.id, '/(tabs)/library')}
              style={styles.card}
            />
          ))
        )}
      </ScrollView>
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
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
});