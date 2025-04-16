import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Text,
  Image,
  Animated,
  Easing,
  Alert,
  Dimensions,
  LayoutChangeEvent
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { Input } from '../../components/common';
import { Button } from '../../components/common';
import { Camera, Check, ArrowLeft, User, Briefcase, Trash2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing as ReanimatedEasing,
  interpolate,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic'); // 'basic' or 'career'
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // アニメーションの値
  const saveButtonScale = useRef(new Animated.Value(1)).current;
  
  // Reanimatedを使ったアニメーション値
  const tabAnimationValue = useSharedValue(activeSection === 'basic' ? 0 : 1);
  
  // タブ変更時のアニメーション - よりスムーズな設定に
  useEffect(() => {
    tabAnimationValue.value = withTiming(
      activeSection === 'basic' ? 0 : 1, 
      { 
        duration: 350,
        easing: ReanimatedEasing.bezier(0.4, 0.0, 0.2, 1) // マテリアルデザイン標準イージング
      }
    );
  }, [activeSection]);

  // アニメーション付きのタブスタイル - よりさりげない効果に
  const basicTabStyle = useAnimatedStyle(() => {
    const scale = interpolate(tabAnimationValue.value, [0, 1], [1, 0.97]);
    
    return {
      backgroundColor: activeSection === 'basic' 
        ? colors.primary.main 
        : colors.gray[200],
      transform: [{ scale }]
    };
  });

  const careerTabStyle = useAnimatedStyle(() => {
    const scale = interpolate(tabAnimationValue.value, [0, 1], [0.97, 1]);
    
    return {
      backgroundColor: activeSection === 'career' 
        ? colors.primary.main 
        : colors.gray[200],
      transform: [{ scale }]
    };
  });

  // プロフィール情報のステート
  const [profile, setProfile] = useState({
    name: '竹蔵 宮本',
    email: 'takemi@example.com',
    avatarUrl: '',
    jobTitle: 'プロダクトマネージャー',
    industry: 'IT',
    position: 'マネージャー',
    bio: '',
    careerGoal: ''
  });

  // 初期値を保存
  const initialProfile = useRef(profile).current;

  // 変更があるかどうかをチェック
  useEffect(() => {
    const changed = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    setHasChanges(changed);
    
    if (changed) {
      // 保存ボタンを強調するアニメーション
      Animated.sequence([
        Animated.timing(saveButtonScale, {
          toValue: 1.1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(saveButtonScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ]).start();
    }
  }, [profile]);

  // 入力フィールドの変更ハンドラ
  const handleChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  // 画像をリセット
  const handleRemoveImage = () => {
    Alert.alert(
      t('profile.userInfo.removeImage'),
      t('profile.userInfo.removeImageConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.delete'),
          onPress: () => {
            setProfile({
              ...profile,
              avatarUrl: ''
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  // 破棄前に確認
  const confirmDiscard = () => {
    if (hasChanges) {
      Alert.alert(
        t('common.cancel'),
        t('profile.userInfo.discardChanges'),
        [
          {
            text: t('common.continue'),
            style: 'cancel'
          },
          {
            text: t('common.discard'),
            onPress: () => router.push('/(tabs)/profile'),
            style: 'destructive'
          }
        ]
      );
    } else {
      router.push('/(tabs)/profile');
    }
  };

  // 保存前に確認
  const confirmSave = () => {
    if (!profile.name.trim()) {
      Alert.alert(
        t('common.error'),
        t('profile.userInfo.nameRequired')
      );
      return;
    }

    // 保存処理
    setIsSaving(true);
    
    // 保存アニメーション（実際のAPIコールをシミュレート）
    setTimeout(() => {
      // 保存成功
      setIsSaving(false);
      router.push('/(tabs)/profile');
      
      // 実際はここでAPIを呼び出す
      console.log('プロフィール更新:', profile);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: t('profile.userInfo.editProfileTitle'),
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.gray[50],
          },
          headerRight: () => (
            <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
              <TouchableOpacity 
                onPress={confirmSave} 
                style={[styles.saveButton, hasChanges && styles.saveButtonActive]}
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <Animated.View style={styles.savingIndicator}>
                    <Check size={22} color={colors.white} />
                  </Animated.View>
                ) : (
                  <Check size={22} color={hasChanges ? colors.white : colors.gray[400]} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={confirmDiscard} style={styles.backButton}>
              <ArrowLeft size={22} color={colors.gray[700]} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* プロフィール画像セクション */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
            <BlurView intensity={80} tint="dark" style={styles.blurOverlay}>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={18} color={colors.white} />
              </TouchableOpacity>
            </BlurView>
          </View>
          
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.changeImageButton}>
              <Text style={styles.changeImageText}>
                {profile.avatarUrl 
                  ? t('profile.userInfo.changeImage') 
                  : t('profile.userInfo.uploadImage')}
              </Text>
            </TouchableOpacity>
            
            {profile.avatarUrl && (
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <Trash2 size={16} color={colors.status.error} style={styles.removeIcon} />
                <Text style={styles.removeImageText}>
                  {t('profile.userInfo.removeImage')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* セクションタブ - ぬるぬるアニメーション付き */}
        <View style={styles.tabContainerWrapper}>
          <View style={styles.tabContainer}>
            <Reanimated.View style={[styles.tabButton, styles.leftTabButton, basicTabStyle]}>
              <TouchableOpacity 
                style={styles.tabTouchable}
                onPress={() => setActiveSection('basic')}
                activeOpacity={0.7}
              >
                <User 
                  size={14} 
                  color={activeSection === 'basic' ? colors.white : colors.gray[600]} 
                />
                <Text style={[
                  styles.tabText, 
                  activeSection === 'basic' && styles.activeTabText
                ]}>
                  {t('profile.userInfo.basicInformation')}
                </Text>
              </TouchableOpacity>
            </Reanimated.View>
            
            <Reanimated.View style={[styles.tabButton, styles.rightTabButton, careerTabStyle]}>
              <TouchableOpacity 
                style={styles.tabTouchable}
                onPress={() => setActiveSection('career')}
                activeOpacity={0.7}
              >
                <Briefcase 
                  size={14} 
                  color={activeSection === 'career' ? colors.white : colors.gray[600]} 
                />
                <Text style={[
                  styles.tabText, 
                  activeSection === 'career' && styles.activeTabText
                ]}>
                  {t('profile.userInfo.careerInformation')}
                </Text>
              </TouchableOpacity>
            </Reanimated.View>
          </View>
        </View>
        
        {/* 基本情報セクション */}
        {activeSection === 'basic' && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Input
                label={t('profile.userInfo.name')}
                value={profile.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder={t('profile.userInfo.namePlaceholder')}
                isLabelTranslationKey={false}
              />
              
              <Input
                label={t('profile.userInfo.email')}
                value={profile.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder={t('profile.userInfo.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                isLabelTranslationKey={false}
              />
              
              <Input
                label={t('profile.userInfo.bio')}
                value={profile.bio}
                onChangeText={(value) => handleChange('bio', value)}
                placeholder={t('profile.userInfo.bioPlaceholder')}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.multilineInput}
                isLabelTranslationKey={false}
              />
            </View>
          </View>
        )}
        
        {/* キャリア情報セクション */}
        {activeSection === 'career' && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Input
                label={t('profile.userInfo.jobTitle')}
                value={profile.jobTitle}
                onChangeText={(value) => handleChange('jobTitle', value)}
                placeholder={t('profile.userInfo.jobTitlePlaceholder')}
                isLabelTranslationKey={false}
              />
              
              <Input
                label={t('profile.userInfo.industry')}
                value={profile.industry}
                onChangeText={(value) => handleChange('industry', value)}
                placeholder={t('profile.userInfo.industryPlaceholder')}
                isLabelTranslationKey={false}
              />
              
              <Input
                label={t('profile.userInfo.position')}
                value={profile.position}
                onChangeText={(value) => handleChange('position', value)}
                placeholder={t('profile.userInfo.positionPlaceholder')}
                isLabelTranslationKey={false}
              />
              
              <Input
                label={t('profile.userInfo.careerGoal')}
                value={profile.careerGoal}
                onChangeText={(value) => handleChange('careerGoal', value)}
                placeholder={t('profile.userInfo.careerGoalPlaceholder')}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.multilineInput}
                isLabelTranslationKey={false}
              />
            </View>
          </View>
        )}
        
        {/* 保存ボタン */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('profile.userInfo.saveProfile')}
            onPress={confirmSave}
            fullWidth
            isTranslationKey={false}
            disabled={isSaving || !hasChanges}
            loading={isSaving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  saveButton: {
    padding: spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[200],
  },
  saveButtonActive: {
    backgroundColor: colors.primary.main,
  },
  savingIndicator: {
    backgroundColor: colors.accent.main,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: 100,
    height: 100,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.accent.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xl,
    color: colors.primary.dark,
  },
  blurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageButton: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
  },
  changeImageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
  },
  removeImageButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeIcon: {
    marginRight: spacing.xs / 2,
  },
  removeImageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.status.error,
  },
  // タブコンテナをセンタリングするためのラッパー
  tabContainerWrapper: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  // 新しいタブスタイル、サイズを小さく
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 36,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  tabTouchable: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    gap: spacing.xs / 2,
  },
  leftTabButton: {
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  rightTabButton: {
    borderTopRightRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  tabText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.white,
    fontFamily: typography.fontFamily.semiBold,
  },
  section: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 70,
    paddingTop: spacing.sm,
  },
  buttonContainer: {
    marginVertical: spacing.md,
  },
}); 