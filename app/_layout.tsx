import { useEffect } from 'react';
import { Redirect, Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../lib/store';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  useFrameworkReady();
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Slot />
        {!session && <Redirect href="/auth/sign-in" />}
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  );
}