// モックデータの型定義
export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  publisher?: string;
  publishedDate: string;
  pageCount: number;
  category: string[];
  rating: number;
}

export interface Recommendation {
  id: string;
  titleKey: string;
  books: Book[];
}

// おすすめ書籍のモックデータ
export const recommendedBooks: Book[] = [
  {
    id: 'mock-1',
    title: '原因と結果の経済学',
    author: 'ジョシュア・D・アングリスト, ヨーン=スタイン・ピスケ',
    description: 'ビッグデータ時代の「因果関係」の見つけ方を解説する革新的な入門書。様々な実例を通じて、相関と因果の違いやバイアスを回避する方法を学べます。',
    coverUrl: 'https://m.media-amazon.com/images/I/71xZh4-WDIL._AC_UF1000,1000_QL80_.jpg',
    publisher: '日経BP',
    publishedDate: '2021-06-17',
    pageCount: 464,
    category: ['ビジネス', '経済学', 'データサイエンス'],
    rating: 4.5,
  },
  {
    id: 'mock-2',
    title: 'FACTFULNESS（ファクトフルネス）',
    author: 'ハンス・ロスリング, オーラ・ロスリング, アンナ・ロスリング・ロンランド',
    description: '私たちはなぜ世界を誤解するのか。統計データを基に、世界の真実を伝え、ものの見方を変える10の思考法を紹介します。',
    coverUrl: 'https://m.media-amazon.com/images/I/71L6xSMpoPL._AC_UF1000,1000_QL80_.jpg',
    publisher: '日経BP',
    publishedDate: '2019-01-31',
    pageCount: 400,
    category: ['自己啓発', '思考法', '国際関係'],
    rating: 4.7,
  },
  {
    id: 'mock-3',
    title: 'LEADERSHIP（リーダーシップ）論文と事例で学ぶ',
    author: 'ハーバード・ビジネス・レビュー編集部',
    description: 'リーダーシップに関する最重要概念と実践的手法を集めた一冊。ハーバード・ビジネス・レビューの名論文と事例から、効果的なリーダーシップを学びます。',
    coverUrl: 'https://m.media-amazon.com/images/I/81GXwrKT9ML._AC_UF1000,1000_QL80_.jpg',
    publisher: 'ダイヤモンド社',
    publishedDate: '2018-11-22',
    pageCount: 352,
    category: ['ビジネス', 'リーダーシップ', 'マネジメント'],
    rating: 4.3,
  },
  {
    id: 'mock-4',
    title: 'イシューからはじめよ',
    author: '安宅和人',
    description: '本質的な問いを立てる力を育むための実践的ガイド。ビジネスから日常生活まで、あらゆる問題解決に役立つ「イシュードリブン」の思考法を解説します。',
    coverUrl: 'https://m.media-amazon.com/images/I/710SuuG1SQL._AC_UF1000,1000_QL80_.jpg',
    publisher: '英治出版',
    publishedDate: '2010-11-24',
    pageCount: 304,
    category: ['ビジネス', '思考法', '問題解決'],
    rating: 4.6,
  },
];

// 新着書籍のモックデータ
export const newReleaseBooks: Book[] = [
  {
    id: 'mock-5',
    title: 'マーケティング5.0',
    author: 'フィリップ・コトラー',
    description: 'AIやIoTなどのテクノロジーを活用した次世代マーケティングの全貌。顧客体験を最大化するための実践的フレームワークを提供します。',
    coverUrl: 'https://m.media-amazon.com/images/I/71dBnK8aGqL._AC_UF1000,1000_QL80_.jpg',
    publisher: 'KADOKAWA',
    publishedDate: '2023-10-25',
    pageCount: 360,
    category: ['マーケティング', 'デジタル戦略', 'ビジネス'],
    rating: 4.2,
  },
  {
    id: 'mock-6',
    title: 'アルゴリズムマネジメント',
    author: '及川卓也',
    description: '複雑化する現代社会で成果を上げるための「思考と実行の最適化」を解説。ソフトウェア開発の知見からビジネスパーソンの生産性向上に役立つ方法論を紹介。',
    coverUrl: 'https://m.media-amazon.com/images/I/714rk+aGc9L._AC_UF1000,1000_QL80_.jpg',
    publisher: 'ダイヤモンド社',
    publishedDate: '2023-11-30',
    pageCount: 288,
    category: ['生産性向上', 'マネジメント', 'テクノロジー'],
    rating: 4.4,
  },
  {
    id: 'mock-7',
    title: 'Think clearly',
    author: 'ロルフ・ドベリ',
    description: '日常的な思考バイアスを克服し、クリアな判断力を養うための実践的アドバイス。52の認知バイアスを具体例とともに解説します。',
    coverUrl: 'https://m.media-amazon.com/images/I/717WB8ShfmL._AC_UF1000,1000_QL80_.jpg',
    publisher: 'サンマーク出版',
    publishedDate: '2023-09-14',
    pageCount: 336,
    category: ['思考法', '心理学', '自己啓発'],
    rating: 4.5,
  },
];

// 人気のジャンルモックデータ
export const popularCategories: string[] = [
  'ビジネス戦略',
  'リーダーシップ',
  '自己啓発',
  'マーケティング',
  'データサイエンス',
  '起業',
  'キャリア開発',
  '生産性向上',
  '投資',
  'テクノロジー'
];

// まとめモックデータ
export const recommendationCollections: Recommendation[] = [
  {
    id: '1',
    titleKey: 'discover.collections.monthlyCareerRecommendations',
    books: [recommendedBooks[0], recommendedBooks[1], recommendedBooks[2]]
  },
  {
    id: '2',
    titleKey: 'discover.collections.mustReadClassics',
    books: [recommendedBooks[3], newReleaseBooks[0], newReleaseBooks[1]]
  },
  {
    id: '3',
    titleKey: 'discover.collections.criticalThinking',
    books: [recommendedBooks[1], newReleaseBooks[2], recommendedBooks[3]]
  }
]; 