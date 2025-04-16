import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../../../components/Typography';
import { colors, spacing } from '../../../constants/theme';

type CollectionHeaderProps = {
  title: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
};

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  title,
  onViewAll,
  viewAllLabel = 'すべて見る',
}) => {
  return (
    <View style={styles.container}>
      <Typography variant="title">{title}</Typography>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Typography variant="label" style={styles.viewAllText}>
            {viewAllLabel}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  viewAllText: {
    color: colors.primary.main,
  },
}); 