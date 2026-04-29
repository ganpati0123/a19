import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, NeumorphCard, NumericKeypad, AmountInput, Chip, ListRow, Avatar } from '@components/index';
import { findMerchant } from '@data/merchants';
import { formatINR } from '@utils/format';
import type { ScanStackScreenProps } from '@navigation/types';

export function ScanAmountScreen({ route, navigation }: ScanStackScreenProps<'ScanAmount'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  const [amount, setAmount] = useState('');
  const [tipPct, setTipPct] = useState(0);
  const numeric = parseFloat(amount || '0');
  const tip = Math.round((numeric * tipPct) / 100);
  const total = numeric + tip;

  return (
    <Screen scroll={false}>
      <Header title={`Pay ${m?.name ?? 'merchant'}`} subtitle={m?.upi} />
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Avatar name={m?.name ?? '?'} square color={m?.color} size={64} />
          <Text style={{ color: theme.colors.text, fontWeight: '800', fontSize: 18 }}>{m?.name}</Text>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>{m?.area}, {m?.city}</Text>
        </View>
        <AmountInput amount={numeric} fontSize={56} showCursor style={{ marginVertical: 14 }} />
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[0, 5, 10, 15].map((p) => (
            <Chip key={p} label={`Tip ${p}%`} active={tipPct === p} onPress={() => setTipPct(p)} />
          ))}
        </View>
        <NeumorphCard style={{ padding: 14, marginTop: 12 }}>
          <ListRow title="Bill amount" rightTitle={formatINR(numeric)} divider={false} />
          {tipPct > 0 ? <ListRow title={`Tip ${tipPct}%`} rightTitle={formatINR(tip)} divider={false} /> : null}
          <ListRow title="Cashback (est.)" rightTitle={formatINR(Math.round(numeric * 0.02))} rightTitleColor={theme.colors.success} divider={false} />
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border, marginVertical: 6 }} />
          <ListRow title="Total" rightTitle={formatINR(total)} emphasis="strong" divider={false} />
        </NeumorphCard>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <NumericKeypad value={amount} onChange={setAmount} maxLength={7} showDecimal />
          <View style={{ height: 12 }} />
          <GradientButton title={total > 0 ? `Continue with ${formatINR(total, { maximumFractionDigits: 0 })}` : 'Enter amount'} gradient="primary" fullWidth size="lg" disabled={total <= 0} onPress={() => navigation.navigate('ScanPaymentMethod', { merchantId: route.params.merchantId, amount: total })} />
        </View>
      </View>
    </Screen>
  );
}
