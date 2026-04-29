import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';
import { PressableScale } from './PressableScale';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  left?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  transparent?: boolean;
}

export function Header({
  title,
  subtitle,
  showBack = true,
  right,
  left,
  style,
  transparent = false,
}: HeaderProps) {
  const theme = useTheme();
  const nav = useNavigation();
  const canGoBack = nav.canGoBack();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : theme.colors.background,
          borderBottomColor: transparent ? 'transparent' : theme.colors.border,
          borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {left ? (
          <View style={styles.sideSlot}>{left}</View>
        ) : showBack && canGoBack ? (
          <PressableScale
            onPress={() => nav.goBack()}
            haptic="light"
            style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.iconText, { color: theme.colors.text }]}>←</Text>
          </PressableScale>
        ) : (
          <View style={styles.sideSlot} />
        )}
        <View style={styles.center}>
          {title ? (
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.sideSlot}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  sideSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
