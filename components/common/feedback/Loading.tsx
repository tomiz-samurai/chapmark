import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../../constants/theme';

interface LoadingProps {
  size?: number | 'small' | 'large';
  color?: string;
}

export function Loading({ size = 'large', color = colors.primary.main }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});