import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { ChevronRight } from 'lucide-react-native';
import { colors, spacing } from '../../constants/theme';

interface CollectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  showSeeAll?: boolean;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  title,
  onSeeAllPress,
  showSeeAll = true,
}) => {
  return (
    <View style={styles.container}>
      <Typography variant="title" style={styles.title}>
        {title}
      </Typography>
      {showSeeAll && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
          activeOpacity={0.7}
        >
          <Typography
            variant="caption"
            color={colors.primary.main}
            style={styles.seeAllText}
          >
            すべて見る
          </Typography>
          <ChevronRight size={16} color={colors.primary.main} />
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
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  title: {
    flex: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    marginRight: spacing.xs,
  },
}); 