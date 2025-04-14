import { StyleSheet, View, ScrollView, Pressable, Image, Text } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book, TrendingUp, Clock } from 'lucide-react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { Header } from '../../components/layouts/Header';
import { BookCard } from '../../components/common/BookCard';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { getAllBooks, Book as BookType } from '../../lib/services/BookService';
import { recommendedBooks as mockRecommendedBooks } from '../../lib/mockData';
import { useAppTranslation } from '../../hooks/useAppTranslation';

const READING_GOAL = 24; // 年間読書目標
const BOOKS_READ = 8; // 現在の読了数
const PROGRESS = (BOOKS_READ / READING_GOAL) * 100;

// BookServiceで使用するためにエクスポート (互換性のため)
export const RECOMMENDED_BOOKS = [
  {
    id: '1',
    title: 'アトミック・ハビット',
    author: 'ジェームズ・クリア',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
  },
  {
    id: '2',
    title: '人を動かす',
    author: 'D・カーネギー',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1976&ixlib=rb-4.0.3',
  },
  {
    id: '3',
    title: 'マインドセット',
    author: 'キャロル・S・ドゥエック',
    coverImage: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3',
  },
];

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

  // モックデータから直接おすすめの本を取得
  const recommendedBooks = mockRecommendedBooks.slice(0, 4);
  
  // 読書中の本を取得
  const currentlyReading = getAllBooks().find(book => book.status === 'reading');

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
            <Book size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>3</Typography>
            <Typography variant="caption">{t('home.monthlyCompletedBooks')} ({t('home.books')})</Typography>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>+15%</Typography>
            <Typography variant="caption">{t('home.monthOnMonthChange')}</Typography>
          </View>
        </View>

        {/* おすすめの本 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography variant="title">{t('home.recommendedBooks')}</Typography>
            <Pressable>
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.booksScrollView}
          >
            {recommendedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                variant="compact"
                style={styles.recommendedBookCard}
                onPress={() => navigateToBookDetail(book.id, '/(tabs)')}
              />
            ))}
          </ScrollView>
        </View>

        {/* 現在読んでいる本 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography variant="title">{t('home.currentlyReading')}</Typography>
            <Pressable>
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.booksScrollView}
          >
            {currentlyReading && (
              <BookCard
                book={currentlyReading}
                variant="horizontal"
                showStatus={true}
                onPress={() => navigateToBookDetail(currentlyReading.id, '/(tabs)')}
              />
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
});