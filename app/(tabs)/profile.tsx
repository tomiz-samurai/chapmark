import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/layouts/Header';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { LinearGradient } from 'expo-linear-gradient';

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
      title: t('profile.notifications'),
      onPress: () => console.log('通知設定'),
    },
    {
      icon: 'moon' as const,
      title: t('profile.darkMode'),
      onPress: () => console.log('ダークモード'),
    },
    {
      icon: 'help-circle' as const,
      title: t('profile.help'),
      onPress: () => console.log('ヘルプ'),
    },
    {
      icon: 'info' as const,
      title: t('profile.about'),
      onPress: () => console.log('アプリについて'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('navigation.profile')} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* ヘッダーセクション */}
        <LinearGradient
          colors={[colors.primary.light, colors.primary.main]}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>TM</Text>
              </View>
              <View style={styles.statusIndicator} />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>竹蔵 宮本</Text>
              <Text style={styles.userRole}>プロダクトマネージャー</Text>
              <Text style={styles.userEmail}>takemi@example.com</Text>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push('settings/edit-profile' as any)}
            >
              <Feather name="edit-2" size={16} color={colors.white} />
              <Text style={styles.editProfileText}>{t('profile.userInfo.editProfile')}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        {/* 統計セクション */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>{t('profile.stats.booksCompleted')}</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>120</Text>
            <Text style={styles.statLabel}>{t('profile.stats.readingTime')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>{t('profile.stats.currentlyReading')}</Text>
          </View>
        </View>
        
        {/* 設定セクション */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('navigation.settings')}</Text>
          
          <View style={styles.settingsContent}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingItemLeft}>
                  <View style={styles.iconWrapper}>
                    <Feather name={item.icon} size={18} color={colors.primary.main} />
                  </View>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* ログアウトボタン */}
        <TouchableOpacity style={styles.logoutButton}>
          <View style={styles.iconWrapper}>
            <Feather name="log-out" size={18} color={colors.status.error} />
          </View>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Chap.Mark v1.0.0</Text>
        </View>
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
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  headerGradient: {
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.accent.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xl * 1.2,
    color: colors.primary.dark,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.status.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  userRole: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xs / 2,
  },
  userEmail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.7,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.round,
  },
  editProfileText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginTop: -spacing.lg,
    marginHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.gray[200],
  },
  statValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.primary.main,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  settingsSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingsContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
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
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.status.error,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  versionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
}); 