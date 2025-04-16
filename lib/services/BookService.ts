import { recommendedBooks, newReleaseBooks, Book as MockBook } from '../mockData';
import { MOCK_BOOKS as libraryBooks } from '../../app/(tabs)/library';
import { RECOMMENDED_BOOKS as homeBooks } from '../../app/(tabs)/index';
import { Book as ModelBook, BookStatus } from '../../types/models';

// BookServiceで使用する書籍の型
export type BookStatusWithoutAll = Exclude<BookStatus, 'all'>;
export type Book = Omit<ModelBook, 'status'> & {
  status?: BookStatusWithoutAll;
};

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

// 追加した本を保存するための配列
let userAddedBooks: Book[] = [];

// 本を本棚に追加
export const addBookToLibrary = (book: Book, status: BookStatusWithoutAll = 'planned'): Book => {
  // 既存の本が見つかるか確認
  const existingBookIndex = userAddedBooks.findIndex(b => b.id === book.id);
  
  // 両方のカバー画像プロパティを確保
  const coverUrl = book.coverUrl || book.coverImage;
  const coverImage = book.coverImage || book.coverUrl;
  
  // 本に新しいステータスを設定
  const updatedBook = {
    ...book,
    coverUrl,
    coverImage,
    status
  };
  
  if (existingBookIndex >= 0) {
    // 既存の本を更新
    userAddedBooks[existingBookIndex] = updatedBook;
  } else {
    // 新しい本を追加
    userAddedBooks.push(updatedBook);
  }
  
  console.log(`本を追加しました: ${book.title} (ステータス: ${status})`);
  return updatedBook;
};

// 本のステータスを変更
export const updateBookStatus = (id: string, status: BookStatusWithoutAll): Book | undefined => {
  // まず、ユーザーが追加した本の中から検索
  const userBookIndex = userAddedBooks.findIndex(book => book.id === id);
  
  if (userBookIndex >= 0) {
    // ユーザーが追加した本のステータスを更新
    userAddedBooks[userBookIndex] = {
      ...userAddedBooks[userBookIndex],
      status
    };
    console.log(`本のステータスを更新しました: ${userAddedBooks[userBookIndex].title} (新ステータス: ${status})`);
    return userAddedBooks[userBookIndex];
  }
  
  // モックデータの本のインスタンスを取得
  const book = getBookById(id);
  if (book) {
    // 両方のカバー画像プロパティを確保
    const coverUrl = book.coverUrl || book.coverImage;
    const coverImage = book.coverImage || book.coverUrl;
    
    // モックデータの本は直接変更できないため、ユーザーが追加した本としてコピーを作成
    const updatedBook = {
      ...book,
      coverUrl,
      coverImage,
      status
    };
    userAddedBooks.push(updatedBook);
    console.log(`モックデータの本をユーザー本棚に追加し、ステータスを設定しました: ${book.title} (ステータス: ${status})`);
    return updatedBook;
  }
  
  return undefined;
};

// ユーザーが追加/更新した本を含む全ての本を取得
export const getAllUserBooks = (): Book[] => {
  const allBooks = getAllBooks();
  
  // ユーザーが追加/更新した本でallBooksの本を上書き
  const updatedBooks = allBooks.map(book => {
    const userBook = userAddedBooks.find(b => b.id === book.id);
    return userBook || book;
  });
  
  // ユーザーが追加した新しい本（モックデータに存在しない本）を追加
  const newUserBooks = userAddedBooks.filter(
    userBook => !allBooks.some(book => book.id === userBook.id)
  );
  
  return [...updatedBooks, ...newUserBooks];
};

// 本棚に追加された本のみを取得（ステータスがある本のみ）
export const getUserBooks = (): Book[] => {
  // ユーザーが明示的に追加した本
  const explicitUserBooks = [...userAddedBooks];
  
  // モックデータの中でステータスが設定されている本
  const allBooks = getAllBooks();
  const booksWithStatus = allBooks.filter(book => {
    // すでにユーザーが追加した本に含まれている場合はスキップ
    if (userAddedBooks.some(userBook => userBook.id === book.id)) {
      return false;
    }
    
    // ユーザーが追加した本に同じタイトルと著者の本がある場合もスキップ
    if (userAddedBooks.some(userBook => 
      userBook.title.toLowerCase() === book.title.toLowerCase() && 
      userBook.author.toLowerCase() === book.author.toLowerCase()
    )) {
      return false;
    }
    
    // ステータスが設定されている本のみ返す
    return book.status !== undefined;
  });
  
  // 最終的な結果からも重複を排除する
  const result = [...explicitUserBooks];
  
  // すでに追加されているタイトルと著者の組み合わせを記録
  const addedBooks = new Set(
    explicitUserBooks.map(book => `${book.title.toLowerCase()}|${book.author.toLowerCase()}`)
  );
  
  // モックデータの本で、まだ重複していないものを追加
  for (const book of booksWithStatus) {
    const key = `${book.title.toLowerCase()}|${book.author.toLowerCase()}`;
    if (!addedBooks.has(key)) {
      result.push(book);
      addedBooks.add(key);
    }
  }
  
  return result;
};

// 本棚のステータスで本をフィルター（本棚に追加された本のみ）
export const getUserBooksByStatus = (status: string): Book[] => {
  const userBooks = getUserBooks();
  if (status === 'all') {
    return userBooks;
  }
  return userBooks.filter(book => book.status === status);
};

// IDから本を検索 (ユーザーが追加/更新した本を含む)
export const getBookById = (id: string): Book | undefined => {
  // ユーザーが追加した本から検索
  const userBook = userAddedBooks.find(book => book.id === id);
  if (userBook) return userBook;
  
  // モックデータから検索
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