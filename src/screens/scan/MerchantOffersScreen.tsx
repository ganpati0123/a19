import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, ListRow, NeumorphCard, GradientButton } from '@components/index';
import { findMerchant } from '@data/merchants';
import { formatRelative } from '@utils/format';
import type { ScanStackScreenProps } from '@navigation/types';

export function MerchantOffersScreen({ route, navigation }: ScanStackScreenProps<'MerchantOffers'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  if (!m) return <Screen><Header title="Offers" /></Screen>;
  return (
    <Screen>
      <Header title={`${m.name} offers`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {m.deals.map((d, i) => (
          <ListRow key={d.id} leading={<Text style={{ fontSize: 24 }}>🎁</Text>} title={d.title} subtitle={d.subtitle} rightTitle={`${d.expiresInDays}d left`} rightTitleColor={theme.colors.warning} onPress={() => navigation.navigate('MerchantOfferDetail', { merchantId: m.id, offerId: d.id })} divider={i < m.deals.length - 1} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function MerchantOfferDetailScreen({ route, navigation }: ScanStackScreenProps<'MerchantOfferDetail'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  const d = m?.deals.find((x) => x.id === route.params.offerId);
  if (!m || !d) return <Screen><Header title="Offer" /></Screen>;
  return (
    <Screen>
      <Header title="Offer" subtitle={m.name} />
      <View style={{ padding: 16 }}>
        <GradientCard gradient="gold" radius={22} style={{ padding: 20 }}>
          <Text style={styles.kicker}>{d.expiresInDays}d LEFT</Text>
          <Text style={styles.title}>{d.title}</Text>
          <Text style={styles.sub}>{d.subtitle}</Text>
        </GradientCard>
        <NeumorphCard style={{ marginTop: 16, paddingVertical: 4 }}>
          <ListRow title="Valid till" rightTitle={`${d.expiresInDays} days`} />
          <ListRow title="Applicable on" rightTitle="UPI / Wallet / Card" />
          <ListRow title="One per user" rightTitle="Yes" divider={false} />
        </NeumorphCard>
        <View style={{ marginTop: 18 }}>
          <GradientButton title="Apply & pay" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('ScanAmount', { merchantId: m.id })} />
        </View>
      </View>
    </Screen>
  );
}

export function MerchantReviewsScreen({ route, navigation }: ScanStackScreenProps<'MerchantReviews'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  if (!m) return <Screen><Header title="Reviews" /></Screen>;
  return (
    <Screen>
      <Header title={`${m.name} reviews`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {m.reviews.map((r, i) => (
          <ListRow key={r.id} title={`${r.author} • ⭐ ${r.stars}`} subtitle={r.text} rightTitle={formatRelative(r.createdAt)} onPress={() => navigation.navigate('ReviewDetail', { merchantId: m.id, reviewId: r.id })} divider={i < m.reviews.length - 1} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function ReviewDetailScreen({ route }: ScanStackScreenProps<'ReviewDetail'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  const r = m?.reviews.find((x) => x.id === route.params.reviewId);
  if (!m || !r) return <Screen><Header title="Review" /></Screen>;
  return (
    <Screen>
      <Header title={`Review by ${r.author}`} />
      <View style={{ padding: 16 }}>
        <Text style={[styles.title, { color: theme.colors.text, fontSize: 22 }]}>⭐ {r.stars} / 5</Text>
        <Text style={{ color: theme.colors.text, marginTop: 12, lineHeight: 22 }}>{r.text}</Text>
        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Helpful" rightTitle="👍" />
          <ListRow title="Reply" onPress={() => {}} divider={false} />
        </NeumorphCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 },
});
