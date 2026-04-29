import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import { useTheme } from '@theme/ThemeProvider';
import {
  Screen,
  Header,
  GradientCard,
  NeumorphCard,
  GradientButton,
  ListRow,
  AmountInput,
  NumericKeypad,
  Chip,
  SectionHeader,
  PressableScale,
  StatPill,
} from '@components/index';
import { goldHistory, goldRate, initialGoldHoldings } from '@data/investments';
import { formatCompactINR, formatINR, generateUtr, shortId } from '@utils/format';
import { useSuccessHaptic } from '@hooks/useHaptics';
import { PinFlow } from '../home/PinScreen';
import type { InvestStackScreenProps } from '@navigation/types';

type Range = keyof typeof goldHistory;
const ranges: Range[] = ['1d', '1w', '1m', '6m', '1y', '5y'];

function SparkChart({ range, color, height = 200 }: { range: Range; color: string; height?: number }) {
  const points = goldHistory[range];
  const values = points.map((p) => p.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = 320;
  const step = width / Math.max(1, points.length - 1);
  const polyline = points
    .map((p, i) => `${(i * step).toFixed(2)},${(height - ((p.price - min) / Math.max(1, max - min)) * (height - 20) - 10).toFixed(2)}`)
    .join(' ');
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={polyline} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

export function GoldScreen({ navigation }: InvestStackScreenProps<'Gold'>) {
  const theme = useTheme();
  const totalGrams = initialGoldHoldings.reduce((a, h) => a + h.grams, 0);
  const totalInvested = initialGoldHoldings.reduce((a, h) => a + h.grams * h.averagePrice, 0);
  const currentValue = totalGrams * goldRate.pricePerGram24k;
  const change = currentValue - totalInvested;

  return (
    <Screen>
      <Header title="Digital Gold" subtitle="99.99% pure • Insured" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="gold" radius={22} style={{ padding: 20 }}>
          <Text style={styles.kicker}>Today's rate</Text>
          <Text style={styles.heroAmount}>₹{goldRate.pricePerGram24k.toFixed(2)}/g</Text>
          <Text style={styles.heroSub}>
            {goldRate.changePercent >= 0 ? '▲' : '▼'} ₹{goldRate.changeAmount.toFixed(2)} ({goldRate.changePercent.toFixed(2)}%) today
          </Text>
          <View style={styles.row}>
            <GradientButton title="Buy" gradient="paymentSuccess" size="sm" onPress={() => navigation.navigate('BuyGold')} />
            <GradientButton title="Sell" gradient="paymentDanger" size="sm" onPress={() => navigation.navigate('SellGold')} />
            <GradientButton title="Chart" variant="outline" size="sm" onPress={() => navigation.navigate('GoldChart')} />
          </View>
        </GradientCard>
      </View>

      <SectionHeader title="Your gold" subtitle={`${totalGrams.toFixed(3)} g across ${initialGoldHoldings.length} purchases`} />
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 10 }}>
        <StatPill label="Current value" value={formatCompactINR(currentValue)} trend={change >= 0 ? 'up' : 'down'} trendValue={formatCompactINR(change)} caption="Unrealised" />
        <StatPill label="Invested" value={formatCompactINR(totalInvested)} caption={`${totalGrams.toFixed(3)} g`} />
      </View>

      <SectionHeader title="Holdings" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {initialGoldHoldings.map((h, i) => (
          <ListRow
            key={h.id}
            leading={<Text style={{ fontSize: 22 }}>🪙</Text>}
            title={`${h.grams.toFixed(3)} g • ${h.vault}`}
            subtitle={`Avg ₹${h.averagePrice.toFixed(0)}/g • Cert ${h.certificateNo}`}
            rightTitle={formatINR(h.grams * goldRate.pricePerGram24k, { maximumFractionDigits: 0 })}
            rightSubtitle="Current"
            onPress={() => navigation.navigate('HoldingDetail', { holdingId: h.id })}
            divider={i < initialGoldHoldings.length - 1}
          />
        ))}
      </NeumorphCard>

      <SectionHeader title="Other metals" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow leading={<Text style={{ fontSize: 22 }}>🥈</Text>} title="Silver 24k" subtitle={`₹${goldRate.silverPerGram.toFixed(2)}/g`} rightTitle="Buy" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('BuyGold')} />
        <ListRow leading={<Text style={{ fontSize: 22 }}>🏅</Text>} title="22k gold" subtitle={`₹${goldRate.pricePerGram22k.toFixed(2)}/g`} rightTitle="Buy" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('BuyGold')} />
        <ListRow leading={<Text style={{ fontSize: 22 }}>🎖️</Text>} title="18k gold" subtitle={`₹${goldRate.pricePerGram18k.toFixed(2)}/g`} rightTitle="Buy" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('BuyGold')} divider={false} />
      </NeumorphCard>

      <SectionHeader title="Why PayX gold?" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow leading={<Text style={{ fontSize: 22 }}>🛡️</Text>} title="Insured & secure" subtitle="Stored in Brinks vaults" />
        <ListRow leading={<Text style={{ fontSize: 22 }}>📦</Text>} title="Home delivery" subtitle="Coins & bars after 2 g" />
        <ListRow leading={<Text style={{ fontSize: 22 }}>⚡</Text>} title="Instant liquidity" subtitle="Sell anytime at live rates" divider={false} />
      </NeumorphCard>
    </Screen>
  );
}

