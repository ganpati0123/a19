import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradient, gradients, GradientKey } from '@theme/gradients';
import { useTheme } from '@theme/ThemeProvider';
import { PressableScale } from './PressableScale';

export interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  gradient?: GradientKey | Gradient;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

function resolveGradient(g: GradientKey | Gradient | undefined): Gradient {
  if (!g) return gradients.primary;
  if (typeof g === 'string') return gradients[g];
  return g;
}

const sizes = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13, radius: 12, height: 36 },
  md: { paddingVertical: 12, paddingHorizontal: 18, fontSize: 15, radius: 14, height: 46 },
  lg: { paddingVertical: 16, paddingHorizontal: 22, fontSize: 16, radius: 16, height: 54 },
  xl: { paddingVertical: 20, paddingHorizontal: 28, fontSize: 17, radius: 20, height: 62 },
};

export function GradientButton({
  title,
  onPress,
  gradient,
  size = 'md',
  variant = 'solid',
  disabled = false,
  loading = false,
  style,
  textStyle,
  iconLeft,
  iconRight,
  fullWidth = false,
}: GradientButtonProps) {
  const theme = useTheme();
  const g = resolveGradient(gradient);
  const cfg = sizes[size];

  const content = (
    <View style={[styles.row, { paddingVertical: cfg.paddingVertical, paddingHorizontal: cfg.paddingHorizontal, height: cfg.height }]}>
      {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? '#fff' : theme.colors.primary} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color:
                variant === 'solid'
                  ? '#fff'
                  : variant === 'outline'
                    ? theme.colors.primary
                    : theme.colors.text,
              fontSize: cfg.fontSize,
            },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
      {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
    </View>
  );

  if (variant === 'solid') {
    return (
      <PressableScale
        onPress={disabled || loading ? undefined : onPress}
        haptic={disabled ? false : 'light'}
        style={[
          { borderRadius: cfg.radius, opacity: disabled ? 0.5 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' },
          style,
        ]}
      >
        <LinearGradient
          colors={g.colors as readonly [string, string, ...string[]]}
          start={g.start}
          end={g.end}
          style={{ borderRadius: cfg.radius }}
        >
          {content}
        </LinearGradient>
      </PressableScale>
    );
  }

  if (variant === 'outline') {
    return (
      <PressableScale
        onPress={disabled || loading ? undefined : onPress}
        haptic={disabled ? false : 'light'}
        style={[
          {
            borderRadius: cfg.radius,
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
            opacity: disabled ? 0.5 : 1,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
          },
          style,
        ]}
      >
        {content}
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={disabled || loading ? undefined : onPress}
      haptic={disabled ? false : 'light'}
      style={[
        { borderRadius: cfg.radius, opacity: disabled ? 0.5 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' },
        style,
      ]}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
