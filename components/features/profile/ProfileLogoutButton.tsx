import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';

interface ProfileLogoutButtonProps {
  onLogout: () => void;
}

export const ProfileLogoutButton: React.FC<ProfileLogoutButtonProps> = ({ onLogout }) => {
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <View style={styles.iconWrapper}>
        <Feather name="log-out" size={18} color={colors.status.error} />
      </View>
      <Text style={styles.logoutText}>ログアウト</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoutText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.status.error,
  },
}); 