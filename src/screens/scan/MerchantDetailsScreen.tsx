import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, GradientButton, ListRow, NeumorphCard, Chip, SectionHeader, StatPill, Avatar } from '@components/index';
import { findMerchant, merchantCategoryLabels, merchantCategoryIcons } from '@data/merchants';
import { formatINR, formatRelative } from '@utils/format';
import { useFavorites } from '@hooks/useFavorites';
import type { ScanStackScreenProps } from '@navigation/types';

export function MerchantDetailsScreen({ route, navigation }: ScanStackScreenProps<'MerchantDetails'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  const fav = useFavorites();
  if (!m) return <Screen><Header title="Merchant" /></Screen>;
  const isFav = fav.has('merchant', m.id);
  return (
    <Screen>
      <Header title={m.name} subtitle={`${merchantCategoryLabels[m.category]} • ${m.area}`} />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <GradientCard gradient="sunset" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>{merchantCategoryIcons[m.category]} {merchantCategoryLabels[m.category]}</Text>
          <Text style={styles.title}>{m.name}</Text>
          <Text style={styles.sub}>{m.description}</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.smallLabel}>Cashback</Text>
              <Text style={styles.smallVal}>{m.cashbackPercent}%</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Rating</Text>
              <Text style={styles.smallVal}>⭐ {m.rating.toFixed(1)}</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Status</Text>
              <Text style={styles.smallVal}>{m.isOpen ? 'Open' : 'Closed'}</Text>
            </View>
          </View>
        </GradientCard>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {m.isVerified ? <Chip label="✓ Verified" color={theme.colors.success} /> : null}
          {m.isPremium ? <Chip label="Premium Pro" color="#F4A622" /> : null}
          <Chip label={m.hours} />
          <Chip label={`GSTIN ${m.gstin}`} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <GradientButton title="Pay now" gradient="primary" size="lg" onPress={() => navigation.navigate('ScanAmount', { merchantId: m.id })} iconLeft={<Text style={{ color: '#fff' }}>⚡</Text>} />
          <GradientButton title={isFav ? '★ Saved' : '☆ Save'} variant="outline" size="md" onPress={() => fav.toggle('merchant', m.id)} />
          <GradientButton title="Share" variant="ghost" size="md" onPress={() => {}} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 14, flexDirection: 'row', gap: 10 }}>
        <StatPill label="Avg ticket" value={formatINR(420)} caption="last 30 days" />
        <StatPill label="Last visit" value="3 days ago" caption={formatINR(420)} />
        <StatPill label="Total spent" value={formatINR(8420)} caption="lifetime" />
      </View>

      <SectionHeader title="Top items" subtitle="Tap to add to cart" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {m.topItems.map((it, i) => (
          <ListRow key={i} title={it.name} subtitle={it.popular ? 'Popular pick' : ''} rightTitle={formatINR(it.price)} onPress={() => {}} divider={i < m.topItems.length - 1} />
        ))}
      </NeumorphCard>

      <SectionHeader title="Active offers" actionLabel="See all" onAction={() => navigation.navigate('MerchantOffers', { merchantId: m.id })} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {m.deals.slice(0, 3).map((d, i) => (
          <ListRow key={d.id} leading={<Text style={{ fontSize: 22 }}>🎁</Text>} title={d.title} subtitle={d.subtitle} rightTitle={`${d.expiresInDays}d left`} rightTitleColor={theme.colors.warning} onPress={() => navigation.navigate('MerchantOfferDetail', { merchantId: m.id, offerId: d.id })} divider={i < 2} />
        ))}
      </NeumorphCard>

      <SectionHeader title="Reviews" subtitle={`${m.ratingCount} verified`} actionLabel="See all" onAction={() => navigation.navigate('MerchantReviews', { merchantId: m.id })} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {m.reviews.slice(0, 3).map((r, i) => (
          <ListRow key={r.id} leading={<Avatar name={r.author} size={42} />} title={`${r.author} • ⭐ ${r.stars}`} subtitle={r.text} rightTitle={formatRelative(r.createdAt)} onPress={() => navigation.navigate('ReviewDetail', { merchantId: m.id, reviewId: r.id })} divider={i < 2} />
        ))}
      </NeumorphCard>

      <SectionHeader title="Policies" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {m.policyHighlights.map((p, i) => (
          <ListRow key={i} title={p} divider={i < m.policyHighlights.length - 1} onPress={() => {}} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 },
  row: { flexDirection: 'row', gap: 18, marginTop: 14 },
  smallLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '700' },
  smallVal: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 2 },
});
