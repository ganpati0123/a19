import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, ListRow, NeumorphCard, SectionHeader, GradientButton } from '@components/index';
import { gradients } from '@theme/gradients';
import { formatINR, maskCard } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

interface Bank {
  id: string;
  name: string;
  tail: string;
  balance: number;
  primary: boolean;
  gradient: keyof typeof gradients;
}

export const banksData: Bank[] = [
  { id: 'b_1', name: 'HDFC Bank', tail: '4321', balance: 42118.55, primary: true, gradient: 'primaryStrong' },
  { id: 'b_2', name: 'Axis Bank', tail: '7821', balance: 17920.4, primary: false, gradient: 'paymentInfo' },
  { id: 'b_3', name: 'Kotak Mahindra', tail: '9921', balance: 24322.0, primary: false, gradient: 'sunset' },
];

export function BankAccountsScreen({ navigation }: HomeStackScreenProps<'BankAccounts'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Bank accounts" subtitle="Tap a card for full details" />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {banksData.map((b) => (
          <GradientCard key={b.id} gradient={b.gradient} radius={20} style={{ padding: 18 }}>
            <Text style={styles.bankKicker}>{b.primary ? 'Primary account' : 'Linked account'}</Text>
            <Text style={styles.bankName}>{b.name}</Text>
            <Text style={styles.bankCard}>{maskCard(`5500 0000 0000 ${b.tail}`)}</Text>
            <View style={styles.row}>
              <View>
                <Text style={styles.bankLabel}>Balance</Text>
                <Text style={styles.bankBal}>{formatINR(b.balance)}</Text>
              </View>
              <GradientButton title="Open" variant="ghost" size="sm" onPress={() => navigation.navigate('BankDetail', { bankId: b.id })} textStyle={{ color: '#fff' }} />
            </View>
          </GradientCard>
        ))}
      </View>

      <SectionHeader title="UPI IDs" actionLabel="Manage" onAction={() => navigation.navigate('ManageUpi')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="ganpati@payx" subtitle="HDFC Bank ••4321" rightTitle="Primary" rightTitleColor={theme.colors.success} onPress={() => navigation.navigate('UpiDetail', { upiId: 'ganpati@payx' })} />
        <ListRow title="ganpati@oksbi" subtitle="Axis Bank ••7821" onPress={() => navigation.navigate('UpiDetail', { upiId: 'ganpati@oksbi' })} />
        <ListRow title="9876543210@payx" subtitle="Linked to phone" divider={false} onPress={() => navigation.navigate('UpiDetail', { upiId: '9876543210@payx' })} />
      </NeumorphCard>

      <View style={{ paddingHorizontal: 16, marginTop: 18, gap: 10 }}>
        <GradientButton title="+ Add new bank account" gradient="primary" fullWidth size="lg" onPress={() => {}} />
        <GradientButton title="+ Create another UPI ID" variant="outline" fullWidth size="md" onPress={() => navigation.navigate('ManageUpi')} />
      </View>
    </Screen>
  );
}

export function BankDetailScreen({ route, navigation }: HomeStackScreenProps<'BankDetail'>) {
  const theme = useTheme();
  const b = banksData.find((x) => x.id === route.params.bankId) ?? banksData[0];
  return (
    <Screen>
      <Header title={b.name} subtitle={`••••${b.tail}`} />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <GradientCard gradient={b.gradient} radius={20} style={{ padding: 18 }}>
          <Text style={styles.bankKicker}>Available balance</Text>
          <Text style={[styles.bankBal, { color: '#fff', fontSize: 30 }]}>{formatINR(b.balance)}</Text>
        </GradientCard>
        <NeumorphCard style={{ paddingVertical: 4 }}>
          <ListRow title="Account holder" rightTitle="Ganpati Tari" />
          <ListRow title="Account number" rightTitle={`XXXX XXXX ${b.tail}`} />
          <ListRow title="IFSC" rightTitle="HDFC0001234" />
          <ListRow title="Branch" rightTitle="Andheri West, Mumbai" />
          <ListRow title="Account type" rightTitle="Savings" />
          <ListRow title="Linked UPI IDs" rightTitle="2" onPress={() => navigation.navigate('ManageUpi')} divider={false} />
        </NeumorphCard>
        <NeumorphCard style={{ paddingVertical: 4 }}>
          <ListRow title="View statement" subtitle="Last 90 days" onPress={() => navigation.getParent()?.navigate('TransactionsTab')} />
          <ListRow title="Reset UPI PIN" onPress={() => {}} />
          <ListRow title="Set as primary" onPress={() => {}} />
          <ListRow title="Remove from PayX" rightTitle=">" rightTitleColor={theme.colors.danger} onPress={() => {}} divider={false} />
        </NeumorphCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bankKicker: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  bankName: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  bankCard: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 8, letterSpacing: 1.4, fontFamily: 'Menlo' },
  bankLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 12 },
  bankBal: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
