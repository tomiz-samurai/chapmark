import { useEffect, useState } from 'react';
import { Redirect, Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../lib/store';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

// 開発モードフラグ - true に設定するとログインをスキップ
// 本番環境では必ず false に変更してください
const DEV_SKIP_AUTH = true;

export default function RootLayout() {
  useFrameworkReady();
  const { session, isLoading } = useAuth();
  const [devSession, setDevSession] = useState<boolean>(false);

  useEffect(() => {
    // 開発モードで自動ログイン状態を設定
    if (DEV_SKIP_AUTH) {
      setDevSession(true);
    }
  }, []);

  if (isLoading && !DEV_SKIP_AUTH) {
    return null;
  }

  // 開発モード時は session があるものとして扱う
  const hasSession = DEV_SKIP_AUTH ? true : !!session;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Slot />
        {!hasSession && <Redirect href="/auth/sign-in" />}
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}