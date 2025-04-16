import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from '../../common/displays/Avatar';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';

interface ProfileHeaderProps {
  userName: string;
  userRole: string;
  userEmail: string;
  avatarUrl?: string;
  onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  userRole,
  userEmail,
  avatarUrl,
  onEditProfile,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar size={90} source={avatarUrl} />
        <View style={styles.statusIndicator} />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userRole}>{userRole}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>
      <TouchableOpacity style={styles.editProfileButton} onPress={onEditProfile}>
        <Feather name="edit-2" size={16} color={colors.white} />
        <Text style={styles.editProfileText}>プロフィール編集</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
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
}); 