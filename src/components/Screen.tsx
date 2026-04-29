/**
 * Standard wrapper used by every screen.
 *
 * - Adds safe-area padding
 * - Sets a tinted background gradient
 * - Forwards a scroll view with optional refresh control
 * - Renders the floating AI assistant trigger overlay
 */

import React, { useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/ThemeProvider';

export interface ScreenProps {
  children?: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  bare?: boolean;
  scrollProps?: ScrollViewProps;
  withGradientBackground?: boolean;
}

export function Screen({
  children,
  scroll = true,
  refreshing,
  onRefresh,
  contentContainerStyle,
  style,
  edges = ['top'],
  bare = false,
  scrollProps,
  withGradientBackground = true,
}: ScreenProps) {
  const theme = useTheme();
  const [internalRefreshing, setInternalRefreshing] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setInternalRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setInternalRefreshing(false);
    }
  }, [onRefresh]);

  const isRefreshing = refreshing ?? internalRefreshing;

  const bg = withGradientBackground
    ? theme.isDark
      ? (['#070A14', '#0B1228', '#10162A'] as const)
      : (['#F4F6FB', '#EEF1F8', '#FFFFFF'] as const)
    : ([theme.colors.background, theme.colors.background] as const);

  if (bare) {
    return (
      <View style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
        {children}
      </View>
    );
  }

  const inner = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary, theme.colors.accent]}
            progressBackgroundColor={theme.colors.surface}
          />
        ) : undefined
      }
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {inner}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
});
