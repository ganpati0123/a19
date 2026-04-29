import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';

export interface AmountInputProps {
  amount: number;
  currency?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  align?: 'left' | 'center' | 'right';
  showCursor?: boolean;
}

export function AmountInput({ amount, currency = '₹', fontSize = 56, style, align = 'center', showCursor = false }: AmountInputProps) {
  const theme = useTheme();
  const display = amount === 0 ? '0' : amount.toLocaleString('en-IN');
  return (
    <View style={[styles.row, { justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }, style]}>
      <Text style={[styles.currency, { color: theme.colors.textMuted, fontSize: fontSize * 0.45 }]}>{currency}</Text>
      <Text
        style={[
          styles.amount,
          {
            color: theme.colors.text,
            fontSize,
            lineHeight: fontSize * 1.05,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {display}
      </Text>
      {showCursor ? (
        <View style={[styles.cursor, { backgroundColor: theme.colors.primary, height: fontSize * 0.7 }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontWeight: '700',
    marginRight: 4,
    marginBottom: 8,
  },
  amount: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  cursor: {
    width: 2,
    marginLeft: 2,
    marginBottom: 8,
    borderRadius: 1,
  },
});
