import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, ListRow, NeumorphCard, GradientButton } from '@components/index';
import { formatINR } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

interface Budget {
  id: string;
  emoji: string;
  category: string;
  spent: number;
  limit: number;
  resetDate: string;
}

export const budgets: Budget[] = [
  { id: 'b1', emoji: '🍱', category: 'Food & Dining', spent: 4280, limit: 6000, resetDate: '1st of every month' },
  { id: 'b2', emoji: '🛒', category: 'Groceries', spent: 3120, limit: 4000, resetDate: '1st of every month' },
  { id: 'b3', emoji: '✈️', category: 'Travel', spent: 1240, limit: 3000, resetDate: '1st of every month' },
  { id: 'b4', emoji: '🛍️', category: 'Shopping', spent: 2890, limit: 2500, resetDate: '1st of every month' },
  { id: 'b5', emoji: '🎬', category: 'Entertainment', spent: 580, limit: 1500, resetDate: '1st of every month' },
  { id: 'b6', emoji: '⛽', category: 'Fuel', spent: 1860, limit: 2400, resetDate: '1st of every month' },
];

export function BudgetsScreen({ navigation }: HomeStackScreenProps<'Budgets'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Budgets" subtitle="Stay on track each month" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {budgets.map((b, i) => {
          const pct = Math.min(1, b.spent / b.limit);
          const over = b.spent > b.limit;
          return (
            <ListRow
              key={b.id}
              leading={<Text style={{ fontSize: 26 }}>{b.emoji}</Text>}
              title={b.category}
              subtitle={`${formatINR(b.spent)} of ${formatINR(b.limit)} • ${Math.round(pct * 100)}%`}
              rightTitle={over ? `+${formatINR(b.spent - b.limit)}` : `${formatINR(b.limit - b.spent)} left`}
              rightTitleColor={over ? theme.colors.danger : theme.colors.success}
              onPress={() => navigation.navigate('BudgetDetail', { budgetId: b.id })}
              divider={i < budgets.length - 1}
            />
          );
        })}
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <GradientButton title="+ New budget" gradient="primary" fullWidth size="lg" onPress={() => {}} />
      </View>
    </Screen>
  );
}

export function BudgetDetailScreen({ route }: HomeStackScreenProps<'BudgetDetail'>) {
  const theme = useTheme();
  const b = budgets.find((x) => x.id === route.params.budgetId) ?? budgets[0];
  const pct = Math.min(1, b.spent / b.limit);
  return (
    <Screen>
      <Header title={`${b.emoji} ${b.category}`} />
      <View style={{ padding: 16 }}>
        <GradientCard gradient={b.spent > b.limit ? 'paymentDanger' : 'forest'} radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>{b.spent > b.limit ? 'Over budget' : `${Math.round(pct * 100)}% used`}</Text>
          <Text style={styles.amount}>{formatINR(b.spent)}</Text>
          <Text style={styles.sub}>of {formatINR(b.limit)} • Resets {b.resetDate}</Text>
        </GradientCard>
        <NeumorphCard style={{ marginTop: 16, paddingVertical: 4 }}>
          <ListRow title="Daily average" rightTitle="₹140" />
          <ListRow title="Most expensive day" rightTitle="₹620 (Sat)" />
          <ListRow title="Top merchant" rightTitle="Zomato" />
          <ListRow title="Recommendation" rightTitle="Reduce by 8%" rightTitleColor={theme.colors.warning} divider={false} />
        </NeumorphCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  amount: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
});
