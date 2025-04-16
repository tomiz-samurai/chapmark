import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/common';
import { Button } from '../../components/common';
import { Typography } from '../../components/Typography';
import { colors, spacing } from '../../constants/theme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      router.replace('/(tabs)');
    } catch (error) {
      setError('アカウントの作成に失敗しました。入力内容を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="display" style={styles.title}>
          アカウント作成
        </Typography>
      </View>

      <View style={styles.form}>
        <Input
          label="メールアドレス"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <Input
          label="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && (
          <Typography variant="caption" color={colors.accent.dark} style={styles.error}>
            {error}
          </Typography>
        )}

        <Button
          title="アカウントを作成"
          onPress={handleSignUp}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="ログイン画面へ"
          variant="outline"
          onPress={() => router.push('/auth/sign-in')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: spacing.xl,
    backgroundColor: colors.primary.dark,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  form: {
    padding: spacing.xl,
  },
  error: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
});