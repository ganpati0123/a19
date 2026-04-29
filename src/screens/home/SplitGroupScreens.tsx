import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, GradientButton, ListRow, NeumorphCard, Avatar, SectionHeader } from '@components/index';
import { contacts, splitGroups } from '@data/contacts';
import { formatCompactINR, formatINR } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

export function SplitGroupsScreen({ navigation }: HomeStackScreenProps<'SplitGroups'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Split groups" subtitle="Track shared expenses" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {splitGroups.map((g, i) => (
          <ListRow
            key={g.id}
            leading={<Text style={{ fontSize: 28 }}>{g.emoji}</Text>}
            title={g.name}
            subtitle={`${g.memberIds.length} members • Total ${formatCompactINR(g.totalSpent)}`}
            rightTitle={g.outstanding < 0 ? `Owed ${formatINR(-g.outstanding)}` : g.outstanding > 0 ? `Owe ${formatINR(g.outstanding)}` : 'Settled'}
            rightTitleColor={g.outstanding < 0 ? theme.colors.success : g.outstanding > 0 ? theme.colors.danger : theme.colors.textMuted}
            onPress={() => navigation.navigate('SplitGroupDetail', { groupId: g.id })}
            divider={i < splitGroups.length - 1}
          />
        ))}
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <GradientButton title="+ New group" gradient="primary" fullWidth size="lg" onPress={() => {}} />
      </View>
    </Screen>
  );
}

export function SplitGroupDetailScreen({ route, navigation }: HomeStackScreenProps<'SplitGroupDetail'>) {
  const theme = useTheme();
  const g = splitGroups.find((x) => x.id === route.params.groupId) ?? splitGroups[0];
  const members = g.memberIds.map((id) => contacts.find((c) => c.id === id)).filter(Boolean);
  return (
    <Screen>
      <Header title={g.name} subtitle={`${members.length} members`} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>{g.emoji}  Group balance</Text>
          <Text style={styles.amount}>{formatINR(g.totalSpent)}</Text>
          <Text style={styles.sub}>Your share: {formatINR(g.yourShare)} • {g.outstanding < 0 ? `You're owed ${formatINR(-g.outstanding)}` : g.outstanding > 0 ? `You owe ${formatINR(g.outstanding)}` : 'All settled'}</Text>
        </GradientCard>
      </View>
      <SectionHeader title="Members" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {members.map((c, i) => c ? (
          <ListRow
            key={c.id}
            leading={<Avatar name={c.name} color={c.color} size={42} />}
            title={c.name}
            subtitle={c.upi}
            rightTitle={i % 2 === 0 ? `Owes ${formatINR(420 + i * 80)}` : `Settled`}
            rightTitleColor={i % 2 === 0 ? theme.colors.danger : theme.colors.textMuted}
            onPress={() => navigation.navigate('SplitMemberDetail', { groupId: g.id, contactId: c.id })}
            divider={i < members.length - 1}
          />
        ) : null)}
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18, gap: 10 }}>
        <GradientButton title="Add expense" gradient="primary" fullWidth size="lg" onPress={() => {}} />
        <GradientButton title="Settle up" variant="outline" fullWidth size="md" onPress={() => {}} />
      </View>
    </Screen>
  );
}

export function SplitMemberDetailScreen({ route }: HomeStackScreenProps<'SplitMemberDetail'>) {
  const theme = useTheme();
  const c = contacts.find((cc) => cc.id === route.params.contactId);
  return (
    <Screen>
      <Header title={c?.name ?? 'Member'} subtitle="Group breakdown" />
      <View style={{ padding: 16 }}>
        <NeumorphCard style={{ paddingVertical: 4 }}>
          <ListRow title="Total paid" rightTitle="₹4,200" />
          <ListRow title="Total share" rightTitle="₹3,440" />
          <ListRow title="Balance" rightTitle="-₹760" rightTitleColor={theme.colors.danger} />
          <ListRow title="Last expense" rightTitle="2 days ago" divider={false} />
        </NeumorphCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  amount: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 6 },
});
