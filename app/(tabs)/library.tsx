import { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book } from 'lucide-react-native';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../constants/theme';
import { EmptyState } from '../../components/common/EmptyState';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';

type BookStatus = 'reading' | 'completed' | 'planned' | 'all';

interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  coverImage?: string;
}

const MOCK_BOOKS: Book[] = [
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
];

const STATUS_TABS = [
  { label: 'すべて', value: 'all' },
  { label: '読書中', value: 'reading' },
  { label: '読了', value: 'completed' },
  { label: 'これから読む', value: 'planned' },
];

export default function LibraryScreen() {
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  const filteredBooks = MOCK_BOOKS.filter(
    book => selectedStatus === 'all' || book.status === selectedStatus
  );

  const handleNotificationPress = () => {
    // 通知画面への遷移などの処理
    console.log('Notification pressed');
  };

  return (
    <View style={styles.container}>
      <Header
        title="本棚"
        notificationCount={3}
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
              onPress={() => setSelectedStatus(tab.value as BookStatus)}
            >
              <Typography
                variant="caption"
                style={[
                  styles.tabText,
                  selectedStatus === tab.value && styles.selectedTabText,
                ]}
              >
                {tab.label}
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
            title="本が見つかりません"
            message="選択したステータスの本がありません。"
          />
        ) : (
          filteredBooks.map((book) => (
            <Card
              key={book.id}
              variant="elevated"
              title={book.title}
              subtitle={book.author}
              coverImage={book.coverImage}
              style={styles.card}
            />
          ))
        )}
      </ScrollView>
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
    marginBottom: spacing.md,
  },
});