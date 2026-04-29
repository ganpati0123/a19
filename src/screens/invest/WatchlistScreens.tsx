import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useTheme } from '@theme/ThemeProvider';
import {
  Screen,
  Header,
  GradientCard,
  NeumorphCard,
  ListRow,
  SectionHeader,
  GradientButton,
  StatPill,
} from '@components/index';
import { watchlist } from '@data/investments';
import type { InvestStackScreenProps } from '@navigation/types';

function makeSeries(base: number, points = 60): number[] {
  const arr: number[] = [];
  let p = base;
  for (let i = 0; i < points; i += 1) {
    p += (Math.random() - 0.48) * base * 0.01;
    arr.push(p);
  }
  return arr;
}

function Sparkline({ values, color, height = 180 }: { values: number[]; color: string; height?: number }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = 320;
  const step = width / Math.max(1, values.length - 1);
  const points = values.map((v, i) => `${(i * step).toFixed(2)},${(height - ((v - min) / Math.max(1, max - min)) * (height - 20) - 10).toFixed(2)}`).join(' ');
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

export function WatchlistScreen({ navigation }: InvestStackScreenProps<'Watchlist'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Watchlist" subtitle="Track markets you care about" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="ocean" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Markets today</Text>
          <Text style={styles.heroAmount}>NIFTY {watchlist[0]?.value.toLocaleString('en-IN')}</Text>
          <Text style={styles.heroSub}>{watchlist[0]?.change >= 0 ? '▲' : '▼'} {watchlist[0]?.change.toFixed(2)}% • Real-time snapshot</Text>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <StatPill label="Gainers" value={String(watchlist.filter((w) => w.change >= 0).length)} trend="up" trendValue={`${watchlist.length}`} caption="on watchlist" />
          <StatPill label="Losers" value={String(watchlist.filter((w) => w.change < 0).length)} trend="down" trendValue="vs open" />
          <StatPill label="Symbols" value={String(watchlist.length)} trend="flat" />
        </View>
      </View>

      <SectionHeader title="Your symbols" actionLabel="Add" onAction={() => {}} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {watchlist.map((w, i) => (
          <ListRow
            key={w.symbol}
            leading={<Text style={{ fontSize: 22 }}>📊</Text>}
            title={w.symbol}
            subtitle={w.value.toLocaleString('en-IN')}
            rightTitle={`${w.change >= 0 ? '+' : ''}${w.change.toFixed(2)}%`}
            rightTitleColor={w.change >= 0 ? theme.colors.success : theme.colors.danger}
            onPress={() => navigation.navigate('WatchlistDetail', { symbol: w.symbol })}
            divider={i < watchlist.length - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function WatchlistDetailScreen({ route, navigation }: InvestStackScreenProps<'WatchlistDetail'>) {
  const theme = useTheme();
  const w = watchlist.find((x) => x.symbol === route.params.symbol);
  const series = React.useMemo(() => makeSeries(w?.value ?? 100), [w?.value]);
  if (!w) return <Screen><Header title={route.params.symbol} /></Screen>;
  return (
    <Screen>
      <Header title={w.symbol} subtitle={w.value.toLocaleString('en-IN')} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient={w.change >= 0 ? 'forest' : 'fire'} radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Price</Text>
          <Text style={styles.heroAmount}>{w.value.toLocaleString('en-IN')}</Text>
          <Text style={styles.heroSub}>{w.change >= 0 ? '▲' : '▼'} {w.change.toFixed(2)}% today</Text>
          <View style={{ marginTop: 14, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 8 }}>
            <Sparkline values={series} color="#fff" />
          </View>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <StatPill label="Open" value={series[0]?.toFixed(2) ?? '—'} />
          <StatPill label="High" value={Math.max(...series).toFixed(2)} trend="up" trendValue="intraday" />
          <StatPill label="Low" value={Math.min(...series).toFixed(2)} trend="down" trendValue="intraday" />
        </View>
      </View>

      <SectionHeader title="About" />
      <NeumorphCard style={{ marginHorizontal: 16, padding: 16 }}>
        <Text style={{ color: theme.colors.text, lineHeight: 20 }}>
          {w.symbol} is a benchmark index/commodity tracked on PayX. PayX lets you invest indirectly via mutual funds or gold, with one-tap execution and full transparency.
        </Text>
      </NeumorphCard>

      <View style={{ padding: 16, gap: 8 }}>
        <GradientButton title="Invest via mutual funds" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('MutualFunds')} />
        <GradientButton title="Remove from watchlist" variant="outline" size="md" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
});
