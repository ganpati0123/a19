import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, Avatar, ListRow, NeumorphCard, GradientButton, AmountInput, NumericKeypad, Chip } from '@components/index';
import { contacts, recentContacts, findContact } from '@data/contacts';
import { formatINR } from '@utils/format';
import Toast from 'react-native-toast-message';
import type { HomeStackScreenProps } from '@navigation/types';

export function RequestMoneyScreen({ navigation }: HomeStackScreenProps<'RequestMoney'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Request money" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {recentContacts.slice(0, 12).map((c, i) => (
          <ListRow
            key={c.id}
            leading={<Avatar name={c.name} color={c.color} size={42} />}
            title={c.name}
            subtitle={`${c.upi} • ${c.bank}`}
            onPress={() => navigation.navigate('RequestMoneyAmount', { contactId: c.id })}
            divider={i < 11}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function RequestMoneyAmountScreen({ route, navigation }: HomeStackScreenProps<'RequestMoneyAmount'>) {
  const theme = useTheme();
  const c = findContact(route.params.contactId);
  const [amount, setAmount] = useState('');
  const numeric = parseFloat(amount || '0');
  if (!c) return <Screen><Header title="Request" /></Screen>;
  return (
    <Screen scroll={false}>
      <Header title={`Request from ${c.name.split(' ')[0]}`} subtitle={c.upi} />
      <View style={{ padding: 16, flex: 1 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Avatar name={c.name} color={c.color} size={64} />
          <Text style={{ fontWeight: '800', fontSize: 18, color: theme.colors.text }}>{c.name}</Text>
        </View>
        <View style={{ marginVertical: 18 }}>
          <AmountInput amount={numeric} fontSize={56} showCursor />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[200, 500, 1000, 2000].map((p) => (
            <Chip key={p} label={formatINR(p, { maximumFractionDigits: 0 })} onPress={() => setAmount(String(p))} />
          ))}
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <NumericKeypad value={amount} onChange={setAmount} maxLength={7} />
          <View style={{ height: 12 }} />
          <GradientButton title={numeric > 0 ? `Request ${formatINR(numeric, { maximumFractionDigits: 0 })}` : 'Enter amount'} gradient="primary" fullWidth size="lg" disabled={numeric <= 0} onPress={() => navigation.navigate('RequestMoneyConfirm', { contactId: c.id, amount: numeric })} />
        </View>
      </View>
    </Screen>
  );
}

export function RequestMoneyConfirmScreen({ route, navigation }: HomeStackScreenProps<'RequestMoneyConfirm'>) {
  const theme = useTheme();
  const c = findContact(route.params.contactId);
  return (
    <Screen>
      <Header title="Confirm request" />
      <View style={{ padding: 16, alignItems: 'center', gap: 8 }}>
        <Avatar name={c?.name ?? '?'} color={c?.color} size={84} />
        <Text style={{ fontSize: 16, color: theme.colors.textMuted }}>You're requesting</Text>
        <AmountInput amount={route.params.amount} fontSize={48} />
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>from {c?.name ?? 'recipient'}</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <NeumorphCard style={{ paddingVertical: 4 }}>
          <ListRow title="UPI handle" rightTitle={c?.upi ?? '—'} />
          <ListRow title="Bank" rightTitle={c?.bank ?? '—'} />
          <ListRow title="Note" rightTitle="Add note" onPress={() => {}} divider={false} />
        </NeumorphCard>
        <View style={{ marginTop: 18, gap: 10 }}>
          <GradientButton title="Send request" gradient="primary" fullWidth size="lg" onPress={() => { Toast.show({ type: 'success', text1: 'Request sent', text2: `${c?.name ?? 'Contact'} will get a push notification` }); navigation.popToTop(); }} />
          <GradientButton title="Cancel" variant="ghost" fullWidth size="md" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </Screen>
  );
}
