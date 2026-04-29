import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, NeumorphCard, ListRow, AmountInput, GradientCard } from '@components/index';
import { findTransaction } from '@data/transactions';
import { findContact } from '@data/contacts';
import { formatDateTime, formatINR } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

export function ReceiptScreen({ route, navigation }: HomeStackScreenProps<'Receipt'>) {
  const theme = useTheme();
  const t = findTransaction(route.params.transactionId) ?? null;
  const c = t?.contactId ? findContact(t.contactId) : null;

  return (
    <Screen>
      <Header title="Receipt" />
      <View style={styles.body}>
        <GradientCard gradient="primary" radius={24} style={{ padding: 22, alignItems: 'center' }}>
          <Text style={styles.kicker}>Successful payment</Text>
          <AmountInput amount={t?.amount ?? route.params.transactionId.length * 100} fontSize={42} style={{ marginTop: 8 }} />
          <Text style={styles.recipient}>to {c?.name ?? t?.merchantName ?? 'Recipient'}</Text>
          <Text style={styles.date}>{formatDateTime(t?.createdAt ?? Date.now())}</Text>
        </GradientCard>

        <NeumorphCard style={{ marginTop: 16, paddingVertical: 4 }}>
          <ListRow title="Transaction ID" rightTitle={route.params.transactionId.toUpperCase()} />
          <ListRow title="UTR" rightTitle={t?.utr ?? '—'} />
          <ListRow title="From" rightTitle={t?.bankName ?? 'HDFC Bank'} subtitle="Linked savings account" />
          <ListRow title="To" rightTitle={c?.upi ?? t?.upiHandle ?? '—'} />
          <ListRow title="Method" rightTitle={(t?.paymentMethod ?? 'upi').toUpperCase()} />
          <ListRow title="Fee" rightTitle={formatINR(t?.fee ?? 0)} />
          <ListRow title="Cashback" rightTitle={formatINR(t?.cashback ?? 0)} rightTitleColor={theme.colors.success} divider={false} />
        </NeumorphCard>

        <View style={styles.actions}>
          <GradientButton title="Share receipt" gradient="primary" size="lg" fullWidth onPress={() => navigation.navigate('ShareReceipt', { transactionId: route.params.transactionId })} iconLeft={<Text style={{ color: '#fff' }}>📤</Text>} />
          <GradientButton title="Download PDF" variant="outline" size="md" onPress={() => navigation.getParent()?.navigate('TransactionsTab', { screen: 'DownloadStatement', params: { transactionId: route.params.transactionId } } as any)} />
          <GradientButton title="Raise dispute" variant="ghost" size="md" onPress={() => navigation.getParent()?.navigate('TransactionsTab', { screen: 'Dispute', params: { transactionId: route.params.transactionId } } as any)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16 },
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  recipient: { color: '#fff', fontSize: 14, marginTop: 4 },
  date: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 6 },
  actions: { gap: 8, marginTop: 16 },
});
