import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { PressableScale } from './PressableScale';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  rightTitle?: string;
  rightSubtitle?: string;
  rightTitleColor?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
  badge?: string;
  badgeColor?: string;
  emphasis?: 'normal' | 'strong';
}

export function ListRow({
  title,
  subtitle,
  rightTitle,
  rightSubtitle,
  rightTitleColor,
  leading,
  trailing,
  onPress,
  onLongPress,
  divider = true,
  style,
  badge,
  badgeColor,
  emphasis = 'normal',
}: ListRowProps) {
  const theme = useTheme();

  const body = (
    <View style={[styles.row, style]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.center}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontWeight: emphasis === 'strong' ? '800' : '600',
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {badge ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: (badgeColor ?? theme.colors.primary) + '22',
                  borderColor: (badgeColor ?? theme.colors.primary) + '55',
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: badgeColor ?? theme.colors.primary },
                ]}
                numberOfLines={1}
              >
                {badge}
              </Text>
            </View>
          ) : null}
        </View>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {rightTitle ? (
          <Text
            style={[
              styles.rightTitle,
              {
                color: rightTitleColor ?? theme.colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {rightTitle}
          </Text>
        ) : null}
        {rightSubtitle ? (
          <Text style={[styles.rightSubtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {rightSubtitle}
          </Text>
        ) : null}
        {trailing}
      </View>
    </View>
  );

  return (
    <View>
      {onPress || onLongPress ? (
        <PressableScale onPress={onPress} onLongPress={onLongPress} haptic="light">
          {body}
        </PressableScale>
      ) : (
        body
      )}
      {divider ? (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: theme.colors.border,
            marginLeft: 64,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  leading: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rightSubtitle: {
    fontSize: 11,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
