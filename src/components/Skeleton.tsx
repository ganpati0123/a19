import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeProvider';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 14, radius = 8, style }: SkeletonProps) {
  const theme = useTheme();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, [t]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.5, 1], [0.5, 1, 0.5]),
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: width as any,
          height: height as any,
          borderRadius: radius,
          backgroundColor: theme.colors.skeleton,
        },
        style,
      ]}
    />
  );
}

export function SkeletonRow({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.col}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={48} height={48} radius={24} />
          <View style={styles.flex}>
            <Skeleton width="70%" height={14} />
            <View style={{ height: 8 }} />
            <Skeleton width="50%" height={10} />
          </View>
          <Skeleton width={60} height={20} radius={6} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});
