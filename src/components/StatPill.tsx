import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';

export interface StatPillProps {
  label: string;
  value: string;
  caption?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatPill({ label, value, caption, trend, trendValue, style }: StatPillProps) {
  const theme = useTheme();
  const trendColor = trend === 'up' ? theme.colors.success : trend === 'down' ? theme.colors.danger : theme.colors.textMuted;
  const trendSymbol = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '─';
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color: theme.colors.text }]} numberOfLines={1}>
        {value}
      </Text>
      <View style={styles.row}>
        {trend ? (
          <Text style={[styles.trend, { color: trendColor }]} numberOfLines={1}>
            {trendSymbol} {trendValue}
          </Text>
        ) : null}
        {caption ? (
          <Text style={[styles.caption, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  trend: {
    fontSize: 11,
    fontWeight: '700',
  },
  caption: {
    fontSize: 11,
  },
});
