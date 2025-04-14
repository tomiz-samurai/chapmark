import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { changeLanguage } from '../../config/i18n';
import { colors, spacing, typography } from '../../constants/theme';
import { Stack } from 'expo-router';

export default function LanguageTestScreen() {
  const { t, i18n } = useAppTranslation();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '言語テスト' }} />
      
      <Text style={styles.title}>言語テスト画面</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>現在の言語: {i18n.language}</Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, i18n.language === 'ja' && styles.activeButton]}
          onPress={() => changeLanguage('ja')}
        >
          <Text style={[styles.buttonText, i18n.language === 'ja' && styles.activeButtonText]}>日本語に切り替え</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, i18n.language === 'en' && styles.activeButton]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[styles.buttonText, i18n.language === 'en' && styles.activeButtonText]}>英語に切り替え</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>翻訳テスト:</Text>
        
        <View style={styles.translationItem}>
          <Text style={styles.keyText}>common.loading:</Text>
          <Text style={styles.valueText}>{t('common.loading')}</Text>
        </View>
        
        <View style={styles.translationItem}>
          <Text style={styles.keyText}>navigation.home:</Text>
          <Text style={styles.valueText}>{t('navigation.home')}</Text>
        </View>
        
        <View style={styles.translationItem}>
          <Text style={styles.keyText}>navigation.books:</Text>
          <Text style={styles.valueText}>{t('navigation.books')}</Text>
        </View>
        
        <View style={styles.translationItem}>
          <Text style={styles.keyText}>navigation.timer:</Text>
          <Text style={styles.valueText}>{t('navigation.timer')}</Text>
        </View>
        
        <View style={styles.translationItem}>
          <Text style={styles.keyText}>books.myBooks:</Text>
          <Text style={styles.valueText}>{t('books.myBooks')}</Text>
        </View>
        
        <View style={styles.translationItem}>
          <Text style={styles.keyText}>settings.language:</Text>
          <Text style={styles.valueText}>{t('settings.language')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.lg,
    color: colors.gray[800],
  },
  infoBox: {
    backgroundColor: colors.gray[100],
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.gray[200],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.accent.main,
  },
  buttonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  activeButtonText: {
    color: colors.gray[800],
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
    color: colors.gray[800],
  },
  translationItem: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  keyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    width: 120,
  },
  valueText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.gray[800],
    flex: 1,
  },
}); 