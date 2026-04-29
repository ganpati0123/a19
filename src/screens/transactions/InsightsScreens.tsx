import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, ListRow, NeumorphCard, SectionHeader, StatPill } from '@components/index';
import { transactions, transactionCategoryIcons, transactionCategoryLabels, totalsForCategory } from '@data/transactions';
import { contacts } from '@data/contacts';
import { formatCompactINR, formatINR, formatRelative } from '@utils/format';
import type { TxStackScreenProps } from '@navigation/types';

export function InsightsScreen({ navigation }: TxStackScreenProps<'Insights'>) {
  const theme = useTheme();
  const totals = totalsForCategory();
  const cats = Object.keys(transactionCategoryLabels) as Array<keyof typeof transactionCategoryLabels>;
  return (
    <Screen>
      <Header title="Insights" subtitle="This month" />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <GradientCard gradient="primaryStrong" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Total spent</Text>
          <Text style={styles.amount}>{formatINR(34280)}</Text>
          <Text style={styles.sub}>+ ₹1,420 vs last month • 28% on Food, 22% on Travel</Text>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatPill label="Daily avg" value={formatCompactINR(1142)} trend="up" trendValue="₹40" />
          <StatPill label="Highest day" value={formatCompactINR(3120)} caption="Saturday" />
          <StatPill label="Cashback" value={formatCompactINR(840)} trend="up" trendValue="₹120" />
        </View>
      </View>
      <SectionHeader title="By category" subtitle="Tap any to drill down" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {cats.slice(0, 12).map((c, i) => {
          const total = totals[c] ?? 0;
          return (
            <ListRow
              key={c}
              leading={<Text style={{ fontSize: 22 }}>{transactionCategoryIcons[c]}</Text>}
              title={transactionCategoryLabels[c]}
              subtitle={`${Math.round(total / 100) / 10}K spent this period`}
              rightTitle={formatINR(total)}
              onPress={() => navigation.navigate('CategoryDetail', { categoryId: c })}
              divider={i < cats.length - 1}
            />
          );
        })}
      </NeumorphCard>
    </Screen>
  );
}

export function CategoryDetailScreen({ route, navigation }: TxStackScreenProps<'CategoryDetail'>) {
  const theme = useTheme();
  const id = route.params.categoryId as keyof typeof transactionCategoryLabels;
  const total = totalsForCategory()[id] ?? 0;
  const txs = transactions.filter((t) => t.category === id).slice(0, 30);
  return (
    <Screen>
      <Header title={`${transactionCategoryIcons[id] ?? '📊'} ${transactionCategoryLabels[id] ?? id}`} subtitle={`${txs.length} transactions`} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Spent on {transactionCategoryLabels[id] ?? id}</Text>
          <Text style={styles.amount}>{formatINR(total)}</Text>
          <Text style={styles.sub}>Tap below to see all entries</Text>
        </GradientCard>
      </View>
      <SectionHeader title="Recent" actionLabel="See all" onAction={() => navigation.navigate('CategoryTransactions', { categoryId: id as string })} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {txs.slice(0, 10).map((t, i) => {
          const c = contacts.find((cc) => cc.id === t.contactId);
          return (
            <ListRow
              key={t.id}
              title={c?.name ?? t.merchantName ?? 'Payment'}
              subtitle={`${formatRelative(t.createdAt)} • ${t.utr}`}
              rightTitle={`${t.direction === 'sent' ? '-' : '+'}${formatINR(t.amount)}`}
              rightTitleColor={t.direction === 'sent' ? theme.colors.danger : theme.colors.success}
              onPress={() => navigation.navigate('TransactionDetail', { transactionId: t.id })}
              divider={i < 9}
            />
          );
        })}
      </NeumorphCard>
    </Screen>
  );
}

export function CategoryTransactionsScreen({ route, navigation }: TxStackScreenProps<'CategoryTransactions'>) {
  const theme = useTheme();
  const id = route.params.categoryId as keyof typeof transactionCategoryLabels;
  const txs = transactions.filter((t) => t.category === id);
  return (
    <Screen>
      <Header title={transactionCategoryLabels[id] ?? id} subtitle={`${txs.length} entries`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {txs.map((t, i) => (
          <ListRow
            key={t.id}
            title={t.description}
            subtitle={`${formatRelative(t.createdAt)} • ${t.utr}`}
            rightTitle={`${t.direction === 'sent' ? '-' : '+'}${formatINR(t.amount)}`}
            rightTitleColor={t.direction === 'sent' ? theme.colors.danger : theme.colors.success}
            onPress={() => navigation.navigate('TransactionDetail', { transactionId: t.id })}
            divider={i < txs.length - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function TransactionsFilterScreen({ navigation }: TxStackScreenProps<'TransactionsFilter'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Filter transactions" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Date range" rightTitle="Last 30 days" onPress={() => {}} />
        <ListRow title="Direction" rightTitle="All" onPress={() => {}} />
        <ListRow title="Status" rightTitle="All" onPress={() => {}} />
        <ListRow title="Category" rightTitle="All" onPress={() => {}} />
        <ListRow title="Amount range" rightTitle="₹0 - ₹50,000" onPress={() => {}} />
        <ListRow title="Bank" rightTitle="All" onPress={() => {}} divider={false} />
      </NeumorphCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  amount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
});
