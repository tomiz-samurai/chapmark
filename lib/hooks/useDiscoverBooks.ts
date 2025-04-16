import { useMemo } from 'react';
import { Book } from '../../types/models/book';

/**
 * カテゴリーに応じて書籍リストをフィルタリングするカスタムフック
 */
export function useDiscoverBooks(books: Book[], selectedCategory: string | null): Book[] {
  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return books;
    return books.filter(
      (book) =>
        Array.isArray(book.category) &&
        book.category.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
    );
  }, [books, selectedCategory]);

  return filteredBooks;
} 