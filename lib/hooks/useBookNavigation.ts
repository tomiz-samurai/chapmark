import { router } from 'expo-router';

// 遷移元のパスを保持するグローバル変数
let previousPath: string | null = null;

/**
 * 本の詳細ページへのナビゲーションを管理するフック
 */
export const useBookNavigation = () => {
  /**
   * 本の詳細ページへ遷移する
   * @param bookId 本のID
   * @param fromPath 遷移元のパス（例：'/(tabs)'はホーム、'/(tabs)/library'は本棚）
   */
  const navigateToBookDetail = (bookId: string, fromPath?: string) => {
    // 遷移元のパスを記録
    if (fromPath) {
      previousPath = fromPath;
    }
    
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
   * @param toLibrary trueの場合、常に本棚ページに戻ります
   */
  const goBack = (toLibrary?: boolean) => {
    if (toLibrary) {
      router.push('/(tabs)/library');
    } else if (previousPath) {
      // 記録された遷移元のパスに戻る
      router.push(previousPath as any);
    } else {
      // 遷移元が不明な場合はブラウザバックと同様の動作
      router.back();
    }
  };

  /**
   * 本棚ページへ遷移する
   */
  const navigateToLibrary = () => {
    router.push('/(tabs)/library');
  };

  /**
   * ホームページへ遷移する
   */
  const navigateToHome = () => {
    router.push('/(tabs)');
  };

  return {
    navigateToBookDetail,
    navigateToBookList,
    navigateToCollection,
    navigateToLibrary,
    navigateToHome,
    goBack
  };
}; 