import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';

export function PinDots({ length = 6, value }: { length?: number; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => {
        const filled = i < value.length;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: filled ? theme.colors.primary : 'transparent',
                borderColor: filled ? theme.colors.primary : theme.colors.borderStrong,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    marginVertical: 18,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
});
