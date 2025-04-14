import { router } from 'expo-router';

/**
 * 本の詳細ページへのナビゲーションを管理するフック
 */
export const useBookNavigation = () => {
  /**
   * 本の詳細ページへ遷移する
   * @param bookId 本のID
   */
  const navigateToBookDetail = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  /**
   * 本の一覧ページへ遷移する
   * @param type 一覧のタイプ（おすすめ、新着など）
   */
  const navigateToBookList = (type: string) => {
    router.push(`/books/${type}`);
  };

  /**
   * コレクションページへ遷移する
   * @param collectionId コレクションのID
   */
  const navigateToCollection = (collectionId: string) => {
    router.push(`/collections/${collectionId}`);
  };

  /**
   * 前の画面に戻る
   */
  const goBack = () => {
    router.back();
  };

  return {
    navigateToBookDetail,
    navigateToBookList,
    navigateToCollection,
    goBack
  };
}; 