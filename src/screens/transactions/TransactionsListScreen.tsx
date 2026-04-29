import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, Avatar, Chip, ListRow, NeumorphCard, SectionHeader, StatPill, GradientButton, EmptyState, SkeletonRow } from '@components/index';
import { transactions, transactionStatusColors, transactionStatusLabels, transactionCategoryIcons, transactionCategoryLabels } from '@data/transactions';
import { contacts } from '@data/contacts';
import { formatCompactINR, formatINR, formatRelative } from '@utils/format';
import { useSimulatedFetch } from '@hooks/useSimulatedFetch';
import type { TxStackScreenProps } from '@navigation/types';

const filters: Array<'all' | 'sent' | 'received' | 'pending'> = ['all', 'sent', 'received', 'pending'];

export function TransactionsListScreen({ navigation }: TxStackScreenProps<'TransactionsList'>) {
  const theme = useTheme();
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'pending'>('all');
  const { data: list, isLoading, refresh } = useSimulatedFetch(async () => transactions, { delayMs: 500 });

  const filtered = useMemo(() => {
    if (!list) return [];
    if (filter === 'all') return list.slice(0, 60);
    if (filter === 'sent') return list.filter((t) => t.direction === 'sent').slice(0, 60);
    if (filter === 'received') return list.filter((t) => t.direction === 'received').slice(0, 60);
    return list.filter((t) => t.status === 'pending').slice(0, 60);
  }, [list, filter]);

  const totals = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const sent = (list ?? []).filter((t) => t.direction === 'sent').reduce((a, b) => a + b.amount, 0);
    const received = (list ?? []).filter((t) => t.direction === 'received').reduce((a, b) => a + b.amount, 0);
    return { sent, received };
  }, [list]);

  return (
    <Screen onRefresh={refresh}>
      <Header showBack={false} title="Transactions" subtitle="All your activity in one place" right={<GradientButton title="Filter" variant="outline" size="sm" onPress={() => navigation.navigate('TransactionsFilter')} />} />

      <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 10 }}>
        <StatPill label="Sent" value={formatCompactINR(totals.sent)} trend="down" trendValue="3.2%" />
        <StatPill label="Received" value={formatCompactINR(totals.received)} trend="up" trendValue="12%" />
        <StatPill label="Net" value={formatCompactINR(totals.received - totals.sent)} trend="up" trendValue="₹430" />
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 14, flexDirection: 'row', gap: 8 }}>
        {filters.map((f) => (
          <Chip key={f} label={f.toUpperCase()} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>

      <SectionHeader title="Insights" subtitle="Tap to drill down" actionLabel="All categories" onAction={() => navigation.navigate('Insights')} />
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Object.entries(transactionCategoryLabels).slice(0, 6).map(([id, label]) => (
          <Chip key={id} label={`${transactionCategoryIcons[id as keyof typeof transactionCategoryIcons]} ${label}`} onPress={() => navigation.navigate('CategoryDetail', { categoryId: id })} />
        ))}
      </View>

      <SectionHeader title={filter === 'all' ? 'All transactions' : transactionStatusLabels[filter as keyof typeof transactionStatusLabels] ?? filter} subtitle={`${filtered.length} entries`} />
      {isLoading ? (
        <View style={{ paddingHorizontal: 16 }}>
          <SkeletonRow count={6} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🪐" title="Nothing here yet" subtitle="Try a different filter or pull to refresh" />
      ) : (
        <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
          {filtered.map((t, i) => {
            const c = contacts.find((cc) => cc.id === t.contactId);
            return (
              <ListRow
                key={t.id}
                leading={<Avatar name={c?.name ?? t.merchantName ?? '?'} color={c?.color} size={42} />}
                title={c?.name ?? t.merchantName ?? 'Payment'}
                subtitle={`${formatRelative(t.createdAt)} • ${transactionCategoryLabels[t.category]} • ${t.utr}`}
                rightTitle={`${t.direction === 'sent' ? '-' : '+'}${formatINR(t.amount)}`}
                rightTitleColor={t.direction === 'sent' ? theme.colors.danger : theme.colors.success}
                rightSubtitle={transactionStatusLabels[t.status]}
                badge={t.status !== 'success' ? transactionStatusLabels[t.status] : undefined}
                badgeColor={transactionStatusColors[t.status]}
                onPress={() => navigation.navigate('TransactionDetail', { transactionId: t.id })}
                divider={i < filtered.length - 1}
              />
            );
          })}
        </NeumorphCard>
      )}
    </Screen>
  );
}
