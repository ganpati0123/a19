import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, interpolate } from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, GlassCard, ListRow, NeumorphCard, SectionHeader, PressableScale } from '@components/index';
import { merchants, featuredMerchants } from '@data/merchants';
import type { ScanStackScreenProps } from '@navigation/types';

export function ScanScreen({ navigation }: ScanStackScreenProps<'Scan'>) {
  const theme = useTheme();
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [t]);
  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(t.value, [0, 1], [-110, 110]) }],
    opacity: interpolate(t.value, [0, 0.5, 1], [0.4, 1, 0.4]),
  }));

  return (
    <Screen>
      <Header title="Scan & Pay" subtitle="Tap any QR card to start" showBack={false} />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={[styles.viewfinder, { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface }]}>
          <View style={[styles.corner, styles.tl, { borderColor: theme.colors.primary }]} />
          <View style={[styles.corner, styles.tr, { borderColor: theme.colors.primary }]} />
          <View style={[styles.corner, styles.bl, { borderColor: theme.colors.primary }]} />
          <View style={[styles.corner, styles.br, { borderColor: theme.colors.primary }]} />
          <Animated.View style={[styles.scanLine, lineStyle, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.placeholder, { color: theme.colors.textMuted }]}>📷  Camera viewfinder (mock)</Text>
        </View>
        <View style={styles.row}>
          <GradientButton title="Open gallery" gradient="paymentInfo" size="md" onPress={() => navigation.navigate('ScanGallery')} />
          <GradientButton title="My QR" variant="outline" size="md" onPress={() => navigation.navigate('MerchantDetails', { merchantId: merchants[0].id })} />
          <GradientButton title="Pay phone" variant="ghost" size="md" onPress={() => navigation.getParent()?.navigate('HomeTab')} />
        </View>
      </View>

      <SectionHeader title="Featured nearby" subtitle="Top rated merchants accepting PayX" actionLabel="See all" onAction={() => navigation.navigate('Scan')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {featuredMerchants.slice(0, 6).map((m, i) => (
          <ListRow
            key={m.id}
            leading={<Text style={{ fontSize: 26 }}>{m.initials}</Text>}
            title={m.name}
            subtitle={`${m.area}, ${m.city} • ⭐ ${m.rating} (${m.ratingCount})`}
            rightTitle={m.cashbackPercent ? `${m.cashbackPercent}% back` : ''}
            rightTitleColor={theme.colors.success}
            badge={m.isPremium ? 'Pro' : m.isVerified ? 'Verified' : undefined}
            badgeColor={m.isPremium ? '#F4A622' : '#1BB76E'}
            onPress={() => navigation.navigate('MerchantDetails', { merchantId: m.id })}
            divider={i < 5}
          />
        ))}
      </NeumorphCard>

      <SectionHeader title="All merchants" />
      {merchants.slice(0, 16).map((m) => (
        <View key={m.id} style={{ paddingHorizontal: 16 }}>
          <ListRow
            leading={<Text style={{ fontSize: 22 }}>{m.initials}</Text>}
            title={m.name}
            subtitle={`${m.category} • ${m.area}`}
            rightTitle={m.rating.toFixed(1)}
            rightSubtitle={`${m.ratingCount} reviews`}
            onPress={() => navigation.navigate('MerchantDetails', { merchantId: m.id })}
          />
        </View>
      ))}
    </Screen>
  );
}

export function ScanGalleryScreen({ navigation }: ScanStackScreenProps<'ScanGallery'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Pick QR from gallery" />
      <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <PressableScale key={i} onPress={() => navigation.replace('MerchantDetails', { merchantId: merchants[i % merchants.length].id })} haptic="light" style={{ width: '31%', aspectRatio: 1 }}>
            <GlassCard style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 42 }}>🖼️</Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 11, marginTop: 4 }}>{`IMG_00${20 + i}`}</Text>
            </GlassCard>
          </PressableScale>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewfinder: {
    height: 240,
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#5A4BFF' },
  tl: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  scanLine: { position: 'absolute', left: 24, right: 24, height: 2, borderRadius: 2 },
  placeholder: { fontSize: 14 },
  row: { flexDirection: 'row', gap: 8, marginTop: 14, justifyContent: 'space-between' },
});
