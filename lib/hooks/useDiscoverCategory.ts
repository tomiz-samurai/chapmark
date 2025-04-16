import { useState, useCallback } from 'react';

/**
 * Discover画面のカテゴリー選択状態とハンドラを管理するカスタムフック
 */
export function useDiscoverCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  return {
    selectedCategory,
    handleCategoryPress,
    setSelectedCategory,
  };
} 