import { useEffect } from 'react';
import { Redirect, Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
    <>
      <Slot />
      {!session && <Redirect href="/auth/sign-in" />}
      <StatusBar style="auto" />
    </>
  );
}