import { StyleSheet, View, ScrollView, Pressable, Image, Text } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book as BookIcon, TrendingUp, Clock } from 'lucide-react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { Header } from '../../components/layouts/Header';
import { BookCard } from '../../components/common/BookCard';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { getAllBooks, getUserBooksByStatus, Book as BookType } from '../../lib/services/BookService';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { BookStatus } from '../../types/models';

// recommendedBooksが読み込めない問題を解決するためのフォールバックデータ
const RECOMMENDED_BOOKS = [
  {
    id: '1',
    title: 'アトミック・ハビット',
    author: 'ジェームズ・クリア',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
    description: '小さな習慣が大きな成果につながる',
    publisher: 'ダイヤモンド社',
    publishedDate: '2020-01-01',
    pageCount: 272,
    category: ['自己啓発', '習慣'],
    rating: 4.8
  },
  {
    id: '2',
    title: '人を動かす',
    author: 'D・カーネギー',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1976&ixlib=rb-4.0.3',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1976&ixlib=rb-4.0.3',
    description: '対人関係の心理学',
    publisher: '創元社',
    publishedDate: '1999-01-01',
    pageCount: 304,
    category: ['ビジネス', '心理学'],
    rating: 4.7
  },
  {
    id: '3',
    title: 'マインドセット',
    author: 'キャロル・S・ドゥエック',
    coverImage: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3',
    coverUrl: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3',
    description: '「やればできる！」の研究',
    publisher: '草思社',
    publishedDate: '2016-01-01',
    pageCount: 288,
    category: ['自己啓発', '心理学'],
    rating: 4.6
  },
];

const READING_GOAL = 24; // 年間読書目標
const BOOKS_READ = 8; // 現在の読了数
const PROGRESS = (BOOKS_READ / READING_GOAL) * 100;

export default function HomeScreen() {
  const { isLargeDevice } = useResponsive();
  const { navigateToBookDetail } = useBookNavigation();
  const { t } = useAppTranslation();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // 直接フォールバックデータを使用
  const recommendedBooks = RECOMMENDED_BOOKS;
  
  // 読書中の本を取得（より堅牢な方法で）
  // getUserBooksByStatusを使用して「reading」ステータスの本を直接取得
  let currentlyReadingBooks: any[] = [];
  try {
    // 読書中（reading）ステータスの本を取得し、モデルの型に変換
    currentlyReadingBooks = getUserBooksByStatus('reading').map(book => ({
      ...book,
      status: (book.status || 'reading') as BookStatus
    }));
  } catch (error) {
    console.error('Error loading reading books:', error);
  }

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  return (
    <View style={styles.container}>
      <Header
        title={'navigation.home'}
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
        isTitleTranslationKey={true}
      />
      
      <ScrollView style={styles.content}>
        {/* 今日の読書目標 */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Typography variant="title" color={colors.white}>
              {t('home.yearlyReadingGoal')}
            </Typography>
            <Typography variant="display" color={colors.white} style={styles.goalNumber}>
              {BOOKS_READ}/{READING_GOAL}
            </Typography>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${PROGRESS}%` }]} />
          </View>
          <Typography variant="caption" color={colors.white} style={styles.goalCaption}>
            {t('home.booksToGoal', { count: READING_GOAL - BOOKS_READ })}
          </Typography>
        </View>

        {/* 読書統計 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>12.5</Typography>
            <Typography variant="caption">{t('home.weeklyReadingTime')} ({t('home.hours')})</Typography>
          </View>
          <View style={styles.statCard}>
            <BookIcon size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>3</Typography>
            <Typography variant="caption">{t('home.monthlyCompletedBooks')} ({t('home.books')})</Typography>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>+15%</Typography>
            <Typography variant="caption">{t('home.monthOnMonthChange')}</Typography>
          </View>
        </View>

        {/* おすすめの本セクション */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography variant="title">{t('home.recommendedBooks')}</Typography>
            <Pressable>
              <Typography variant="caption" style={styles.viewAllText}>{t('common.viewAll')}</Typography>
            </Pressable>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.booksScrollView}
          >
            {recommendedBooks && recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => (
                <BookCard
                  key={book?.id || `book-${Math.random()}`}
                  book={book}
                  onPress={() => console.log('Book pressed:', book?.title)}
                  style={{ marginRight: spacing.md }}
                />
              ))
            ) : (
              <Typography variant="body" style={{ padding: spacing.md }}>
                {t('home.noRecommendedBooks')}
              </Typography>
            )}
          </ScrollView>
        </View>

        {/* 現在読んでいる本セクション */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography variant="title">{t('home.currentlyReading')}</Typography>
            <Pressable>
              <Typography variant="caption" style={styles.viewAllText}>{t('common.viewAll')}</Typography>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.booksScrollView}
          >
            {Array.isArray(currentlyReadingBooks) && currentlyReadingBooks.length > 0 ? (
              currentlyReadingBooks.map((book) => (
                book ? (
                  <BookCard
                    key={book.id || `reading-${Math.random()}`}
                    book={book}
                    variant="horizontal"
                    showStatus={true}
                    style={{ marginRight: spacing.md }}
                    onPress={() => book.id ? navigateToBookDetail(book.id, '/(tabs)') : null}
                  />
                ) : null
              ))
            ) : (
              <Typography variant="body" style={{ padding: spacing.md }}>
                現在読書中の本はありません
              </Typography>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
  },
  goalCard: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.primary.main,
    borderRadius: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalNumber: {
    fontSize: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.primary.light,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.main,
    borderRadius: 4,
  },
  goalCaption: {
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    marginVertical: spacing.xs,
  },
  sectionContainer: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  booksScrollView: {
    paddingRight: spacing.md,
    gap: spacing.sm,
  },
  recommendedBookCard: {
    width: 110,
    marginRight: spacing.sm,
  },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  bookTitle: {
    marginBottom: spacing.xs,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  recommendedBooksContainer: {
    paddingRight: spacing.md,
    gap: spacing.sm,
  },
  recommendedBook: {
    width: 110,
    marginRight: spacing.sm,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
});