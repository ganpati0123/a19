import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, Avatar, GradientCard, GradientButton, ListRow, NeumorphCard, SectionHeader, AmountInput } from '@components/index';
import { findTransaction, transactionCategoryIcons, transactionCategoryLabels, transactionStatusColors, transactionStatusLabels } from '@data/transactions';
import { findContact } from '@data/contacts';
import { formatDateTime, formatINR } from '@utils/format';
import type { TxStackScreenProps } from '@navigation/types';

export function TransactionDetailScreen({ route, navigation }: TxStackScreenProps<'TransactionDetail'>) {
  const theme = useTheme();
  const t = findTransaction(route.params.transactionId);
  if (!t) return <Screen><Header title="Transaction" /></Screen>;
  const c = t.contactId ? findContact(t.contactId) : null;

  return (
    <Screen>
      <Header title="Transaction" subtitle={transactionStatusLabels[t.status]} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient={t.direction === 'sent' ? 'paymentDanger' : 'forest'} radius={22} style={{ padding: 18, alignItems: 'center' }}>
          {c ? <Avatar name={c.name} color={c.color} size={68} /> : <Text style={{ fontSize: 40 }}>🏪</Text>}
          <Text style={styles.subtle}>{t.direction === 'sent' ? 'Paid to' : 'Received from'}</Text>
          <Text style={styles.who}>{c?.name ?? t.merchantName ?? 'Payment'}</Text>
          <AmountInput amount={t.amount} fontSize={42} />
          <Text style={styles.dateline}>{formatDateTime(t.createdAt)}</Text>
        </GradientCard>
      </View>

      <SectionHeader title="Details" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Status" rightTitle={transactionStatusLabels[t.status]} rightTitleColor={transactionStatusColors[t.status]} />
        <ListRow title="UTR" rightTitle={t.utr} />
        <ListRow title="Reference" rightTitle={t.reference} />
        <ListRow title="UPI" rightTitle={t.upiHandle} />
        <ListRow title="Bank" rightTitle={t.bankName} subtitle={`••${t.bankAccountTail}`} />
        <ListRow title="Method" rightTitle={t.paymentMethod.toUpperCase()} />
        <ListRow title="Category" leading={<Text style={{ fontSize: 22 }}>{transactionCategoryIcons[t.category]}</Text>} rightTitle={transactionCategoryLabels[t.category]} onPress={() => navigation.navigate('CategoryDetail', { categoryId: t.category })} />
        <ListRow title="Fee" rightTitle={formatINR(t.fee)} />
        <ListRow title="Cashback" rightTitle={formatINR(t.cashback)} rightTitleColor={theme.colors.success} divider={false} />
      </NeumorphCard>

      <SectionHeader title="Timeline" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Initiated" rightTitle={formatDateTime(t.createdAt - 2_000)} />
        <ListRow title="Authorized" rightTitle={formatDateTime(t.createdAt)} />
        {t.settledAt ? <ListRow title="Settled" rightTitle={formatDateTime(t.settledAt)} divider={false} /> : <ListRow title="Settlement" rightTitle="In progress" divider={false} />}
      </NeumorphCard>

      <View style={{ paddingHorizontal: 16, marginTop: 18, gap: 10 }}>
        <GradientButton title="Download statement" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('DownloadStatement', { transactionId: t.id })} />
        {t.isReceiptAvailable ? <GradientButton title="View receipt" variant="outline" fullWidth size="md" onPress={() => navigation.getParent()?.navigate('HomeTab', { screen: 'Receipt', params: { transactionId: t.id } } as any)} /> : null}
        {t.isDisputable ? <GradientButton title="Raise dispute" variant="ghost" fullWidth size="md" onPress={() => navigation.navigate('Dispute', { transactionId: t.id })} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtle: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 8, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  who: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  dateline: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
});
