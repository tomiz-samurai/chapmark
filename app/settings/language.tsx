import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { changeLanguage } from '../../config/i18n';
import { colors, spacing, typography } from '../../constants/theme';

interface LanguageOption {
  code: string;
  label: string;
}

export default function LanguageSettingsScreen() {
  const { t, i18n } = useAppTranslation();
  const router = useRouter();
  
  const languages: LanguageOption[] = [
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' }
  ];
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: t('settings.language'),
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.gray[700]} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Text style={styles.heading}>{t('settings.uiLanguage')}</Text>
      
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageItem,
            i18n.language === lang.code && styles.selectedLanguageItem
          ]}
          onPress={() => changeLanguage(lang.code)}
        >
          <Text style={styles.languageName}>{lang.label}</Text>
          {i18n.language === lang.code && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{t('settings.languageExplanation')}</Text>
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
  heading: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[800],
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  selectedLanguageItem: {
    backgroundColor: colors.gray[100],
    borderColor: colors.accent.main,
    borderWidth: 1,
  },
  languageName: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[800],
  },
  checkmark: {
    fontSize: typography.fontSize.lg,
    color: colors.accent.main,
    fontFamily: typography.fontFamily.semiBold,
  },
  infoBox: {
    backgroundColor: colors.gray[100],
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.xl,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
}); 