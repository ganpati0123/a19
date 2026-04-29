import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, Avatar, Chip, GradientButton, NeumorphCard, NumericKeypad, AmountInput } from '@components/index';
import { findContact } from '@data/contacts';
import { formatINR } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

const PRESETS = [100, 200, 500, 1000, 2000, 5000];

export function EnterAmountScreen({ route, navigation }: HomeStackScreenProps<'EnterAmount'>) {
  const theme = useTheme();
  const c = findContact(route.params.contactId);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const numeric = parseFloat(amount || '0');

  if (!c) return <Screen><Header title="Pay" /></Screen>;

  return (
    <Screen scroll={false}>
      <Header title={`Pay ${c.name.split(' ')[0]}`} subtitle={c.upi} />
      <View style={styles.body}>
        <View style={styles.head}>
          <Avatar name={c.name} color={c.color} size={64} />
          <Text style={[styles.name, { color: theme.colors.text }]}>{c.name}</Text>
          <Text style={[styles.bank, { color: theme.colors.textMuted }]}>{c.bank} • {c.upi}</Text>
        </View>

        <AmountInput amount={numeric} fontSize={64} showCursor />

        <View style={styles.presets}>
          {PRESETS.map((p) => (
            <Chip key={p} label={formatINR(p, { maximumFractionDigits: 0 })} onPress={() => setAmount(String(p))} />
          ))}
        </View>

        <View style={styles.noteRow}>
          <NeumorphCard style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={[styles.noteLabel, { color: theme.colors.textMuted }]}>Add a note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Dinner split"
              placeholderTextColor={theme.colors.placeholder}
              style={{ color: theme.colors.text, paddingVertical: 4, fontSize: 14 }}
            />
          </NeumorphCard>
        </View>

        <View style={styles.keypadWrap}>
          <NumericKeypad value={amount} onChange={setAmount} maxLength={7} showDecimal />
        </View>

        <GradientButton
          title={numeric > 0 ? `Pay ${formatINR(numeric, { maximumFractionDigits: 0 })}` : 'Enter amount to continue'}
          gradient="primary"
          size="lg"
          fullWidth
          disabled={numeric <= 0}
          onPress={() => navigation.navigate('Pin', { contactId: c.id, amount: numeric, note })}
          iconRight={<Text style={{ color: '#fff', fontSize: 18 }}>→</Text>}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, gap: 16 },
  head: { alignItems: 'center', gap: 6 },
  name: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  bank: { fontSize: 12 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  noteRow: { flexDirection: 'row', gap: 8 },
  noteLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  keypadWrap: { flex: 1 },
});