export function GoldChartScreen({ navigation }: InvestStackScreenProps<'GoldChart'>) {
  const theme = useTheme();
  const [range, setRange] = useState<Range>('1m');
  const points = goldHistory[range];
  const first = points[0]?.price ?? 0;
  const last = points[points.length - 1]?.price ?? 0;
  const pct = first ? ((last - first) / first) * 100 : 0;

  return (
    <Screen>
      <Header title="Gold price" subtitle="Historical rates" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="gold" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>{range.toUpperCase()} • Close</Text>
          <Text style={styles.heroAmount}>₹{last.toFixed(2)}/g</Text>
          <Text style={styles.heroSub}>{pct >= 0 ? '▲' : '▼'} {pct.toFixed(2)}% over period</Text>
          <View style={{ marginTop: 12, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 10 }}>
            <SparkChart range={range} color="#fff" />
          </View>
        </GradientCard>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {ranges.map((r) => (
          <Chip key={r} label={r.toUpperCase()} active={range === r} onPress={() => setRange(r)} size="sm" />
        ))}
      </View>

      <SectionHeader title="Insights" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="52-week high" rightTitle={`₹${Math.max(...goldHistory['1y'].map((p) => p.price)).toFixed(2)}`} onPress={() => navigation.navigate('BuyGold')} />
        <ListRow title="52-week low" rightTitle={`₹${Math.min(...goldHistory['1y'].map((p) => p.price)).toFixed(2)}`} onPress={() => navigation.navigate('BuyGold')} />
        <ListRow title="1 month change" rightTitle={`${(((goldHistory['1m'][goldHistory['1m'].length - 1].price - goldHistory['1m'][0].price) / goldHistory['1m'][0].price) * 100).toFixed(2)}%`} rightTitleColor={theme.colors.success} onPress={() => navigation.navigate('BuyGold')} />
        <ListRow title="5 year CAGR" rightTitle="~11.4%" rightTitleColor={theme.colors.success} onPress={() => navigation.navigate('BuyGold')} divider={false} />
      </NeumorphCard>

      <View style={{ padding: 16 }}>
        <GradientButton title="Buy gold" gradient="gold" fullWidth size="lg" onPress={() => navigation.navigate('BuyGold')} />
      </View>
    </Screen>
  );
}

function GoldAmountFlow({ mode, navigation }: { mode: 'buy' | 'sell'; navigation: InvestStackScreenProps<'BuyGold'>['navigation'] | InvestStackScreenProps<'SellGold'>['navigation'] }) {
  const theme = useTheme();
  const [mode2, setMode2] = useState<'inr' | 'grams'>('inr');
  const [value, setValue] = useState('');
  const price = goldRate.pricePerGram24k;

  const inr = mode2 === 'inr' ? Number(value || 0) : Number(value || 0) * price;
  const grams = mode2 === 'grams' ? Number(value || 0) : Number(value || 0) / price;
  const tax = Math.round(inr * 0.03);
  const total = Math.round(inr + tax);
  const submit = () => {
    if (inr <= 0) return;
    navigation.navigate('GoldPayment', { amount: total, grams: Number(grams.toFixed(4)) });
  };

  return (
    <Screen scroll={false}>
      <Header title={mode === 'buy' ? 'Buy Gold' : 'Sell Gold'} subtitle={`Live @ ₹${price.toFixed(2)}/g`} />
      <View style={{ flex: 1, padding: 16 }}>
        <NeumorphCard style={{ padding: 18 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <Chip label="₹ Amount" active={mode2 === 'inr'} onPress={() => { setMode2('inr'); setValue(''); }} />
            <Chip label="Grams" active={mode2 === 'grams'} onPress={() => { setMode2('grams'); setValue(''); }} />
          </View>
          <AmountInput amount={Number(value || 0)} currency={mode2 === 'inr' ? '₹' : ''} fontSize={44} />
          <Text style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 4 }}>
            {mode2 === 'inr' ? `≈ ${grams.toFixed(4)} g` : `≈ ${formatINR(inr, { maximumFractionDigits: 0 })}`}
          </Text>
        </NeumorphCard>

        <NeumorphCard style={{ marginTop: 12, paddingVertical: 4 }}>
          <ListRow title="Gold value" rightTitle={formatINR(inr, { maximumFractionDigits: 0 })} />
          <ListRow title="GST (3%)" rightTitle={formatINR(tax, { maximumFractionDigits: 0 })} />
          <ListRow title="Total" rightTitle={formatINR(total, { maximumFractionDigits: 0 })} emphasis="strong" divider={false} />
        </NeumorphCard>

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <NumericKeypad value={value} onChange={setValue} maxLength={10} showDecimal={mode2 === 'grams'} showSubmit submitLabel={mode === 'buy' ? `Buy ${formatINR(total, { maximumFractionDigits: 0 })}` : `Sell ${formatINR(total, { maximumFractionDigits: 0 })}`} submitDisabled={inr <= 0} onSubmit={submit} />
        </View>
      </View>
    </Screen>
  );
}

