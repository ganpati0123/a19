import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  PressableScale,
  Chip,
  EmptyState,
} from '@components/index';
import { goldRate, initialGoldHoldings, mutualFunds, portfolioSnapshot } from '@data/investments';
import { formatCompactINR, formatINR, formatDate } from '@utils/format';
import type { InvestStackScreenProps } from '@navigation/types';

// A small synthesised view of the user's portfolio.
const ownedFundIds = ['mf_0_0', 'mf_1_0', 'mf_4_1', 'mf_6_2'];

interface FundHolding {
  id: string;
  name: string;
  units: number;
  nav: number;
  invested: number;
  current: number;
  category: string;
}

function useFundHoldings(): FundHolding[] {
  return ownedFundIds
    .map((id, idx) => {
      const f = mutualFunds.find((x) => x.id === id);
      if (!f) return null;
      const units = 200 + idx * 48;
      const invested = Math.round(f.nav * units * 0.82);
      const current = Math.round(f.nav * units);
      return { id: f.id, name: f.name, units, nav: f.nav, invested, current, category: f.category };
    })
    .filter(Boolean) as FundHolding[];
}

export function PortfolioScreen({ navigation }: InvestStackScreenProps<'Portfolio'>) {
  const funds = useFundHoldings();
  const theme = useTheme();
  const goldGrams = initialGoldHoldings.reduce((a, h) => a + h.grams, 0);
  const goldValue = goldGrams * goldRate.pricePerGram24k;

  return (
    <Screen>
      <Header title="Portfolio" subtitle="All your investments" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="invest" radius={24} style={{ padding: 20 }}>
          <Text style={styles.kicker}>Net worth</Text>
          <Text style={styles.heroAmount}>{formatINR(portfolioSnapshot.currentValue, { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.heroSub}>
            Invested {formatINR(portfolioSnapshot.totalInvested, { maximumFractionDigits: 0 })} • Return {formatCompactINR(portfolioSnapshot.totalReturn)} ({((portfolioSnapshot.totalReturn / portfolioSnapshot.totalInvested) * 100).toFixed(1)}%)
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <Chip label={`XIRR ${portfolioSnapshot.xirr.toFixed(1)}%`} active />
            <Chip label={`Today ${portfolioSnapshot.todayReturnPct.toFixed(2)}%`} />
          </View>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <StatPill label="Equity" value={formatCompactINR(portfolioSnapshot.currentValue * 0.58)} trend="up" trendValue="1.2%" caption="58% of total" />
          <StatPill label="Debt" value={formatCompactINR(portfolioSnapshot.currentValue * 0.18)} trend="flat" trendValue="0.1%" caption="18%" />
          <StatPill label="Gold" value={formatCompactINR(goldValue)} trend="up" trendValue={`${goldRate.changePercent.toFixed(2)}%`} caption={`${goldGrams.toFixed(2)}g`} />
        </View>
      </View>

      <SectionHeader title="Mutual fund holdings" actionLabel="Add more" onAction={() => navigation.navigate('MutualFunds')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {funds.map((f, i) => {
          const pnl = f.current - f.invested;
          return (
            <ListRow
              key={f.id}
              leading={<Text style={{ fontSize: 22 }}>📈</Text>}
              title={f.name}
              subtitle={`${f.units} units • ${f.category}`}
              rightTitle={formatINR(f.current, { maximumFractionDigits: 0 })}
              rightSubtitle={`${pnl >= 0 ? '+' : ''}${((pnl / f.invested) * 100).toFixed(1)}%`}
              rightTitleColor={pnl >= 0 ? theme.colors.success : theme.colors.danger}
              onPress={() => navigation.navigate('HoldingDetail', { holdingId: f.id })}
              divider={i < funds.length - 1}
            />
          );
        })}
      </NeumorphCard>

      <SectionHeader title="Gold" actionLabel="Buy more" onAction={() => navigation.navigate('BuyGold')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {initialGoldHoldings.map((h, i) => (
          <ListRow
            key={h.id}
            leading={<Text style={{ fontSize: 22 }}>🪙</Text>}
            title={`${h.grams.toFixed(3)} g • ${h.vault}`}
            subtitle={`Purchased ${formatDate(h.purchaseAt)} • Avg ₹${h.averagePrice.toFixed(0)}`}
            rightTitle={formatINR(h.grams * goldRate.pricePerGram24k, { maximumFractionDigits: 0 })}
            rightSubtitle={`${(((h.grams * goldRate.pricePerGram24k - h.grams * h.averagePrice) / (h.grams * h.averagePrice)) * 100).toFixed(2)}%`}
            onPress={() => navigation.navigate('HoldingDetail', { holdingId: h.id })}
            divider={i < initialGoldHoldings.length - 1}
          />
        ))}
      </NeumorphCard>

      <SectionHeader title="Allocation" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Large cap equity" subtitle="4 funds" rightTitle="38%" onPress={() => navigation.navigate('MutualFunds')} />
        <ListRow title="Mid & small cap" subtitle="2 funds" rightTitle="20%" onPress={() => navigation.navigate('MutualFunds')} />
        <ListRow title="Debt & liquid" subtitle="1 fund" rightTitle="18%" onPress={() => navigation.navigate('MutualFunds')} />
        <ListRow title="International" subtitle="1 fund" rightTitle="6%" onPress={() => navigation.navigate('MutualFunds')} />
        <ListRow title="Gold" subtitle={`${goldGrams.toFixed(2)} g`} rightTitle="12%" onPress={() => navigation.navigate('Gold')} />
        <ListRow title="Cash" subtitle="Wallet & bank" rightTitle="6%" onPress={() => {}} divider={false} />
      </NeumorphCard>

      {funds.length === 0 && (
        <EmptyState emoji="📊" title="Start investing" subtitle="Pick your first fund or buy digital gold" actionLabel="Explore funds" onAction={() => navigation.navigate('MutualFunds')} />
      )}

      <View style={{ padding: 16, gap: 8 }}>
        <GradientButton title="Start a new SIP" gradient="primary" size="lg" fullWidth onPress={() => navigation.navigate('MutualFunds')} />
        <PressableScale haptic="light" onPress={() => navigation.navigate('Goals')}>
          <GradientCard gradient="forest" radius={20} style={{ padding: 18 }}>
            <Text style={styles.kicker}>Goals</Text>
            <Text style={styles.heroAmount}>Track what matters</Text>
            <Text style={styles.heroSub}>Link investments to life goals like home, travel, retirement.</Text>
          </GradientCard>
        </PressableScale>
      </View>

    </Screen>
  );
}

export function HoldingDetailScreen({ route, navigation }: InvestStackScreenProps<'HoldingDetail'>) {
  const theme = useTheme();
  const id = route.params.holdingId;
  const fund = mutualFunds.find((f) => f.id === id);
  const gold = initialGoldHoldings.find((h) => h.id === id);

  if (fund) {
    const units = 200;
    const invested = Math.round(fund.nav * units * 0.82);
    const current = Math.round(fund.nav * units);
    const pnl = current - invested;
    return (
      <Screen>
        <Header title={fund.name} subtitle={`${fund.category} • ${fund.fundHouse}`} />
        <View style={{ paddingHorizontal: 16 }}>
          <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
            <Text style={styles.kicker}>Current value</Text>
            <Text style={styles.heroAmount}>{formatINR(current, { maximumFractionDigits: 0 })}</Text>
            <Text style={styles.heroSub}>
              P&L {pnl >= 0 ? '+' : ''}{formatINR(pnl, { maximumFractionDigits: 0 })} • {((pnl / invested) * 100).toFixed(2)}%
            </Text>
          </GradientCard>
        </View>

        <SectionHeader title="Your holding" />
        <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
          <ListRow title="Units" rightTitle={String(units)} />
          <ListRow title="Average NAV" rightTitle={`₹${(invested / units).toFixed(2)}`} />
          <ListRow title="Current NAV" rightTitle={`₹${fund.nav.toFixed(2)}`} rightSubtitle={`${fund.oneDayChangePct >= 0 ? '+' : ''}${fund.oneDayChangePct.toFixed(2)}%`} />
          <ListRow title="Invested" rightTitle={formatINR(invested, { maximumFractionDigits: 0 })} />
          <ListRow title="XIRR" rightTitle={`${fund.threeYearCagr.toFixed(1)}%`} rightTitleColor={theme.colors.success} divider={false} />
        </NeumorphCard>

        <SectionHeader title="Fund actions" />
        <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
          <ListRow title="Start new SIP" subtitle={`From ₹${fund.minSip}/month`} rightTitle="Go" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('StartSip', { fundId: fund.id })} />
          <ListRow title="Invest lumpsum" subtitle={`Min ₹${fund.minLumpsum}`} rightTitle="Go" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('StartSip', { fundId: fund.id })} />
          <ListRow title="View fund details" rightTitle="→" onPress={() => navigation.navigate('MutualFundDetail', { fundId: fund.id })} divider={false} />
        </NeumorphCard>

        <View style={{ padding: 16 }}>
          <GradientButton title="Buy more units" gradient="primary" size="lg" fullWidth onPress={() => navigation.navigate('StartSip', { fundId: fund.id })} />
        </View>
      </Screen>
    );
  }

  if (gold) {
    const current = gold.grams * goldRate.pricePerGram24k;
    const invested = gold.grams * gold.averagePrice;
    const pnl = current - invested;
    return (
      <Screen>
        <Header title={`${gold.grams.toFixed(3)} g gold`} subtitle={gold.vault} />
        <View style={{ paddingHorizontal: 16 }}>
          <GradientCard gradient="gold" radius={22} style={{ padding: 18 }}>
            <Text style={styles.kicker}>Current value</Text>
            <Text style={styles.heroAmount}>{formatINR(current, { maximumFractionDigits: 0 })}</Text>
            <Text style={styles.heroSub}>{pnl >= 0 ? '+' : ''}{formatINR(pnl, { maximumFractionDigits: 0 })} ({((pnl / invested) * 100).toFixed(2)}%)</Text>
          </GradientCard>
        </View>
        <SectionHeader title="Holding" />
        <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
          <ListRow title="Grams" rightTitle={`${gold.grams.toFixed(4)} g`} />
          <ListRow title="Avg price" rightTitle={`₹${gold.averagePrice.toFixed(2)}/g`} />
          <ListRow title="Current price" rightTitle={`₹${goldRate.pricePerGram24k.toFixed(2)}/g`} />
          <ListRow title="Invested" rightTitle={formatINR(invested, { maximumFractionDigits: 0 })} />
          <ListRow title="Certificate" rightTitle={gold.certificateNo} />
          <ListRow title="Vault" rightTitle={gold.vault} divider={false} />
        </NeumorphCard>
        <View style={{ padding: 16, gap: 8 }}>
          <GradientButton title="Buy more gold" gradient="gold" size="lg" fullWidth onPress={() => navigation.navigate('BuyGold')} />
          <GradientButton title="Sell this holding" gradient="paymentDanger" variant="outline" size="md" onPress={() => navigation.navigate('SellGold')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Holding" />
      <EmptyState emoji="📭" title="Holding not found" subtitle="We couldn't find this investment in your portfolio." actionLabel="Go to portfolio" onAction={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
});
