import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, ListRow, NeumorphCard, SectionHeader } from '@components/index';
import type { HomeStackScreenProps } from '@navigation/types';

const upis = [
  { id: 'ganpati@payx', primary: true, bank: 'HDFC Bank ••4321' },
  { id: 'ganpati@oksbi', primary: false, bank: 'Axis Bank ••7821' },
  { id: '9876543210@payx', primary: false, bank: 'Kotak ••9921' },
  { id: 'ganpati.t@axl', primary: false, bank: 'Axis Bank ••7821' },
];

export function ManageUpiScreen({ navigation }: HomeStackScreenProps<'ManageUpi'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="UPI IDs" subtitle="Tap to manage each handle" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {upis.map((u, i) => (
          <ListRow
            key={u.id}
            title={u.id}
            subtitle={u.bank}
            rightTitle={u.primary ? 'Primary' : ''}
            rightTitleColor={u.primary ? theme.colors.success : theme.colors.textMuted}
            divider={i < upis.length - 1}
            onPress={() => navigation.navigate('UpiDetail', { upiId: u.id })}
          />
        ))}
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18, gap: 10 }}>
        <GradientButton title="+ Create new UPI ID" gradient="primary" fullWidth size="lg" onPress={() => {}} />
        <GradientButton title="Tips on choosing a UPI ID" variant="outline" fullWidth size="md" onPress={() => navigation.navigate('Help')} />
      </View>
      <SectionHeader title="Why multiple UPI IDs?" />
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ color: theme.colors.textMuted, lineHeight: 20 }}>
          Use separate UPI IDs for personal and business so receipts and statements stay clean. PayX automatically maps merchant payments to the right handle.
        </Text>
      </View>
    </Screen>
  );
}

export function UpiDetailScreen({ route, navigation }: HomeStackScreenProps<'UpiDetail'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title={route.params.upiId} subtitle="UPI ID" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Primary" rightTitle="Yes" />
        <ListRow title="Linked bank" rightTitle="HDFC Bank" onPress={() => navigation.navigate('BankAccounts')} />
        <ListRow title="Account ••4321" rightTitle="Savings" />
        <ListRow title="Daily limit" rightTitle="₹1,00,000" />
        <ListRow title="QR code" rightTitle="Show" onPress={() => {}} />
        <ListRow title="Reset UPI PIN" rightTitle=">" onPress={() => {}} />
        <ListRow title="Disable handle" rightTitle=">" rightTitleColor={theme.colors.danger} onPress={() => {}} divider={false} />
      </NeumorphCard>
    </Screen>
  );
}
