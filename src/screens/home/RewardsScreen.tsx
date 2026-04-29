import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, ListRow, NeumorphCard, SectionHeader, GradientButton, Chip } from '@components/index';
import { formatINR, formatRelative } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

interface Reward {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  expiresAt: number;
  status: 'available' | 'used' | 'expiring';
}

export const rewardsData: Reward[] = [
  { id: 'r1', title: '₹40 cashback — electricity', subtitle: 'From Tata Power bill payment', amount: 40, expiresAt: Date.now() + 28 * 86400000, status: 'available' },
  { id: 'r2', title: '₹100 SIP voucher', subtitle: 'On first ₹2,000 SIP investment', amount: 100, expiresAt: Date.now() + 12 * 86400000, status: 'expiring' },
  { id: 'r3', title: '15% off Domino\'s', subtitle: 'Capped at ₹120, expires Sunday', amount: 120, expiresAt: Date.now() + 4 * 86400000, status: 'expiring' },
  { id: 'r4', title: '₹50 fuel cashback', subtitle: 'Pay at HP, IOC, BPCL via PayX', amount: 50, expiresAt: Date.now() + 60 * 86400000, status: 'available' },
  { id: 'r5', title: '₹30 movie cashback (used)', subtitle: 'Applied to PVR ticket booking', amount: 30, expiresAt: Date.now() - 2 * 86400000, status: 'used' },
];

export function RewardsScreen({ navigation }: HomeStackScreenProps<'Rewards'>) {
  const theme = useTheme();
  const wallet = 274.5;
  return (
    <Screen>
      <Header title="Rewards" subtitle="Cashback & vouchers" />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <GradientCard gradient="gold" radius={22} style={{ padding: 20 }}>
          <Text style={styles.kicker}>Cashback wallet</Text>
          <Text style={styles.amount}>{formatINR(wallet)}</Text>
          <Text style={styles.sub}>Use this on any bill, recharge or merchant payment.</Text>
          <View style={styles.row}>
            <GradientButton title="Use now" variant="ghost" textStyle={{ color: '#fff' }} onPress={() => navigation.getParent()?.navigate('BillsTab')} />
            <Chip label="₹120 expires soon" color="#fff" />
          </View>
        </GradientCard>
      </View>
      <SectionHeader title="All rewards" subtitle={`${rewardsData.length} this season`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {rewardsData.map((r, i) => (
          <ListRow
            key={r.id}
            title={r.title}
            subtitle={`${r.subtitle} • Expires ${formatRelative(r.expiresAt)}`}
            rightTitle={formatINR(r.amount)}
            rightTitleColor={r.status === 'used' ? theme.colors.textMuted : theme.colors.success}
            badge={r.status === 'expiring' ? 'Expiring' : r.status === 'used' ? 'Used' : undefined}
            badgeColor={r.status === 'expiring' ? theme.colors.warning : theme.colors.textMuted}
            onPress={() => navigation.navigate('RewardDetail', { rewardId: r.id })}
            divider={i < rewardsData.length - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function RewardDetailScreen({ route }: HomeStackScreenProps<'RewardDetail'>) {
  const theme = useTheme();
  const r = rewardsData.find((x) => x.id === route.params.rewardId) ?? rewardsData[0];
  return (
    <Screen>
      <Header title="Reward details" />
      <View style={{ padding: 16 }}>
        <GradientCard gradient="gold" radius={22} style={{ padding: 20, alignItems: 'center' }}>
          <Text style={styles.kicker}>{r.title.toUpperCase()}</Text>
          <Text style={[styles.amount, { fontSize: 38 }]}>{formatINR(r.amount)}</Text>
          <Text style={styles.sub}>{r.subtitle}</Text>
        </GradientCard>
        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Status" rightTitle={r.status} rightTitleColor={r.status === 'used' ? theme.colors.textMuted : theme.colors.success} />
          <ListRow title="Expires" rightTitle={formatRelative(r.expiresAt)} />
          <ListRow title="Min. transaction" rightTitle="₹100" />
          <ListRow title="Maximum savings" rightTitle={formatINR(r.amount)} />
          <ListRow title="Where to use" rightTitle="All categories" divider={false} />
        </NeumorphCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  amount: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
});
