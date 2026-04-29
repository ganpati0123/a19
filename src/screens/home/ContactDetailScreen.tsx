import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, Avatar, Chip, GradientButton, ListRow, NeumorphCard, PressableScale, SectionHeader, StatPill } from '@components/index';
import { findContact, contactTagColors, contactTagLabels } from '@data/contacts';
import { transactions } from '@data/transactions';
import { formatCompactINR, formatINR, formatRelative, formatPhone } from '@utils/format';
import { useFavorites } from '@hooks/useFavorites';
import type { HomeStackScreenProps } from '@navigation/types';

export function ContactDetailScreen({ route, navigation }: HomeStackScreenProps<'ContactDetail'>) {
  const theme = useTheme();
  const c = findContact(route.params.contactId);
  const { has, toggle } = useFavorites();

  const txs = useMemo(() => transactions.filter((t) => t.contactId === c?.id).slice(0, 12), [c]);

  if (!c) {
    return (
      <Screen>
        <Header title="Contact" />
        <Text style={{ padding: 24, color: theme.colors.text }}>Contact not found.</Text>
      </Screen>
    );
  }

  const isFav = has('contact', c.id);

  return (
    <Screen>
      <Header title={c.name} subtitle={c.upi} />
      <View style={styles.head}>
        <Avatar name={c.name} color={c.color} size={88} />
        <Text style={[styles.name, { color: theme.colors.text }]}>{c.name}</Text>
        <Text style={[styles.upi, { color: theme.colors.textMuted }]}>{c.upi}</Text>
        <View style={styles.chipRow}>
          <Chip label={contactTagLabels[c.tag]} color={contactTagColors[c.tag]} active />
          {c.isVerified ? <Chip label="✓ Verified" color={theme.colors.success} /> : null}
          <Chip label={`Trust ${c.trustScore}`} />
          <Chip label={c.bank} />
        </View>
        <View style={styles.actions}>
          <GradientButton title="Pay" gradient="primary" onPress={() => navigation.navigate('EnterAmount', { contactId: c.id })} iconLeft={<Text style={{ color: '#fff' }}>⚡</Text>} />
          <GradientButton title="Request" variant="outline" onPress={() => navigation.navigate('RequestMoneyAmount', { contactId: c.id })} />
          <GradientButton title={isFav ? '★' : '☆'} variant="ghost" onPress={() => toggle('contact', c.id)} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatPill label="Sent" value={formatCompactINR(c.totalSent)} trend="up" trendValue="₹240" />
        <StatPill label="Received" value={formatCompactINR(c.totalReceived)} trend="flat" trendValue="0" />
        <StatPill label="Last paid" value={formatRelative(c.lastTransactionAt)} caption={formatINR(c.lastTransactionAmount)} />
      </View>

      <SectionHeader title="Profile details" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Phone" subtitle="Tap to call or save" rightTitle={formatPhone(c.phone)} onPress={() => {}} />
        {c.email ? <ListRow title="Email" rightTitle={c.email} onPress={() => {}} /> : null}
        <ListRow title="Bank" rightTitle={c.bank} onPress={() => navigation.navigate('BankAccounts')} />
        <ListRow title="City" rightTitle={c.city} onPress={() => {}} />
        {c.occupation ? <ListRow title="Occupation" rightTitle={c.occupation} onPress={() => {}} /> : null}
        {c.notes ? <ListRow title="Notes" subtitle={c.notes} onPress={() => {}} divider={false} /> : <ListRow title="Add a note" rightTitle="✎" onPress={() => {}} divider={false} />}
      </NeumorphCard>

      <SectionHeader title="Recent payments" subtitle={`${txs.length} between you`} actionLabel="See all" onAction={() => navigation.getParent()?.navigate('TransactionsTab')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {txs.length === 0 ? (
          <View style={{ padding: 24 }}>
            <Text style={{ color: theme.colors.textMuted }}>No payments yet. Tap "Pay" above to send your first payment.</Text>
          </View>
        ) : (
          txs.map((t) => (
            <ListRow
              key={t.id}
              title={t.description}
              subtitle={`${formatRelative(t.createdAt)} • ${t.utr}`}
              rightTitle={`${t.direction === 'sent' ? '-' : '+'}${formatINR(t.amount)}`}
              rightTitleColor={t.direction === 'sent' ? theme.colors.danger : theme.colors.success}
              rightSubtitle={t.status}
              onPress={() => navigation.getParent()?.navigate('TransactionsTab', { screen: 'TransactionDetail', params: { transactionId: t.id } } as any)}
            />
          ))
        )}
      </NeumorphCard>

      <SectionHeader title="Quick options" />
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        <PressableScale onPress={() => navigation.navigate('SplitGroups')} haptic="light">
          <NeumorphCard style={{ padding: 16 }}>
            <Text style={[styles.quickTitle, { color: theme.colors.text }]}>Add to a split group</Text>
            <Text style={[styles.quickSub, { color: theme.colors.textMuted }]}>Track shared expenses with this contact</Text>
          </NeumorphCard>
        </PressableScale>
        <PressableScale onPress={() => {}} haptic="light">
          <NeumorphCard style={{ padding: 16 }}>
            <Text style={[styles.quickTitle, { color: theme.colors.text }]}>Block contact</Text>
            <Text style={[styles.quickSub, { color: theme.colors.textMuted }]}>You will no longer receive payments from them</Text>
          </NeumorphCard>
        </PressableScale>
        <PressableScale onPress={() => {}} haptic="light">
          <NeumorphCard style={{ padding: 16 }}>
            <Text style={[styles.quickTitle, { color: theme.colors.text }]}>Report</Text>
            <Text style={[styles.quickSub, { color: theme.colors.textMuted }]}>Tell us if you suspect fraud</Text>
          </NeumorphCard>
        </PressableScale>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', paddingTop: 18, paddingHorizontal: 16, gap: 6 },
  name: { fontSize: 22, fontWeight: '800', marginTop: 12 },
  upi: { fontSize: 13 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 18 },
  quickTitle: { fontSize: 14, fontWeight: '800' },
  quickSub: { fontSize: 12, marginTop: 4 },
});
