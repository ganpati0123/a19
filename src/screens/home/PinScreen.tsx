import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, NumericKeypad, PinDots, NeumorphCard, Avatar, AmountInput } from '@components/index';
import { findContact } from '@data/contacts';
import { findMerchant } from '@data/merchants';
import { useHaptics } from '@hooks/useHaptics';
import { sleep } from '@utils/sleep';
import { shortId } from '@utils/format';

export interface PinFlowProps {
  title?: string;
  subtitle?: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
  contactId?: string;
  merchantId?: string;
}

export function PinFlow({ title, subtitle, amount, onSuccess, contactId, merchantId }: PinFlowProps) {
  const theme = useTheme();
  const haptic = useHaptics();
  const [pin, setPin] = useState('');
  const [verifying, setVerifying] = useState(false);
  const c = contactId ? findContact(contactId) : undefined;
  const m = merchantId ? findMerchant(merchantId) : undefined;

  useEffect(() => {
    if (pin.length === 6 && !verifying) {
      setVerifying(true);
      haptic('success');
      sleep(1100).then(() => {
        onSuccess(`tx_${shortId('', 6)}`);
      });
    }
  }, [pin, verifying, haptic, onSuccess]);

  return (
    <Screen scroll={false}>
      <Header title={title ?? 'Enter UPI PIN'} subtitle={subtitle ?? 'Secure payment'} />
      <View style={styles.body}>
        <View style={styles.summary}>
          {c ? <Avatar name={c.name} color={c.color} size={64} /> : null}
          {m ? <Avatar name={m.name} color={m.color} size={64} square /> : null}
          <Text style={[styles.payTo, { color: theme.colors.textMuted }]}>Paying</Text>
          <Text style={[styles.payee, { color: theme.colors.text }]}>{c?.name ?? m?.name ?? '—'}</Text>
          <AmountInput amount={amount} fontSize={48} />
        </View>

        <NeumorphCard style={{ padding: 18, marginTop: 14 }}>
          <Text style={[styles.lock, { color: theme.colors.text }]}>🔒 Enter 6 digit UPI PIN</Text>
          <PinDots length={6} value={pin} />
          <Text style={[styles.warn, { color: theme.colors.textMuted }]}>
            {verifying ? 'Verifying with NPCI…' : 'Never share your PIN. PayX will never ask.'}
          </Text>
        </NeumorphCard>

        <View style={styles.keypadWrap}>
          <NumericKeypad value={pin} onChange={(v) => v.length <= 6 && setPin(v)} maxLength={6} />
        </View>
      </View>
    </Screen>
  );
}

export function PinScreen({ route, navigation }: any) {
  const { contactId, amount } = route.params as { contactId: string; amount: number };
  return (
    <PinFlow
      contactId={contactId}
      amount={amount}
      onSuccess={(transactionId) =>
        navigation.replace('PaymentSuccess', { contactId, amount, transactionId })
      }
    />
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16 },
  summary: { alignItems: 'center', gap: 6 },
  payTo: { fontSize: 12, marginTop: 12, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  payee: { fontSize: 18, fontWeight: '800' },
  lock: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  warn: { fontSize: 11, textAlign: 'center', marginTop: 6 },
  keypadWrap: { flex: 1, justifyContent: 'flex-end', marginTop: 16 },
});
