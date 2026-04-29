import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, NeumorphCard, ListRow, AmountInput } from '@components/index';
import { findMerchant } from '@data/merchants';
import { useSuccessHaptic } from '@hooks/useHaptics';
import { generateUtr } from '@utils/format';
import type { ScanStackScreenProps } from '@navigation/types';

export function ScanSuccessScreen({ route, navigation }: ScanStackScreenProps<'ScanSuccess'>) {
  const theme = useTheme();
  const success = useSuccessHaptic();
  const m = findMerchant(route.params.merchantId);
  const utr = React.useMemo(() => generateUtr(), []);
  const scale = useSharedValue(0.6);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
    success();
  }, [scale, success]);
  const tickStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Screen>
      <Header showBack={false} title="" />
      <View style={{ padding: 16, alignItems: 'center', gap: 6 }}>
        <Animated.Text style={[styles.tick, tickStyle]}>✅</Animated.Text>
        <Text style={[styles.success, { color: theme.colors.text }]}>Payment Successful</Text>
        <Text style={{ color: theme.colors.textMuted }}>Paid to {m?.name ?? 'merchant'}</Text>
        <AmountInput amount={route.params.amount} fontSize={48} />
        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4, alignSelf: 'stretch' }}>
          <ListRow title="Transaction" rightTitle={route.params.transactionId.toUpperCase()} />
          <ListRow title="UTR" rightTitle={utr} />
          <ListRow title="UPI" rightTitle={m?.upi ?? '—'} />
          <ListRow title="Cashback" rightTitle={`₹${Math.round(route.params.amount * 0.02)}`} rightTitleColor={theme.colors.success} divider={false} />
        </NeumorphCard>
        <View style={{ width: '100%', marginTop: 18, gap: 8 }}>
          <GradientButton title="Rate this merchant" gradient="primary" size="lg" fullWidth onPress={() => navigation.replace('MerchantRating', { merchantId: route.params.merchantId, transactionId: route.params.transactionId })} />
          <GradientButton title="View receipt" variant="outline" size="md" onPress={() => navigation.getParent()?.navigate('HomeTab', { screen: 'Receipt', params: { transactionId: route.params.transactionId } } as any)} />
          <GradientButton title="Done" variant="ghost" size="md" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tick: { fontSize: 84, marginTop: 24 },
  success: { fontSize: 22, fontWeight: '800', marginTop: 8 },
});