export function BuyGoldScreen({ navigation }: InvestStackScreenProps<'BuyGold'>) {
  return <GoldAmountFlow mode="buy" navigation={navigation} />;
}

export function SellGoldScreen({ navigation }: InvestStackScreenProps<'SellGold'>) {
  return <GoldAmountFlow mode="sell" navigation={navigation} />;
}

export function GoldPaymentScreen({ route, navigation }: InvestStackScreenProps<'GoldPayment'>) {
  const theme = useTheme();
  const [method, setMethod] = useState<'upi' | 'wallet' | 'netbanking' | 'card'>('upi');
  return (
    <Screen>
      <Header title="Confirm purchase" subtitle={`${route.params.grams.toFixed(4)} g of 24k gold`} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="gold" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Paying</Text>
          <Text style={styles.heroAmount}>{formatINR(route.params.amount, { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.heroSub}>{route.params.grams.toFixed(4)} g @ ₹{goldRate.pricePerGram24k.toFixed(2)}/g</Text>
        </GradientCard>
      </View>

      <SectionHeader title="Payment method" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {(['upi', 'wallet', 'netbanking', 'card'] as const).map((m, i) => (
          <ListRow
            key={m}
            leading={<Text style={{ fontSize: 22 }}>{m === 'upi' ? '⚡' : m === 'wallet' ? '👛' : m === 'netbanking' ? '🏦' : '💳'}</Text>}
            title={m === 'upi' ? 'UPI • ganpati@payx' : m === 'wallet' ? 'PayX Wallet' : m === 'netbanking' ? 'Net banking' : 'Debit/Credit card'}
            subtitle={m === 'upi' ? 'Instant • no fees' : m === 'wallet' ? 'Balance ₹4,240' : 'All major banks' }
            rightTitle={method === m ? '✓' : ''}
            rightTitleColor={theme.colors.success}
            onPress={() => setMethod(m)}
            divider={i < 3}
          />
        ))}
      </NeumorphCard>

      <SectionHeader title="Summary" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Grams" rightTitle={`${route.params.grams.toFixed(4)} g`} />
        <ListRow title="Rate" rightTitle={`₹${goldRate.pricePerGram24k.toFixed(2)}/g`} />
        <ListRow title="Amount" rightTitle={formatINR(route.params.amount, { maximumFractionDigits: 0 })} emphasis="strong" divider={false} />
      </NeumorphCard>

      <View style={{ padding: 16 }}>
        <GradientButton title={`Pay ${formatINR(route.params.amount, { maximumFractionDigits: 0 })}`} gradient="gold" fullWidth size="lg" onPress={() => navigation.navigate('GoldPin', { amount: route.params.amount, grams: route.params.grams })} />
      </View>
    </Screen>
  );
}

export function GoldPinScreen({ route, navigation }: InvestStackScreenProps<'GoldPin'>) {
  return (
    <PinFlow
      title="Confirm gold payment"
      subtitle={`${route.params.grams.toFixed(4)} g of gold`}
      amount={route.params.amount}
      onSuccess={(transactionId) => navigation.replace('GoldSuccess', { amount: route.params.amount, grams: route.params.grams, transactionId })}
    />
  );
}

export function GoldSuccessScreen({ route, navigation }: InvestStackScreenProps<'GoldSuccess'>) {
  const theme = useTheme();
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
        <Animated.Text style={[styles.tick, tickStyle]}>🪙</Animated.Text>
        <Text style={[styles.successTitle, { color: theme.colors.text }]}>Gold purchased</Text>
        <Text style={{ color: theme.colors.textMuted }}>{route.params.grams.toFixed(4)} g added to your vault</Text>
        <AmountInput amount={route.params.amount} fontSize={44} />
        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4, alignSelf: 'stretch' }}>
          <ListRow title="Transaction" rightTitle={route.params.transactionId.toUpperCase()} />
          <ListRow title="UTR" rightTitle={utr} />
          <ListRow title="Certificate" rightTitle={`PXG-${shortId('', 8)}`} />
          <ListRow title="Vault" rightTitle="PayX Secure" divider={false} />
        </NeumorphCard>
        <View style={{ width: '100%', marginTop: 18, gap: 8 }}>
          <GradientButton title="View portfolio" gradient="invest" size="lg" fullWidth onPress={() => navigation.replace('Portfolio')} />
          <GradientButton title="Buy more" variant="outline" size="md" onPress={() => navigation.replace('BuyGold')} />
          <GradientButton title="Done" variant="ghost" size="md" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', gap: 8, marginTop: 14 },
  tick: { fontSize: 84, marginTop: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', marginTop: 8 },
});

