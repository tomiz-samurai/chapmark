import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Typography } from '../Typography';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface TabViewProps {
  tabs: {
    key: string;
    title: string;
    content: React.ReactNode;
  }[];
  initialTab?: string;
  tabBarStyle?: object;
  activeTabStyle?: object;
  tabBarContainerStyle?: object;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  initialTab,
  tabBarStyle,
  activeTabStyle,
  tabBarContainerStyle,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.key);

  // タブ切り替え
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  // アクティブタブのコンテンツを取得
  const getActiveContent = () => {
    const activeTabData = tabs.find(tab => tab.key === activeTab);
    return activeTabData?.content;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBarContainer, tabBarContainerStyle]}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabBar,
                tabBarStyle,
                isActive && styles.activeTabBar,
                isActive && activeTabStyle,
              ]}
              onPress={() => handleTabPress(tab.key)}
            >
              <Typography
                variant="body"
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Typography>
              
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.contentContainer}>
        {getActiveContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexGrow: 0,
  },
  tabBarContent: {
    paddingHorizontal: spacing.md,
  },
  tabBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTabBar: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.main,
  },
  tabText: {
    color: colors.gray[500],
  },
  activeTabText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.sm,
  },
  contentContainer: {
    flex: 1,
    paddingTop: spacing.md,
  },
}); 