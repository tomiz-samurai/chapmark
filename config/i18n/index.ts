import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ja from './translations/ja.json';
import en from './translations/en.json';

// 言語設定の保存に使用するAsyncStorageのキー
const LANGUAGE_KEY = '@ChapMark:language';

/**
 * デバイスの言語を取得する関数
 * デバイスのロケールから言語コードを抽出し、サポートされている言語（日本語・英語）かチェック
 * サポートされていない場合はデフォルトとして日本語を返す
 */
const getDeviceLanguage = (): string => {
  const locale = Localization.locale;
  const languageCode = locale.split('-')[0];
  return ['ja', 'en'].includes(languageCode) ? languageCode : 'ja';
};

/**
 * 保存された言語設定を取得する関数
 * AsyncStorageから言語設定を読み込む
 * エラー時はnullを返す
 */
const getSavedLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    console.error('言語設定の読み込みエラー:', error);
    return null;
  }
};

/**
 * 言語設定を保存する関数
 * 指定された言語コードをAsyncStorageに保存
 */
export const saveLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('言語設定の保存エラー:', error);
  }
};

/**
 * 言語を変更する関数
 * i18nの言語を変更し、その設定をAsyncStorageに保存
 */
export const changeLanguage = async (language: string): Promise<void> => {
  i18n.changeLanguage(language);
  await saveLanguage(language);
};

/**
 * 現在の言語を取得する関数
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * i18nの初期化
 * 保存された言語設定またはデバイス言語を使用
 */
const initI18n = async (): Promise<void> => {
  // 保存された言語設定を取得
  const savedLanguage = await getSavedLanguage();
  // デバイス言語を取得
  const deviceLanguage = getDeviceLanguage();
  // 保存された言語またはデバイス言語を使用
  const initialLanguage = savedLanguage || deviceLanguage;

  // i18nの初期化
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        ja: { translation: ja },
        en: { translation: en }
      },
      lng: initialLanguage,
      fallbackLng: 'ja',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  // 初期言語が保存されていなければ保存
  if (!savedLanguage) {
    await saveLanguage(initialLanguage);
  }
};

// i18nの初期化を実行
initI18n();

export default i18n; 