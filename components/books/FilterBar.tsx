import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Typography } from '../Typography';
import { useTheme } from '../../lib/hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { BookStatus } from '../../types/models';
import { STATUS_TABS } from '../../lib/hooks/useLibrary';
import { colors as baseColors } from '../../constants/theme';

interface FilterBarProps {
  selectedStatus: BookStatus;
  onStatusChange: (status: BookStatus) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  showSearch: boolean;
  onToggleSearch: () => void;
}

// BookStatus型かどうかを判定する型ガード
function isBookStatus(value: string): value is BookStatus {
  return [
    'reading',
    'completed',
    'planned',
    'on-hold',
    'dropped',
    'all',
  ].includes(value);
}

/**
 * 本の一覧に対するフィルターとステータスタブを提供するコンポーネント
 */
export function FilterBar({
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchQueryChange,
  showSearch,
  onToggleSearch
}: FilterBarProps) {
  const { colors, spacing } = useTheme();
  const { t } = useAppTranslation();

  return (
    <View style={styles.container}>
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: baseColors.white }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
            <Search size={18} color={colors.text} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={onSearchQueryChange}
              placeholder={t('books.searchPlaceholder')}
              placeholderTextColor={colors.text}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchQueryChange('')}>
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={[styles.tabsContainer, { backgroundColor: baseColors.white }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {STATUS_TABS.map((tab) => (
            <Pressable
              key={tab.value}
              style={[
                styles.tab,
                { backgroundColor: colors.background },
                selectedStatus === tab.value && [
                  styles.selectedTab,
                  { backgroundColor: colors.primary }
                ],
              ]}
              onPress={() => {
                if (isBookStatus(tab.value)) {
                  onStatusChange(tab.value);
                }
              }}
            >
              <Typography
                variant="caption"
                style={[
                  styles.tabText,
                  { color: colors.text },
                  selectedStatus === tab.value && [
                    styles.selectedTabText,
                    { color: baseColors.white }
                  ],
                ]}
              >
                {t(tab.label)}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  tabsContainer: {
    paddingVertical: 8,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedTab: {},
  tabText: {
    fontSize: 13,
  },
  selectedTabText: {},
}); 