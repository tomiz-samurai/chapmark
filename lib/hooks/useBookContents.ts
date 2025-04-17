import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Quote, Note } from '../../types/models';

/**
 * 書籍に関連する引用とメモを取得するためのカスタムフック
 * @param bookId 書籍ID
 */
export const useBookContents = (bookId: string) => {
  // 書籍に関連する引用を取得
  const quotes = useSelector((state: RootState) => {
    const allQuotes = state.quote?.quotes || [];
    return allQuotes.filter(quote => quote.bookId === bookId);
  });

  // 書籍に関連するメモを取得
  const notes = useSelector((state: RootState) => {
    const allNotes = state.note?.notes || [];
    return allNotes.filter(note => note.bookId === bookId);
  });

  // 引用とメモの読み込み状態
  const quotesLoading = useSelector((state: RootState) => state.quote?.loading);
  const notesLoading = useSelector((state: RootState) => state.note?.loading);

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