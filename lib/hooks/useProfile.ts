import { useState, useCallback, useEffect } from 'react';
import { User, ProfileStats } from '../../types/models';

/**
 * プロフィール画面用のユーザー・統計データ取得フック
 * 本番API連携時はfetch等に差し替え
 */
export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得（モック）
  const fetchProfile = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      // 仮データ
      setUser({
        id: '1',
        name: '竹蔵 宮本',
        role: 'プロダクトマネージャー',
        email: 'takemi@example.com',
        avatarUrl: undefined,
      });
      setStats({
        booksCompleted: 42,
        readingTime: 120,
        currentlyReading: 8,
      });
    } catch (e) {
      setError('profile.error.fetchFailed');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回取得
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // リフレッシュ
  const refresh = () => fetchProfile();

  return {
    user,
    stats,
    loading,
    error,
    refresh,
  };
} 