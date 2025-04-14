import { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Book } from 'lucide-react-native';
import { colors, spacing } from '../../constants/theme';
import { Typography } from '../../components/Typography';
import { EmptyState } from '../../components/common/EmptyState';
import { Loading } from '../../components/common/Loading';
import { Header } from '../../components/layouts/Header';
import { useBookNavigation } from '../../lib/hooks/useBookNavigation';
import { getBooksByStatus, Book as BookType } from '../../lib/services/BookService';
import { BookCard } from '../../components/common/BookCard';

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

const STATUS_TABS = [
  { label: 'すべて', value: 'all' },
  { label: '読書中', value: 'reading' },
  { label: '読了', value: 'completed' },
  { label: 'これから読む', value: 'planned' },
];

export default function LibraryScreen() {
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('all');
  const { navigateToBookDetail } = useBookNavigation();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  // BookServiceを使用して選択されたステータスの本を取得
  let filteredBooks: BookType[] = [];
  if (selectedStatus === 'all') {
    filteredBooks = getBooksByStatus('reading')
      .concat(getBooksByStatus('completed'))
      .concat(getBooksByStatus('planned'));
  } else {
    filteredBooks = getBooksByStatus(selectedStatus);
  }

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
            <BookCard
              key={book.id}
              book={book}
              variant="list"
              showRating={false}
              showStatus={true}
              onPress={() => navigateToBookDetail(book.id)}
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
    marginBottom: spacing.sm,
  },
});