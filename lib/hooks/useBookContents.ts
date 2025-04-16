import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Quote, Note } from '../types';

/**
 * 書籍に関連する引用とメモを取得するためのカスタムフック
 * @param bookId 書籍ID
 */
export const useBookContents = (bookId: string) => {
  // 書籍に関連する引用を取得
  const quotes = useSelector((state: RootState) => {
    const quotes = (state as any).quote?.quotes || [];
    return quotes.filter((quote: Quote) => quote.bookId === bookId);
  });

  // 書籍に関連するメモを取得
  const notes = useSelector((state: RootState) => {
    const notes = (state as any).note?.notes || [];
    return notes.filter((note: Note) => note.bookId === bookId);
  });

  // 引用とメモの読み込み状態
  const quotesLoading = useSelector((state: RootState) => (state as any).quote?.loading);
  const notesLoading = useSelector((state: RootState) => (state as any).note?.loading);

  // 引用とメモの総数
  const quotesCount = quotes.length;
  const notesCount = notes.length;

  return {
    quotes,
    notes,
    quotesLoading,
    notesLoading,
    quotesCount,
    notesCount,
    isLoading: quotesLoading || notesLoading,
    isEmpty: quotesCount === 0 && notesCount === 0,
  };
}; 