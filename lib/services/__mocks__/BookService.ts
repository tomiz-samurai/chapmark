// BookServiceのモック実装
import type { Book, BookStatus } from '../../../types/models/book';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'テスト本A',
    author: '著者A',
    status: 'reading',
    coverImage: '',
    coverUrl: '',
    description: '説明A',
    publisher: '出版社A',
    publishedDate: '2020-01-01',
    pageCount: 100,
    category: ['テスト'],
    rating: 4.0,
    totalPages: 100,
    currentPage: 10,
  },
  {
    id: '2',
    title: 'テスト本B',
    author: '著者B',
    status: 'completed',
    coverImage: '',
    coverUrl: '',
    description: '説明B',
    publisher: '出版社B',
    publishedDate: '2021-01-01',
    pageCount: 200,
    category: ['テスト'],
    rating: 4.5,
    totalPages: 200,
    currentPage: 200,
  },
];

export const getAllBooks = (): Book[] => mockBooks;
export const addBookToLibrary = (book: Book, status: BookStatus = 'planned'): Book => ({ ...book, status });
export const updateBookStatus = (id: string, status: BookStatus): Book | undefined => {
  const book = mockBooks.find(b => b.id === id);
  return book ? { ...book, status } : undefined;
};
export const getAllUserBooks = (): Book[] => mockBooks;
export const getUserBooks = (): Book[] => mockBooks;
export const getUserBooksByStatus = (status: string): Book[] => mockBooks.filter(b => b.status === status);
export const getBookById = (id: string): Book | undefined => mockBooks.find(b => b.id === id);
export const getBooksByCategory = (category: string): Book[] => mockBooks.filter(b => b.category?.includes(category));
export const getBooksByStatus = (status: string): Book[] => mockBooks.filter(b => b.status === status);
export const searchBooks = (query: string): Book[] => mockBooks.filter(b => b.title.includes(query) || b.author.includes(query));
export const searchGoogleBooks = async (query: string): Promise<Book[]> => searchBooks(query); 