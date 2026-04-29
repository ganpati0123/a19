import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, ListRow, NeumorphCard, AmountInput, Chip } from '@components/index';
import { findMerchant } from '@data/merchants';
import { formatINR, maskCard } from '@utils/format';
import type { ScanStackScreenProps } from '@navigation/types';

const methods: { id: 'upi' | 'card' | 'wallet' | 'netbanking'; title: string; subtitle: string; emoji: string; rightTitle?: string }[] = [
  { id: 'upi', title: 'UPI – HDFC Bank', subtitle: 'ganpati@payx • ••4321', emoji: '⚡', rightTitle: 'Recommended' },
  { id: 'wallet', title: 'PayX Wallet', subtitle: 'Balance ₹274 • Use to pay', emoji: '👛' },
  { id: 'card', title: 'HDFC Diners', subtitle: maskCard('5500 0000 0000 4321'), emoji: '💳', rightTitle: '5% off' },
  { id: 'card', title: 'Axis ACE Visa', subtitle: maskCard('4500 0000 0000 7821'), emoji: '💳' },
  { id: 'netbanking', title: 'Net banking', subtitle: '50+ banks supported', emoji: '🏦' },
];

export function PaymentMethodScreen({ route, navigation }: ScanStackScreenProps<'ScanPaymentMethod'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  const [selected, setSelected] = useState<'upi' | 'card' | 'wallet' | 'netbanking'>('upi');
  return (
    <Screen>
      <Header title="Payment method" subtitle={`${formatINR(route.params.amount)} to ${m?.name ?? 'merchant'}`} />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <AmountInput amount={route.params.amount} fontSize={36} />
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 4 }}>Includes ₹{Math.round(route.params.amount * 0.02)} cashback</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['upi', 'wallet', 'card', 'netbanking'] as const).map((m2) => (
            <Chip key={m2} label={m2.toUpperCase()} active={selected === m2} onPress={() => setSelected(m2)} />
          ))}
        </View>
        <NeumorphCard style={{ paddingVertical: 4 }}>
          {methods.filter((meth) => meth.id === selected).map((meth, i) => (
            <ListRow key={i} leading={<Text style={{ fontSize: 24 }}>{meth.emoji}</Text>} title={meth.title} subtitle={meth.subtitle} rightTitle={meth.rightTitle} rightTitleColor={theme.colors.success} divider={false} onPress={() => {}} />
          ))}
        </NeumorphCard>

        <NeumorphCard style={{ paddingVertical: 4 }}>
          <ListRow title="Apply offer" rightTitle="₹50 off" rightTitleColor={theme.colors.success} onPress={() => {}} />
          <ListRow title="Use cashback wallet" rightTitle="₹274 available" onPress={() => {}} />
          <ListRow title="Save bill summary" rightTitle="On" onPress={() => {}} divider={false} />
        </NeumorphCard>

        <GradientButton
          title={`Pay ${formatINR(route.params.amount, { maximumFractionDigits: 0 })}`}
          gradient="primary"
          size="lg"
          fullWidth
          onPress={() => navigation.navigate('ScanPin', { merchantId: route.params.merchantId, amount: route.params.amount, method: selected })}
        />
      </View>
    </Screen>
  );
}
