import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, ListRow, NeumorphCard, Chip, GradientCard, SectionHeader } from '@components/index';
import Toast from 'react-native-toast-message';
import type { TxStackScreenProps } from '@navigation/types';

export function StatementScreen({ navigation, route }: TxStackScreenProps<'DownloadStatement'>) {
  const theme = useTheme();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'fy'>('30d');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');

  return (
    <Screen>
      <Header title="Download statement" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="paymentInfo" radius={22} style={{ padding: 18 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>Quick statement</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{period.toUpperCase()} • {format.toUpperCase()}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 }}>Statements are encrypted and password protected with the last 4 digits of your account.</Text>
        </GradientCard>

        <SectionHeader title="Period" />
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {(['7d', '30d', '90d', 'fy'] as const).map((p) => <Chip key={p} label={p.toUpperCase()} active={period === p} onPress={() => setPeriod(p)} />)}
        </View>

        <SectionHeader title="Format" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['pdf', 'csv', 'excel'] as const).map((f) => <Chip key={f} label={f.toUpperCase()} active={format === f} onPress={() => setFormat(f)} />)}
        </View>

        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Email to me" subtitle="ganpati@payx" onPress={() => Toast.show({ type: 'success', text1: 'Statement queued', text2: 'Email will arrive in ~2 mins' })} />
          <ListRow title="Save to device" onPress={() => Toast.show({ type: 'success', text1: 'PDF saved', text2: 'Files → PayX' })} />
          <ListRow title="Share via WhatsApp" onPress={() => navigation.getParent()?.navigate('HomeTab', { screen: 'ShareReceipt', params: { transactionId: route.params.transactionId ?? 'all' } } as any)} divider={false} />
        </NeumorphCard>

        <View style={{ marginTop: 18 }}>
          <GradientButton title="Download" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('StatementOptions', { format })} />
        </View>
      </View>
    </Screen>
  );
}

export function StatementOptionsScreen({ route, navigation }: TxStackScreenProps<'StatementOptions'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title={`${route.params.format.toUpperCase()} options`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Include category breakdown" rightTitle="On" onPress={() => {}} />
        <ListRow title="Include cashback summary" rightTitle="On" onPress={() => {}} />
        <ListRow title="Mask account numbers" rightTitle="On" onPress={() => {}} />
        <ListRow title="Password protect" rightTitle="••4321" onPress={() => {}} divider={false} />
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <GradientButton title="Generate now" gradient="primary" fullWidth size="lg" onPress={() => { Toast.show({ type: 'success', text1: 'Statement generated' }); navigation.popToTop(); }} />
      </View>
    </Screen>
  );
}
