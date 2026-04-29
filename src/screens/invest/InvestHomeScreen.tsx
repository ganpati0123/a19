import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import {
  Screen,
  Header,
  GradientCard,
  NeumorphCard,
  ListRow,
  SectionHeader,
  StatPill,
  GradientButton,
  QuickActionTile,
  PressableScale,
  Chip,
} from '@components/index';
import {
  goldRate,
  insurancePolicies,
  investmentGoals,
  mutualFunds,
  portfolioSnapshot,
  watchlist,
} from '@data/investments';
import { formatCompactINR, formatINR } from '@utils/format';
import type { InvestStackScreenProps } from '@navigation/types';

export function InvestHomeScreen({ navigation }: InvestStackScreenProps<'InvestHome'>) {
  const theme = useTheme();

  const topFunds = mutualFunds.slice(0, 4);
  const featuredPolicies = insurancePolicies.slice(0, 3);
  const quickTiles = [
    { emoji: '🪙', label: 'Gold', gradient: 'gold' as const, onPress: () => navigation.navigate('Gold') },
    { emoji: '📈', label: 'Mutual funds', gradient: 'primary' as const, onPress: () => navigation.navigate('MutualFunds') },
    { emoji: '🛡️', label: 'Insurance', gradient: 'ocean' as const, onPress: () => navigation.navigate('Insurance') },
    { emoji: '🎯', label: 'Goals', gradient: 'forest' as const, onPress: () => navigation.navigate('Goals') },
    { emoji: '👀', label: 'Watchlist', gradient: 'candy' as const, onPress: () => navigation.navigate('Watchlist') },
    { emoji: '💼', label: 'Portfolio', gradient: 'invest' as const, onPress: () => navigation.navigate('Portfolio') },
  ];

  return (
    <Screen>
      <Header showBack={false} title="Invest" subtitle="Grow wealth, every day" />
      <View style={{ paddingHorizontal: 16 }}>
        <PressableScale onPress={() => navigation.navigate('Portfolio')} haptic="medium">
          <GradientCard gradient="invest" radius={24} style={{ padding: 20 }}>
            <Text style={styles.kicker}>Total portfolio</Text>
            <Text style={styles.heroAmount}>{formatINR(portfolioSnapshot.currentValue, { maximumFractionDigits: 0 })}</Text>
            <Text style={styles.heroSub}>
              Invested {formatINR(portfolioSnapshot.totalInvested, { maximumFractionDigits: 0 })} • XIRR {portfolioSnapshot.xirr.toFixed(1)}%
            </Text>
            <View style={styles.heroChips}>
              <Chip label={`Return ${formatCompactINR(portfolioSnapshot.totalReturn)}`} icon="▲" active />
              <Chip label={`Today ${portfolioSnapshot.todayReturnPct.toFixed(2)}%`} icon="▲" />
            </View>
          </GradientCard>
        </PressableScale>

        <View style={styles.stats}>
          <StatPill label="Current value" value={formatCompactINR(portfolioSnapshot.currentValue)} trend="up" trendValue={`${portfolioSnapshot.xirr.toFixed(1)}%`} caption="XIRR" />
          <StatPill label="Total return" value={formatCompactINR(portfolioSnapshot.totalReturn)} trend="up" trendValue={`${((portfolioSnapshot.totalReturn / portfolioSnapshot.totalInvested) * 100).toFixed(1)}%`} caption="lifetime" />
          <StatPill label="Today" value={formatCompactINR(portfolioSnapshot.todayReturn)} trend={portfolioSnapshot.todayReturn >= 0 ? 'up' : 'down'} trendValue={`${portfolioSnapshot.todayReturnPct.toFixed(2)}%`} caption="vs yesterday" />
        </View>
      </View>

      <SectionHeader title="Quick invest" subtitle="Tap to open" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tiles}>
        {quickTiles.map((t) => (
          <QuickActionTile key={t.label} emoji={t.emoji} label={t.label} gradient={t.gradient} onPress={t.onPress} />
        ))}
      </ScrollView>

      <SectionHeader title="Digital gold" subtitle={`24K @ ₹${goldRate.pricePerGram24k.toFixed(2)}/g`} actionLabel="Buy gold" onAction={() => navigation.navigate('BuyGold')} />
      <View style={{ paddingHorizontal: 16 }}>
        <PressableScale haptic="light" onPress={() => navigation.navigate('Gold')}>
          <GradientCard gradient="gold" radius={22} style={{ padding: 18 }}>
            <Text style={styles.goldKicker}>Today's rate</Text>
            <Text style={styles.goldAmount}>₹{goldRate.pricePerGram24k.toFixed(2)}</Text>
            <Text style={styles.goldSub}>
              {goldRate.changePercent >= 0 ? '▲' : '▼'} {goldRate.changeAmount.toFixed(2)} ({goldRate.changePercent.toFixed(2)}%) today
            </Text>
            <View style={styles.goldRow}>
              <GradientButton title="Buy" gradient="paymentSuccess" size="sm" onPress={() => navigation.navigate('BuyGold')} />
              <GradientButton title="Sell" gradient="paymentDanger" size="sm" onPress={() => navigation.navigate('SellGold')} />
              <GradientButton title="Chart" variant="outline" size="sm" onPress={() => navigation.navigate('GoldChart')} />
            </View>
          </GradientCard>
        </PressableScale>
      </View>

      <SectionHeader title="Top mutual funds" actionLabel="See all" onAction={() => navigation.navigate('MutualFunds')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {topFunds.map((f, i) => (
          <ListRow
            key={f.id}
            leading={<Text style={{ fontSize: 22 }}>📈</Text>}
            title={f.name}
            subtitle={`${f.category} • ${f.riskLevel} risk`}
            rightTitle={`${f.oneYearChangePct.toFixed(1)}%`}
            rightTitleColor={f.oneYearChangePct >= 0 ? theme.colors.success : theme.colors.danger}
            rightSubtitle="1Y return"
            onPress={() => navigation.navigate('MutualFundDetail', { fundId: f.id })}
            divider={i < topFunds.length - 1}
          />
        ))}
      </NeumorphCard>

      <SectionHeader title="Recommended insurance" actionLabel="See all" onAction={() => navigation.navigate('Insurance')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {featuredPolicies.map((p) => (
          <PressableScale key={p.id} onPress={() => navigation.navigate('InsuranceDetail', { policyId: p.id })} haptic="light" style={{ width: 240 }}>
            <GradientCard gradient={{ colors: p.gradient, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }} radius={20} style={{ padding: 16, minHeight: 140 }}>
              <Text style={styles.insKicker}>{p.type} • {p.provider}</Text>
              <Text style={styles.insTitle} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.insSub}>Cover {formatCompactINR(p.coverAmount)}</Text>
              <Text style={styles.insPremium}>₹{p.premium.toLocaleString('en-IN')}/yr</Text>
            </GradientCard>
          </PressableScale>
        ))}
      </ScrollView>

      <SectionHeader title="Your goals" actionLabel="Manage" onAction={() => navigation.navigate('Goals')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {investmentGoals.slice(0, 3).map((g, i) => {
          const pct = Math.min(100, (g.savedAmount / g.targetAmount) * 100);
          return (
            <ListRow
              key={g.id}
              leading={<Text style={{ fontSize: 22 }}>{g.emoji}</Text>}
              title={g.title}
              subtitle={`${formatCompactINR(g.savedAmount)} of ${formatCompactINR(g.targetAmount)} • ${pct.toFixed(0)}%`}
              rightTitle={`${formatCompactINR(g.monthlyContribution)}/mo`}
              rightSubtitle={g.riskProfile}
              onPress={() => navigation.navigate('GoalDetail', { goalId: g.id })}
              divider={i < 2}
            />
          );
        })}
      </NeumorphCard>

      <SectionHeader title="Markets" actionLabel="All" onAction={() => navigation.navigate('Watchlist')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {watchlist.slice(0, 4).map((w, i) => (
          <ListRow
            key={w.symbol}
            leading={<Text style={{ fontSize: 20 }}>📊</Text>}
            title={w.symbol}
            subtitle={w.value.toLocaleString('en-IN')}
            rightTitle={`${w.change >= 0 ? '+' : ''}${w.change.toFixed(2)}%`}
            rightTitleColor={w.change >= 0 ? theme.colors.success : theme.colors.danger}
            onPress={() => navigation.navigate('WatchlistDetail', { symbol: w.symbol })}
            divider={i < 3}
          />
        ))}
      </NeumorphCard>

      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <GradientButton title="View full portfolio" gradient="primary" size="lg" fullWidth onPress={() => navigation.navigate('Portfolio')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 6, letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  heroChips: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  tiles: { paddingHorizontal: 16, gap: 12 },
  goldKicker: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  goldAmount: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 6 },
  goldSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  goldRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  insKicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  insTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 6 },
  insSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 8 },
  insPremium: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 6 },
});
