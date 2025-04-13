import { StyleSheet, View, ScrollView, Pressable, Image } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book, TrendingUp, Clock } from 'lucide-react-native';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { Header } from '../../components/layouts/Header';

const READING_GOAL = 24; // 年間読書目標
const BOOKS_READ = 8; // 現在の読了数
const PROGRESS = (BOOKS_READ / READING_GOAL) * 100;

const RECOMMENDED_BOOKS = [
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
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  return (
    <View style={styles.container}>
      <Header
        title="ホーム"
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
      />
      
      <ScrollView style={styles.content}>
        {/* 今日の読書目標 */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Typography variant="title" color={colors.white}>
              今年の読書目標
            </Typography>
            <Typography variant="display" color={colors.white} style={styles.goalNumber}>
              {BOOKS_READ}/{READING_GOAL}
            </Typography>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${PROGRESS}%` }]} />
          </View>
          <Typography variant="caption" color={colors.white} style={styles.goalCaption}>
            目標達成まであと{READING_GOAL - BOOKS_READ}冊
          </Typography>
        </View>

        {/* 読書統計 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>12.5</Typography>
            <Typography variant="caption">今週の読書時間</Typography>
          </View>
          <View style={styles.statCard}>
            <Book size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>3</Typography>
            <Typography variant="caption">今月の読了本</Typography>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={colors.primary.main} />
            <Typography variant="display" style={styles.statNumber}>+15%</Typography>
            <Typography variant="caption">先月比</Typography>
          </View>
        </View>

        {/* おすすめの本 */}
        <View style={styles.section}>
          <Typography variant="title" style={styles.sectionTitle}>
            おすすめの本
          </Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedBooks}>
            {RECOMMENDED_BOOKS.map((book) => (
              <Pressable key={book.id} style={styles.recommendedBook}>
                <Image
                  source={{ uri: book.coverImage }}
                  style={styles.bookCover}
                />
                <Typography variant="caption" style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </Typography>
                <Typography variant="caption" color={colors.gray[500]} numberOfLines={1}>
                  {book.author}
                </Typography>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 現在読書中 */}
        <View style={styles.section}>
          <Typography variant="title" style={styles.sectionTitle}>
            現在読書中
          </Typography>
          <Card
            variant="elevated"
            title="エッセンシャル思考"
            subtitle="グレッグ・マキューン"
            coverImage="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
          />
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
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  recommendedBooks: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  recommendedBook: {
    width: 120,
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