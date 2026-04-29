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
  GradientButton,
  StatPill,
} from '@components/index';
import { investmentGoals } from '@data/investments';
import { formatCompactINR, formatINR, formatDate } from '@utils/format';
import type { InvestStackScreenProps } from '@navigation/types';

export function GoalsScreen({ navigation }: InvestStackScreenProps<'Goals'>) {
  const theme = useTheme();
  const totalTarget = investmentGoals.reduce((a, g) => a + g.targetAmount, 0);
  const totalSaved = investmentGoals.reduce((a, g) => a + g.savedAmount, 0);
  const totalMonthly = investmentGoals.reduce((a, g) => a + g.monthlyContribution, 0);
  return (
    <Screen>
      <Header title="Goals" subtitle="Save with purpose" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="forest" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Saved toward goals</Text>
          <Text style={styles.heroAmount}>{formatINR(totalSaved, { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.heroSub}>Of {formatINR(totalTarget, { maximumFractionDigits: 0 })} across {investmentGoals.length} goals</Text>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <StatPill label="Total saved" value={formatCompactINR(totalSaved)} trend="up" trendValue={`${((totalSaved / totalTarget) * 100).toFixed(0)}%`} caption="of target" />
          <StatPill label="Monthly" value={formatCompactINR(totalMonthly)} trend="flat" trendValue="—" caption="SIP + deposits" />
          <StatPill label="Goals" value={String(investmentGoals.length)} trend="up" trendValue="+1" caption="this year" />
        </View>
      </View>

      <SectionHeader title="Your goals" actionLabel="Add new" onAction={() => navigation.navigate('MutualFunds')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {investmentGoals.map((g, i) => {
          const pct = Math.min(100, (g.savedAmount / g.targetAmount) * 100);
          return (
            <ListRow
              key={g.id}
              leading={<Text style={{ fontSize: 24 }}>{g.emoji}</Text>}
              title={g.title}
              subtitle={`${formatCompactINR(g.savedAmount)} / ${formatCompactINR(g.targetAmount)} • ${pct.toFixed(0)}%`}
              rightTitle={`${formatCompactINR(g.monthlyContribution)}/mo`}
              rightSubtitle={g.riskProfile}
              rightTitleColor={theme.colors.primary}
              onPress={() => navigation.navigate('GoalDetail', { goalId: g.id })}
              divider={i < investmentGoals.length - 1}
            />
          );
        })}
      </NeumorphCard>

      <View style={{ padding: 16 }}>
        <GradientButton title="Create new goal" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('MutualFunds')} />
      </View>
    </Screen>
  );
}

export function GoalDetailScreen({ route, navigation }: InvestStackScreenProps<'GoalDetail'>) {
  const theme = useTheme();
  const g = investmentGoals.find((x) => x.id === route.params.goalId);
  if (!g) return <Screen><Header title="Goal" /></Screen>;
  const pct = Math.min(100, (g.savedAmount / g.targetAmount) * 100);
  const remaining = Math.max(0, g.targetAmount - g.savedAmount);
  const monthsLeft = Math.ceil((g.targetDate - Date.now()) / (30 * 24 * 60 * 60 * 1000));
  return (
    <Screen>
      <Header title={`${g.emoji}  ${g.title}`} subtitle={`${g.category} • ${g.riskProfile}`} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="forest" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Progress</Text>
          <Text style={styles.heroAmount}>{pct.toFixed(0)}%</Text>
          <Text style={styles.heroSub}>{formatINR(g.savedAmount, { maximumFractionDigits: 0 })} of {formatINR(g.targetAmount, { maximumFractionDigits: 0 })}</Text>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 14 }}>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: '#fff', width: `${pct}%` }} />
          </View>
        </GradientCard>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <StatPill label="Saved" value={formatCompactINR(g.savedAmount)} trend="up" trendValue={`${pct.toFixed(0)}%`} />
          <StatPill label="Remaining" value={formatCompactINR(remaining)} trend="flat" trendValue={`${monthsLeft} mo`} />
          <StatPill label="Target date" value={formatDate(g.targetDate)} />
        </View>
      </View>
      <SectionHeader title="Plan" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Monthly SIP" rightTitle={formatINR(g.monthlyContribution, { maximumFractionDigits: 0 })} rightTitleColor={theme.colors.success} onPress={() => navigation.navigate('MutualFunds')} />
        <ListRow title="Risk profile" rightTitle={g.riskProfile} onPress={() => {}} />
        <ListRow title="Projected reach" rightTitle={formatDate(g.targetDate)} onPress={() => {}} />
        <ListRow title="Linked funds" rightTitle="3 funds" onPress={() => navigation.navigate('MutualFunds')} divider={false} />
      </NeumorphCard>
      <View style={{ padding: 16, gap: 8 }}>
        <GradientButton title="Contribute now" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('MutualFunds')} />
        <GradientButton title="Edit plan" variant="outline" size="md" onPress={() => {}} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
});
