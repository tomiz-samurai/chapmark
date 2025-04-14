import { recommendedBooks, newReleaseBooks, Book as MockBook } from '../mockData';
import { MOCK_BOOKS as libraryBooks } from '../../app/(tabs)/library';
import { RECOMMENDED_BOOKS as homeBooks } from '../../app/(tabs)/index';

// 統一された書籍の型定義
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  coverUrl?: string; // mockData.tsでは coverUrl を使用しているため両方対応
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  category?: string[];
  rating?: number;
  status?: 'reading' | 'completed' | 'planned' | 'on-hold' | 'dropped';
}

// モックデータから取得した本を統一形式に変換
const normalizeBook = (book: any): Book => {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage || book.coverUrl,
    coverUrl: book.coverUrl || book.coverImage,
    description: book.description,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    pageCount: book.pageCount,
    category: book.category,
    rating: book.rating,
    status: book.status,
  };
};

// 全ての本のデータを取得
export const getAllBooks = (): Book[] => {
  // 全てのデータソースから本を集める
  const allMockBooks = [
    ...recommendedBooks.map(normalizeBook),
    ...newReleaseBooks.map(normalizeBook),
    ...libraryBooks.map(normalizeBook),
    ...homeBooks.map(normalizeBook),
  ];

  // 重複を削除（IDベースで）
  const uniqueBooks = allMockBooks.reduce((acc: Book[], current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    }
    return acc;
  }, []);

  return uniqueBooks;
};

// IDから本を検索
export const getBookById = (id: string): Book | undefined => {
  const allBooks = getAllBooks();
  return allBooks.find(book => book.id === id);
};

// カテゴリで本をフィルター
export const getBooksByCategory = (category: string): Book[] => {
  const allBooks = getAllBooks();
  return allBooks.filter(book => 
    book.category && book.category.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
};

// ステータスで本をフィルター
export const getBooksByStatus = (status: string): Book[] => {
  const allBooks = getAllBooks();
  return allBooks.filter(book => book.status === status);
};

// 本の検索
export const searchBooks = (query: string): Book[] => {
  const allBooks = getAllBooks();
  const lowercaseQuery = query.toLowerCase();
  
  return allBooks.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) || 
    book.author.toLowerCase().includes(lowercaseQuery)
  );
};

// 将来的に実装：Google Books APIを使った書籍検索
export const searchGoogleBooks = async (query: string): Promise<Book[]> => {
  // 将来的にはここにGoogle Books APIの実装を行う
  console.log(`Searching for: ${query} - This will use Google Books API in the future`);
  
  // モック実装として現在のデータから検索
  return searchBooks(query);
}; 