import React from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { PressableScale } from './PressableScale';

export interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}

export function Chip({ label, active, onPress, icon, color, style, size = 'md' }: ChipProps) {
  const theme = useTheme();
  const tint = color ?? theme.colors.primary;
  const padding = size === 'sm' ? { paddingVertical: 5, paddingHorizontal: 10 } : { paddingVertical: 8, paddingHorizontal: 14 };
  const fontSize = size === 'sm' ? 12 : 13;
  return (
    <PressableScale
      onPress={onPress}
      haptic={onPress ? 'selection' : false}
      style={[
        styles.base,
        padding,
        {
          backgroundColor: active ? tint : theme.colors.surface,
          borderColor: active ? tint : theme.colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: active ? '#fff' : theme.colors.text,
            fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {icon ? `${icon}  ` : ''}
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
