import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/layouts/Header';
import { colors, spacing, typography } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useAppTranslation } from '../../hooks/useAppTranslation';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useAppTranslation();
  
  // プロフィール画面の設定項目
  const settingsItems = [
    {
      icon: 'globe' as const,
      title: t('settings.language'),
      onPress: () => router.push('/settings/language'),
    },
    {
      icon: 'bell' as const,
      title: '通知設定',
      onPress: () => console.log('通知設定'),
    },
    {
      icon: 'moon' as const,
      title: 'ダークモード',
      onPress: () => console.log('ダークモード'),
    },
    {
      icon: 'help-circle' as const,
      title: 'ヘルプ',
      onPress: () => console.log('ヘルプ'),
    },
    {
      icon: 'info' as const,
      title: 'アプリについて',
      onPress: () => console.log('アプリについて'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('navigation.profile')} />
      
      <ScrollView style={styles.scrollView}>
        {/* ユーザープロフィール */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TM</Text>
          </View>
          <Text style={styles.userName}>竹蔵 宮本</Text>
          <Text style={styles.userEmail}>takemi@example.com</Text>
        </View>
        
        {/* 設定セクション */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('navigation.settings')}</Text>
          
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingItemLeft}>
                <Feather name={item.icon} size={22} color={colors.gray[600]} style={styles.settingIcon} />
                <Text style={styles.settingTitle}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={22} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* ログアウトボタン */}
        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={22} color={colors.status.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>ログアウト</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xl,
    color: colors.white,
  },
  userName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  settingsSection: {
    padding: spacing.md,
    backgroundColor: colors.white,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingTitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.gray[800],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  logoutIcon: {
    marginRight: spacing.md,
    marginLeft: spacing.sm,
  },
  logoutText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.status.error,
  },
}); 