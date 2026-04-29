import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeProvider';
import {
  Screen,
  Header,
  GradientCard,
  NeumorphCard,
  ListRow,
  SectionHeader,
  GradientButton,
  Chip,
  AmountInput,
  NumericKeypad,
  PressableScale,
  StatPill,
} from '@components/index';
import { findMutualFund, mutualFunds } from '@data/investments';
import { formatCompactINR, formatINR, generateUtr } from '@utils/format';
import { useSuccessHaptic } from '@hooks/useHaptics';
import { PinFlow } from '../home/PinScreen';
import type { InvestStackScreenProps } from '@navigation/types';

const categories = ['All', 'Equity', 'Debt', 'Hybrid', 'Index', 'ELSS', 'International'] as const;
type Category = typeof categories[number];

export function MutualFundsScreen({ navigation }: InvestStackScreenProps<'MutualFunds'>) {
  const theme = useTheme();
  const [cat, setCat] = useState<Category>('All');
  const list = useMemo(() => (cat === 'All' ? mutualFunds : mutualFunds.filter((f) => f.category === cat)), [cat]);
  const top = [...mutualFunds].sort((a, b) => b.oneYearChangePct - a.oneYearChangePct).slice(0, 3);

  return (
    <Screen>
      <Header title="Mutual Funds" subtitle="1000+ funds • 0 commission" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Start investing</Text>
          <Text style={styles.heroAmount}>SIP from ₹100/month</Text>
          <Text style={styles.heroSub}>Direct plans • Instant onboarding • Paperless</Text>
        </GradientCard>
      </View>

      <SectionHeader title="Top performers (1Y)" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {top.map((f) => (
          <PressableScale key={f.id} haptic="light" onPress={() => navigation.navigate('MutualFundDetail', { fundId: f.id })} style={{ width: 240 }}>
            <NeumorphCard style={{ padding: 14 }}>
              <Text numberOfLines={2} style={{ color: theme.colors.text, fontWeight: '800' }}>{f.name}</Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 4 }}>{f.category} • {f.riskLevel}</Text>
              <Text style={{ color: theme.colors.success, fontSize: 22, fontWeight: '800', marginTop: 8 }}>{f.oneYearChangePct.toFixed(1)}%</Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>1Y return</Text>
            </NeumorphCard>
          </PressableScale>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {categories.map((c) => (
          <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} size="sm" />
        ))}
      </View>

      <NeumorphCard style={{ marginHorizontal: 16, marginTop: 12, paddingVertical: 4 }}>
        {list.slice(0, 20).map((f, i) => (
          <ListRow
            key={f.id}
            leading={<Text style={{ fontSize: 22 }}>📈</Text>}
            title={f.name}
            subtitle={`${f.category} • ${f.subCategory} • ⭐${f.rating}`}
            rightTitle={`${f.oneYearChangePct.toFixed(1)}%`}
            rightTitleColor={f.oneYearChangePct >= 0 ? theme.colors.success : theme.colors.danger}
            rightSubtitle="1Y"
            onPress={() => navigation.navigate('MutualFundDetail', { fundId: f.id })}
            divider={i < Math.min(list.length, 20) - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function MutualFundDetailScreen({ route, navigation }: InvestStackScreenProps<'MutualFundDetail'>) {
  const theme = useTheme();
  const f = findMutualFund(route.params.fundId);
  if (!f) {
    return (
      <Screen>
        <Header title="Fund" />
        <View style={{ padding: 16 }}>
          <Text style={{ color: theme.colors.textMuted }}>Fund not found.</Text>
        </View>
      </Screen>
    );
  }
  return (
    <Screen>
      <Header title={f.name} subtitle={`${f.fundHouse} • ${f.category}`} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>NAV</Text>
          <Text style={styles.heroAmount}>₹{f.nav.toFixed(2)}</Text>
          <Text style={styles.heroSub}>{f.oneDayChangePct >= 0 ? '▲' : '▼'} {f.oneDayChangePct.toFixed(2)}% today • AUM {formatCompactINR(f.aum * 1e7)}</Text>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <StatPill label="1Y" value={`${f.oneYearChangePct.toFixed(1)}%`} trend={f.oneYearChangePct >= 0 ? 'up' : 'down'} trendValue="return" />
          <StatPill label="3Y CAGR" value={`${f.threeYearCagr.toFixed(1)}%`} trend="up" trendValue="annualised" />
          <StatPill label="5Y CAGR" value={`${f.fiveYearCagr.toFixed(1)}%`} trend="up" trendValue="annualised" />
        </View>
      </View>

      <SectionHeader title="Details" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Risk" rightTitle={f.riskLevel} />
        <ListRow title="Rating" rightTitle={`⭐ ${f.rating}/5`} />
        <ListRow title="Expense ratio" rightTitle={`${f.expenseRatio}%`} />
        <ListRow title="Exit load" rightTitle={f.exitLoad} />
        <ListRow title="Benchmark" rightTitle={f.benchmark} />
        <ListRow title="Fund manager" rightTitle={f.fundManager} />
        <ListRow title="Min SIP" rightTitle={formatINR(f.minSip, { maximumFractionDigits: 0 })} />
        <ListRow title="Min lumpsum" rightTitle={formatINR(f.minLumpsum, { maximumFractionDigits: 0 })} divider={false} />
      </NeumorphCard>

      <SectionHeader title="About" />
      <NeumorphCard style={{ marginHorizontal: 16, padding: 16 }}>
        <Text style={{ color: theme.colors.text, lineHeight: 20 }}>{f.description}</Text>
      </NeumorphCard>

      <SectionHeader title="Top holdings" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {f.topHoldings.map((h, i) => (
          <ListRow key={h.name} title={h.name} rightTitle={`${h.weight.toFixed(1)}%`} onPress={() => navigation.navigate('Watchlist')} divider={i < f.topHoldings.length - 1} />
        ))}
      </NeumorphCard>

      <View style={{ padding: 16, gap: 8 }}>
        <GradientButton title={`Start SIP from ₹${f.minSip}`} gradient="primary" size="lg" fullWidth onPress={() => navigation.navigate('StartSip', { fundId: f.id })} />
        <GradientButton title={`Invest lumpsum (min ₹${f.minLumpsum})`} variant="outline" size="md" onPress={() => navigation.navigate('StartSip', { fundId: f.id })} />
      </View>
    </Screen>
  );
}

export function StartSipScreen({ route, navigation }: InvestStackScreenProps<'StartSip'>) {
  const theme = useTheme();
  const f = findMutualFund(route.params.fundId);
  const [amount, setAmount] = useState(f ? String(f.minSip * 5) : '1000');
  const [date, setDate] = useState<5 | 10 | 15 | 20 | 25>(5);

  if (!f) return <Screen><Header title="SIP" /></Screen>;
  const n = Number(amount || 0);

  return (
    <Screen scroll={false}>
      <Header title="Start SIP" subtitle={f.name} />
      <View style={{ flex: 1, padding: 16 }}>
        <NeumorphCard style={{ padding: 18 }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, textTransform: 'uppercase', fontWeight: '800', letterSpacing: 0.6 }}>Monthly amount</Text>
          <AmountInput amount={n} fontSize={44} />
          <Text style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 4 }}>Min ₹{f.minSip}/month</Text>
        </NeumorphCard>

        <NeumorphCard style={{ marginTop: 12, padding: 16 }}>
          <Text style={{ color: theme.colors.text, fontWeight: '700', marginBottom: 8 }}>SIP date</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {([5, 10, 15, 20, 25] as const).map((d) => (
              <Chip key={d} label={`${d}th`} active={d === date} onPress={() => setDate(d)} size="sm" />
            ))}
          </View>
        </NeumorphCard>

        <NeumorphCard style={{ marginTop: 12, paddingVertical: 4 }}>
          <ListRow title="Fund" rightTitle={f.fundHouse} />
          <ListRow title="Category" rightTitle={f.category} />
          <ListRow title="Duration" rightTitle="Until cancelled" />
          <ListRow title="Projected 5Y" rightTitle={formatINR(n * 12 * 5 * (1 + f.fiveYearCagr / 100), { maximumFractionDigits: 0 })} rightTitleColor={theme.colors.success} divider={false} />
        </NeumorphCard>

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <NumericKeypad value={amount} onChange={setAmount} maxLength={7} showSubmit submitLabel={`Start SIP ${formatINR(n, { maximumFractionDigits: 0 })}`} submitDisabled={n < f.minSip} onSubmit={() => navigation.navigate('SipPayment', { fundId: f.id, amount: n })} />
        </View>
      </View>
    </Screen>
  );
}

export function SipPaymentScreen({ route, navigation }: InvestStackScreenProps<'SipPayment'>) {
  const f = findMutualFund(route.params.fundId);
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Review SIP" subtitle={f?.name} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Monthly SIP</Text>
          <Text style={styles.heroAmount}>{formatINR(route.params.amount, { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.heroSub}>UPI AutoPay • Debited on 5th of every month</Text>
        </GradientCard>
      </View>
      <SectionHeader title="Mandate" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Source" rightTitle="HDFC ••1234" onPress={() => {}} />
        <ListRow title="Scheme" rightTitle={f?.name ?? '—'} />
        <ListRow title="Plan" rightTitle="Direct Growth" />
        <ListRow title="Validity" rightTitle="Until cancelled" divider={false} />
      </NeumorphCard>
      <View style={{ padding: 16 }}>
        <GradientButton title={`Confirm ${formatINR(route.params.amount, { maximumFractionDigits: 0 })}/month`} gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('SipPin', { fundId: route.params.fundId, amount: route.params.amount })} />
        <Text style={{ color: theme.colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 }}>You can pause or cancel anytime from Portfolio.</Text>
      </View>
    </Screen>
  );
}

export function SipPinScreen({ route, navigation }: InvestStackScreenProps<'SipPin'>) {
  return (
    <PinFlow
      amount={route.params.amount}
      title="Confirm SIP mandate"
      subtitle="UPI AutoPay authorisation"
      onSuccess={(transactionId) => navigation.replace('SipSuccess', { fundId: route.params.fundId, amount: route.params.amount, transactionId })}
    />
  );
}

export function SipSuccessScreen({ route, navigation }: InvestStackScreenProps<'SipSuccess'>) {
  const theme = useTheme();
  const f = findMutualFund(route.params.fundId);
  const success = useSuccessHaptic();
  const scale = useSharedValue(0.6);
  const utr = useMemo(() => generateUtr(), []);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
    success();
  }, [scale, success]);
  const tickStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Screen>
      <Header showBack={false} title="" />
      <View style={{ padding: 16, alignItems: 'center', gap: 6 }}>
        <Animated.Text style={[styles.tick, tickStyle]}>📈</Animated.Text>
        <Text style={[styles.successTitle, { color: theme.colors.text }]}>SIP started</Text>
        <Text style={{ color: theme.colors.textMuted }}>{f?.name}</Text>
        <AmountInput amount={route.params.amount} fontSize={44} />
        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4, alignSelf: 'stretch' }}>
          <ListRow title="Transaction" rightTitle={route.params.transactionId.toUpperCase()} />
          <ListRow title="UTR" rightTitle={utr} />
          <ListRow title="Mandate" rightTitle="UPI AutoPay" />
          <ListRow title="Next debit" rightTitle="5th next month" divider={false} />
        </NeumorphCard>
        <View style={{ width: '100%', marginTop: 18, gap: 8 }}>
          <GradientButton title="View portfolio" gradient="invest" size="lg" fullWidth onPress={() => navigation.replace('Portfolio')} />
          <GradientButton title="Invest in another fund" variant="outline" size="md" onPress={() => navigation.replace('MutualFunds')} />
          <GradientButton title="Done" variant="ghost" size="md" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  tick: { fontSize: 84, marginTop: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', marginTop: 8 },
});
