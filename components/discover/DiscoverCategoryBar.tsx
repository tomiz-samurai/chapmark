import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CategoryButton } from '../common/buttons/CategoryButton';
import { CollectionHeader } from '../layouts/CollectionHeader';
import { colors, spacing } from '../../constants/theme';

interface DiscoverCategoryBarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryPress: (category: string) => void;
  title: string;
}

const DiscoverCategoryBar: React.FC<DiscoverCategoryBarProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
  title,
}) => {
  return (
    <View style={styles.section}>
      <CollectionHeader title={title} showSeeAll={false} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category}
            title={category}
            isActive={selectedCategory === category}
            onPress={() => onCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
});

export default DiscoverCategoryBar; 