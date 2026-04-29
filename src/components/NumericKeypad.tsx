import React, { useCallback } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { useHaptics } from '@hooks/useHaptics';
import { PressableScale } from './PressableScale';

export interface NumericKeypadProps {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  showDecimal?: boolean;
  style?: StyleProp<ViewStyle>;
  onSubmit?: () => void;
  submitLabel?: string;
  showSubmit?: boolean;
  submitDisabled?: boolean;
}

export function NumericKeypad({
  value,
  onChange,
  maxLength = 10,
  showDecimal = false,
  style,
  onSubmit,
  submitLabel = 'OK',
  showSubmit = false,
  submitDisabled = false,
}: NumericKeypadProps) {
  const theme = useTheme();
  const haptic = useHaptics();

  const press = useCallback(
    (key: string) => {
      haptic('selection');
      if (key === 'back') {
        onChange(value.slice(0, -1));
        return;
      }
      if (key === '.') {
        if (!showDecimal || value.includes('.')) return;
        onChange(value === '' ? '0.' : value + '.');
        return;
      }
      if (value.length >= maxLength) return;
      if (value === '0' && key !== '.') {
        onChange(key);
        return;
      }
      onChange(value + key);
    },
    [value, onChange, haptic, maxLength, showDecimal],
  );

  const keys: (string | 'back' | 'submit' | 'empty')[] = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    showDecimal ? '.' : 'empty',
    '0',
    showSubmit ? 'submit' : 'back',
  ];

  return (
    <View style={[styles.container, style]}>
      {keys.map((key, i) => {
        if (key === 'empty') {
          return <View key={`empty-${i}`} style={styles.key} />;
        }
        if (key === 'submit') {
          return (
            <PressableScale
              key="submit"
              onPress={onSubmit}
              haptic="medium"
              style={[
                styles.key,
                styles.submitKey,
                {
                  backgroundColor: submitDisabled ? theme.colors.surfaceMuted : theme.colors.primary,
                  opacity: submitDisabled ? 0.6 : 1,
                },
              ]}
            >
              <Text style={[styles.submitText, { color: '#fff' }]}>{submitLabel}</Text>
            </PressableScale>
          );
        }
        if (key === 'back') {
          return (
            <PressableScale
              key="back"
              onPress={() => press('back')}
              haptic="light"
              style={[styles.key, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.keyText, { color: theme.colors.text, fontSize: 22 }]}>⌫</Text>
            </PressableScale>
          );
        }
        return (
          <PressableScale
            key={key + i}
            onPress={() => press(key)}
            haptic="light"
            style={[styles.key, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.keyText, { color: theme.colors.text }]}>{key}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  key: {
    width: '31%',
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '700',
  },
  submitKey: {},
  submitText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
