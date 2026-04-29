import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, NeumorphCard, ListRow, AmountInput } from '@components/index';
import { findContact } from '@data/contacts';
import { useSuccessHaptic } from '@hooks/useHaptics';
import { formatDateTime, generateUtr } from '@utils/format';
import type { HomeStackScreenProps } from '@navigation/types';

export function PaymentSuccessScreen({ route, navigation }: HomeStackScreenProps<'PaymentSuccess'>) {
  const theme = useTheme();
  const success = useSuccessHaptic();
  const c = findContact(route.params.contactId);
  const utr = React.useMemo(() => generateUtr(), []);

  const scale = useSharedValue(0.6);
  const rotate = useSharedValue(-30);
  useEffect(() => {
    scale.value = withSequence(withSpring(1.15, { damping: 10 }), withSpring(1, { damping: 14 }));
    rotate.value = withTiming(0, { duration: 400 });
    success();
  }, [scale, rotate, success]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Screen>
      <Header title="" showBack={false} />
      <View style={styles.body}>
        <Animated.View style={[styles.tickWrap, checkStyle]}>
          <Text style={styles.tickEmoji}>✅</Text>
        </Animated.View>
        <Text style={[styles.success, { color: theme.colors.text }]}>Payment Successful</Text>
        <Text style={[styles.payee, { color: theme.colors.textMuted }]}>To {c?.name ?? 'Recipient'}</Text>
        <AmountInput amount={route.params.amount} fontSize={48} />
        <Text style={[styles.timestamp, { color: theme.colors.textMuted }]}>{formatDateTime(Date.now())}</Text>

        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Transaction ID" rightTitle={route.params.transactionId.toUpperCase()} />
          <ListRow title="UTR Reference" rightTitle={utr} />
          <ListRow title="Bank" rightTitle={c?.bank ?? 'HDFC Bank'} />
          <ListRow title="UPI" rightTitle={c?.upi ?? '—'} divider={false} />
        </NeumorphCard>

        <View style={styles.actions}>
          <GradientButton title="View Receipt" gradient="primary" size="lg" fullWidth onPress={() => navigation.replace('Receipt', { transactionId: route.params.transactionId })} />
          <GradientButton title="Share" variant="outline" size="md" onPress={() => navigation.navigate('ShareReceipt', { transactionId: route.params.transactionId })} />
          <GradientButton title="Done" variant="ghost" size="md" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, alignItems: 'center', gap: 6 },
  tickWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  tickEmoji: { fontSize: 84 },
  success: { fontSize: 22, fontWeight: '800', marginTop: 12 },
  payee: { fontSize: 13, marginTop: 4 },
  timestamp: { fontSize: 12, marginTop: 8 },
  actions: { width: '100%', marginTop: 22, gap: 8 },
});
