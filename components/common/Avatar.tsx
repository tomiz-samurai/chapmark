import { Image, View, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';

interface AvatarProps {
  size?: number;
  source?: string;
}

export function Avatar({ size = 40, source }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <User
          size={size * 0.6}
          color={colors.gray[400]}
          style={styles.placeholder}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.gray[100],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: borderRadius.round,
  },
  placeholder: {
    opacity: 0.5,
  },
});