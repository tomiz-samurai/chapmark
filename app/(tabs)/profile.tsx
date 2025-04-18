import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/layouts/Header';
import { colors, spacing } from '../../constants/theme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../../components/features/profile/ProfileHeader';
import { ProfileStats } from '../../components/features/profile/ProfileStats';
import { ProfileSettingsList } from '../../components/features/profile/ProfileSettingsList';
import { ProfileLogoutButton } from '../../components/features/profile/ProfileLogoutButton';
import { ProfileVersionInfo } from '../../components/features/profile/ProfileVersionInfo';
import type { SettingItem } from '../../components/features/profile/ProfileSettingsList';
import { useProfile } from '../../lib/hooks/useProfile';
import { X } from 'lucide-react-native';
import { EmptyState } from '../../components/common/displays/EmptyState';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const { user, stats, loading, error, refresh } = useProfile();

  const errorColor = colors.status.error;

  // 設定項目リスト
  const settingsItems: SettingItem[] = [
    {
      icon: 'globe',
      title: t('settings.language'),
      onPress: () => router.push('/settings/language'),
    },
    {
      icon: 'bell',
      title: t('profile.notifications'),
      onPress: () => console.log('通知設定'),
    },
    {
      icon: 'moon',
      title: t('profile.darkMode'),
      onPress: () => console.log('ダークモード'),
    },
    {
      icon: 'help-circle',
      title: t('profile.help'),
      onPress: () => console.log('ヘルプ'),
    },
    {
      icon: 'info',
      title: t('profile.about'),
      onPress: () => console.log('アプリについて'),
    },
  ];

  if (loading) return <View style={{ flex: 1, backgroundColor: colors.gray[50] }} />;
  if (error) {
    return (
      <EmptyState
        icon={<X size={48} color={errorColor} />}
        title={t('common.error')}
        message={t(error)}
        actionLabel={t('common.retry')}
        onAction={refresh}
        isTitleTranslationKey={false}
        isMessageTranslationKey={false}
        isActionLabelTranslationKey={false}
      />
    );
  }
  if (!user || !stats) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <Header title={t('navigation.profile')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ヘッダーセクション */}
        <LinearGradient
          colors={[colors.primary.light, colors.primary.main]}
          style={{ paddingBottom: spacing.xl }}
        >
          <ProfileHeader
            userName={user.name}
            userRole={user.role}
            userEmail={user.email}
            avatarUrl={user.avatarUrl}
            onEditProfile={() => router.push('settings/edit-profile' as any)}
          />
        </LinearGradient>
        {/* 統計セクション */}
        <ProfileStats
          booksCompleted={stats.booksCompleted}
          readingTime={stats.readingTime}
          currentlyReading={stats.currentlyReading}
          t={t}
        />
        {/* 設定リスト */}
        <ProfileSettingsList
          items={settingsItems}
          sectionTitle={t('navigation.settings')}
        />
        {/* ログアウトボタン */}
        <ProfileLogoutButton onLogout={() => console.log('ログアウト')} />
        {/* バージョン表示 */}
        <ProfileVersionInfo version="Chap.Mark v1.0.0" />
      </ScrollView>
    </View>
  );
} 