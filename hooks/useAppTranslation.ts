import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * アプリ用の翻訳フック
 * react-i18nextのuseTranslationをラップして、必要に応じて拡張機能を追加
 */
export const useAppTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  return { 
    t, 
    i18n,
    // 現在の言語を取得するショートカット
    currentLanguage: i18n.language
  };
}; 