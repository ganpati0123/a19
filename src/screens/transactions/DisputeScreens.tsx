import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, ListRow, NeumorphCard, GradientCard, SectionHeader } from '@components/index';
import { findTransaction, disputeReasons } from '@data/transactions';
import Toast from 'react-native-toast-message';
import type { TxStackScreenProps } from '@navigation/types';

export function DisputeScreen({ route, navigation }: TxStackScreenProps<'Dispute'>) {
  const theme = useTheme();
  const t = findTransaction(route.params.transactionId);
  return (
    <Screen>
      <Header title="Raise dispute" subtitle={t?.merchantName ?? t?.upiHandle} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="paymentDanger" radius={22} style={{ padding: 18 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>Most disputes resolve in</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 }}>48 – 72 hours</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 }}>You will receive SMS + email updates at every step.</Text>
        </GradientCard>
      </View>
      <SectionHeader title="What happened?" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {disputeReasons.map((r, i) => (
          <ListRow key={r.id} leading={<Text style={{ fontSize: 22 }}>{r.icon}</Text>} title={r.label} onPress={() => navigation.navigate('DisputeReason', { transactionId: route.params.transactionId, reasonId: r.id })} divider={i < disputeReasons.length - 1} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function DisputeReasonScreen({ route, navigation }: TxStackScreenProps<'DisputeReason'>) {
  const theme = useTheme();
  const reason = disputeReasons.find((r) => r.id === route.params.reasonId);
  const [desc, setDesc] = useState('');
  return (
    <Screen>
      <Header title={reason?.label ?? 'Reason'} />
      <View style={{ paddingHorizontal: 16 }}>
        <NeumorphCard style={{ padding: 14 }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>Describe in your own words</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            multiline
            placeholder="What went wrong? Include date, vendor, expected outcome…"
            placeholderTextColor={theme.colors.placeholder}
            style={{ color: theme.colors.text, minHeight: 120, textAlignVertical: 'top', fontSize: 14 }}
          />
        </NeumorphCard>
        <NeumorphCard style={{ marginTop: 14, paddingVertical: 4 }}>
          <ListRow title="Attach screenshot" onPress={() => {}} />
          <ListRow title="Attach receipt" onPress={() => {}} />
          <ListRow title="Refund preference" rightTitle="To source" onPress={() => {}} divider={false} />
        </NeumorphCard>
        <View style={{ marginTop: 18 }}>
          <GradientButton title="Submit ticket" gradient="primary" fullWidth size="lg" disabled={desc.trim().length < 10} onPress={() => navigation.navigate('DisputeConfirm', { transactionId: route.params.transactionId, reasonId: route.params.reasonId, description: desc })} />
        </View>
      </View>
    </Screen>
  );
}

export function DisputeConfirmScreen({ route, navigation }: TxStackScreenProps<'DisputeConfirm'>) {
  const theme = useTheme();
  const reason = disputeReasons.find((r) => r.id === route.params.reasonId);
  return (
    <Screen>
      <Header title="Ticket created" />
      <View style={{ padding: 16, alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 64 }}>🧾</Text>
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800', marginTop: 8 }}>Ticket #DPX-{route.params.transactionId.slice(-6).toUpperCase()}</Text>
        <Text style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 4 }}>{reason?.label} • You will get updates on email & SMS.</Text>
        <NeumorphCard style={{ alignSelf: 'stretch', marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Status" rightTitle="Submitted" />
          <ListRow title="ETA" rightTitle="48-72 hrs" />
          <ListRow title="Manager" rightTitle="Aisha (PayX)" divider={false} />
        </NeumorphCard>
        <View style={{ width: '100%', marginTop: 18, gap: 10 }}>
          <GradientButton title="Track ticket" gradient="primary" fullWidth size="lg" onPress={() => { Toast.show({ type: 'info', text1: 'Tracking opened' }); navigation.popToTop(); }} />
          <GradientButton title="Done" variant="ghost" fullWidth size="md" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}
