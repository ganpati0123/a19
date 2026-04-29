import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/ThemeProvider';
import { gradients } from '@theme/gradients';
import { Screen, Header, Avatar, Chip, GlassCard, GradientButton, GradientCard, ListRow, NeumorphCard, PressableScale, QuickActionTile, SectionHeader, Skeleton, StatPill } from '@components/index';
import { contacts, recentContacts, splitGroups, contactTagColors, contactTagLabels } from '@data/contacts';
import { transactions, totalsForToday } from '@data/transactions';
import { formatCompactINR, formatINR, formatRelative, maskUpi } from '@utils/format';
import { useSimulatedFetch } from '@hooks/useSimulatedFetch';
import { useHaptics } from '@hooks/useHaptics';
import type { HomeStackScreenProps } from '@navigation/types';

export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const theme = useTheme();
  const haptic = useHaptics();
  const { data, isLoading, refresh } = useSimulatedFetch(async () => ({
    contacts: recentContacts,
    transactions: transactions.slice(0, 6),
    totals: totalsForToday(),
  }), { delayMs: 600 });

  const balance = 84360.45;
  const upi = 'ganpati@payx';

  const onContact = useCallback((id: string) => {
    haptic('light');
    navigation.navigate('ContactDetail', { contactId: id });
  }, [haptic, navigation]);

  const quickActions = useMemo(() => [
    { emoji: '⚡', label: 'To Mobile', gradient: 'primary' as const, onPress: () => navigation.getParent()?.navigate('BillsTab') },
    { emoji: '🏦', label: 'To Bank', gradient: 'paymentInfo' as const, onPress: () => navigation.navigate('BankAccounts') },
    { emoji: '🧾', label: 'To UPI ID', gradient: 'sunset' as const, onPress: () => navigation.navigate('ManageUpi') },
    { emoji: '💰', label: 'Self', gradient: 'forest' as const, onPress: () => navigation.navigate('BankAccounts') },
    { emoji: '💸', label: 'Request', gradient: 'fire' as const, onPress: () => navigation.navigate('RequestMoney') },
    { emoji: '🎁', label: 'Rewards', gradient: 'gold' as const, onPress: () => navigation.navigate('Rewards') },
    { emoji: '🤝', label: 'Split', gradient: 'candy' as const, onPress: () => navigation.navigate('SplitGroups') },
    { emoji: '📊', label: 'Insights', gradient: 'ocean' as const, onPress: () => navigation.getParent()?.navigate('TransactionsTab') },
  ], [navigation]);

  return (
    <Screen onRefresh={refresh}>
      <Header
        showBack={false}
        title="Good morning, Ganpati"
        subtitle={maskUpi(upi)}
        left={<Avatar name="Ganpati Tari" size={40} />}
        right={
          <PressableScale onPress={() => navigation.navigate('Notifications')} haptic="light" style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.iconBtnText, { color: theme.colors.text }]}>🔔</Text>
          </PressableScale>
        }
      />

      {/* Hero balance card */}
      <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
        <PressableScale onPress={() => navigation.navigate('BankAccounts')} haptic="medium">
          <GradientCard gradient="primaryStrong" radius={24} style={{ padding: 20 }}>
            <View style={styles.heroRow}>
              <View>
                <Text style={styles.heroLabel}>Total balance</Text>
                <Text style={styles.heroAmount}>{formatINR(balance)}</Text>
                <Text style={styles.heroSub}>Across 3 linked accounts • +₹2,140 this week</Text>
              </View>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>UPI ✓</Text>
              </View>
            </View>
            <View style={styles.heroChips}>
              <Chip label="Add money" icon="➕" active />
              <Chip label="Withdraw" icon="↘️" />
              <Chip label="Statement" icon="🧾" />
            </View>
          </GradientCard>
        </PressableScale>

        {/* Stat pills */}
        <View style={styles.stats}>
          <StatPill label="Sent today" value={formatCompactINR(data?.totals.sent ?? 0)} trend="down" trendValue="3.2%" caption="vs yesterday" />
          <StatPill label="Received" value={formatCompactINR(data?.totals.received ?? 0)} trend="up" trendValue="12%" caption="vs yesterday" />
          <StatPill label="Cashback" value="₹274" trend="up" trendValue="₹40" caption="this month" />
        </View>
      </View>

      <SectionHeader title="Quick actions" subtitle="Tap to dive in" actionLabel="See all" onAction={() => navigation.navigate('Settings')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qaRow}>
        {quickActions.map((q) => (
          <QuickActionTile key={q.label} emoji={q.emoji} label={q.label} gradient={q.gradient} onPress={q.onPress} />
        ))}
      </ScrollView>

      <SectionHeader title="Recent contacts" subtitle="Tap a contact to pay instantly" actionLabel="View all" onAction={() => navigation.navigate('SplitGroups')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactsRow}>
        {(data?.contacts ?? recentContacts.slice(0, 6)).map((c) => (
          <PressableScale key={c.id} onPress={() => onContact(c.id)} haptic="light" style={styles.contactCard}>
            <Avatar name={c.name} size={56} color={c.color} />
            <Text style={[styles.contactName, { color: theme.colors.text }]} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
            <Text style={[styles.contactBank, { color: theme.colors.textMuted }]} numberOfLines={1}>{c.bank.split(' ')[0]}</Text>
          </PressableScale>
        ))}
      </ScrollView>

      <SectionHeader title="Split groups" actionLabel="Manage" onAction={() => navigation.navigate('SplitGroups')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qaRow}>
        {splitGroups.map((g) => (
          <PressableScale key={g.id} onPress={() => navigation.navigate('SplitGroupDetail', { groupId: g.id })} haptic="light">
            <GlassCard style={styles.groupCard}>
              <Text style={styles.groupEmoji}>{g.emoji}</Text>
              <Text style={[styles.groupName, { color: theme.colors.text }]} numberOfLines={1}>{g.name}</Text>
              <Text style={[styles.groupTotal, { color: theme.colors.textMuted }]}>Total {formatCompactINR(g.totalSpent)}</Text>
              <Text style={[styles.groupOutstanding, { color: g.outstanding < 0 ? theme.colors.success : theme.colors.danger }]}>
                {g.outstanding < 0 ? `You're owed ${formatINR(-g.outstanding)}` : g.outstanding > 0 ? `You owe ${formatINR(g.outstanding)}` : 'Settled up'}
              </Text>
            </GlassCard>
          </PressableScale>
        ))}
      </ScrollView>

      <SectionHeader title="Recent activity" subtitle="Last 6 transactions" actionLabel="See all" onAction={() => navigation.getParent()?.navigate('TransactionsTab')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                <Skeleton width="60%" height={14} />
                <View style={{ height: 6 }} />
                <Skeleton width="40%" height={10} />
              </View>
            ))
          : (data?.transactions ?? []).map((t) => {
              const c = contacts.find((cc) => cc.id === t.contactId);
              return (
                <ListRow
                  key={t.id}
                  leading={<Avatar name={c?.name ?? t.merchantName ?? '?'} size={42} />}
                  title={c?.name ?? t.merchantName ?? 'Payment'}
                  subtitle={`${formatRelative(t.createdAt)} • ${t.upiHandle}`}
                  rightTitle={`${t.direction === 'sent' ? '-' : '+'}${formatINR(t.amount)}`}
                  rightTitleColor={t.direction === 'sent' ? theme.colors.danger : theme.colors.success}
                  rightSubtitle={t.status === 'success' ? 'Successful' : t.status}
                  onPress={() => navigation.getParent()?.navigate('TransactionsTab', { screen: 'TransactionDetail', params: { transactionId: t.id } } as any)}
                />
              );
            })}
      </NeumorphCard>

      <SectionHeader title="People" subtitle="Tap to pay or view details" />
      {contacts.slice(6, 18).map((c) => (
        <View key={c.id} style={{ paddingHorizontal: 16 }}>
          <ListRow
            leading={<Avatar name={c.name} color={c.color} size={42} />}
            title={c.name}
            subtitle={`${c.upi} • ${c.bank}`}
            badge={contactTagLabels[c.tag]}
            badgeColor={contactTagColors[c.tag]}
            onPress={() => onContact(c.id)}
          />
        </View>
      ))}

      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <GradientButton title="Send money" gradient="primary" size="lg" fullWidth onPress={() => onContact(contacts[0].id)} iconLeft={<Text style={{ color: '#fff', fontSize: 16 }}>⚡</Text>} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  iconBtnText: { fontSize: 18 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  heroAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 6, letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  heroBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  heroChips: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 14 },
  qaRow: { paddingHorizontal: 16, gap: 12 },
  contactsRow: { paddingHorizontal: 16, gap: 14 },
  contactCard: { width: 64, alignItems: 'center' },
  contactName: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  contactBank: { fontSize: 10, marginTop: 2 },
  groupCard: { padding: 14, width: 200, borderRadius: 18, gap: 4 },
  groupEmoji: { fontSize: 26 },
  groupName: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  groupTotal: { fontSize: 11, marginTop: 2 },
  groupOutstanding: { fontSize: 12, fontWeight: '700', marginTop: 4 },
});
