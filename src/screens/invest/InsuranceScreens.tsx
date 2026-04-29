import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import {
  Screen,
  Header,
  GradientCard,
  NeumorphCard,
  ListRow,
  SectionHeader,
  GradientButton,
  Chip,
  PressableScale,
} from '@components/index';
import { insurancePolicies, InsurancePolicy } from '@data/investments';
import { formatCompactINR, formatINR } from '@utils/format';
import type { InvestStackScreenProps } from '@navigation/types';

const types: (InsurancePolicy['type'] | 'All')[] = ['All', 'Term', 'Health', 'Vehicle', 'Travel', 'Home'];

export function InsuranceScreen({ navigation }: InvestStackScreenProps<'Insurance'>) {
  const theme = useTheme();
  const [type, setType] = useState<typeof types[number]>('All');
  const list = useMemo(() => (type === 'All' ? insurancePolicies : insurancePolicies.filter((p) => p.type === type)), [type]);

  return (
    <Screen>
      <Header title="Insurance" subtitle="Protect what matters" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="ocean" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Get covered</Text>
          <Text style={styles.heroAmount}>Save up to ₹46,800 in taxes</Text>
          <Text style={styles.heroSub}>Term, health, vehicle, travel & home insurance. No paperwork.</Text>
        </GradientCard>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {types.map((t) => (
          <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} size="sm" />
        ))}
      </View>

      <SectionHeader title="Recommended" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {list.filter((p) => p.recommended).map((p) => (
          <PressableScale key={p.id} haptic="light" onPress={() => navigation.navigate('InsuranceDetail', { policyId: p.id })} style={{ width: 240 }}>
            <GradientCard gradient={{ colors: p.gradient, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }} radius={20} style={{ padding: 16, minHeight: 160 }}>
              <Text style={styles.kicker}>{p.type} • {p.provider}</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 6 }} numberOfLines={2}>{p.name}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 6 }}>Cover {formatCompactINR(p.coverAmount)}</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 }}>₹{p.premium.toLocaleString('en-IN')}/yr</Text>
            </GradientCard>
          </PressableScale>
        ))}
      </ScrollView>

      <SectionHeader title="All policies" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {list.map((p, i) => (
          <ListRow
            key={p.id}
            leading={<Text style={{ fontSize: 22 }}>{p.type === 'Term' ? '🛡️' : p.type === 'Health' ? '❤️' : p.type === 'Vehicle' ? '🚗' : p.type === 'Travel' ? '✈️' : '🏠'}</Text>}
            title={p.name}
            subtitle={`${p.provider} • Cover ${formatCompactINR(p.coverAmount)}`}
            rightTitle={`₹${p.premium.toLocaleString('en-IN')}`}
            rightSubtitle={p.premiumFrequency.toLowerCase()}
            rightTitleColor={theme.colors.primary}
            onPress={() => navigation.navigate('InsuranceDetail', { policyId: p.id })}
            divider={i < list.length - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function InsuranceDetailScreen({ route, navigation }: InvestStackScreenProps<'InsuranceDetail'>) {
  const theme = useTheme();
  const p = insurancePolicies.find((x) => x.id === route.params.policyId);
  if (!p) return <Screen><Header title="Policy" /></Screen>;
  return (
    <Screen>
      <Header title={p.name} subtitle={p.provider} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient={{ colors: p.gradient, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }} radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>{p.type} cover</Text>
          <Text style={styles.heroAmount}>{formatCompactINR(p.coverAmount)}</Text>
          <Text style={styles.heroSub}>₹{p.premium.toLocaleString('en-IN')}/{p.premiumFrequency.toLowerCase()} • ⭐ {p.rating}</Text>
        </GradientCard>
      </View>
      <SectionHeader title="Benefits" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {p.benefits.map((b, i) => (
          <ListRow key={b} leading={<Text style={{ fontSize: 20 }}>✅</Text>} title={b} divider={i < p.benefits.length - 1} />
        ))}
      </NeumorphCard>
      <SectionHeader title="Exclusions" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {p.exclusions.map((b, i) => (
          <ListRow key={b} leading={<Text style={{ fontSize: 20 }}>⛔</Text>} title={b} divider={i < p.exclusions.length - 1} />
        ))}
      </NeumorphCard>
      <SectionHeader title="Key details" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Type" rightTitle={p.type} />
        <ListRow title="Provider" rightTitle={p.provider} />
        <ListRow title="Premium" rightTitle={`${formatINR(p.premium, { maximumFractionDigits: 0 })} / ${p.premiumFrequency}`} />
        <ListRow title="Tax benefits" rightTitle={p.type === 'Term' || p.type === 'Health' ? '80C / 80D' : '—'} />
        <ListRow title="Rating" rightTitle={`⭐ ${p.rating}`} divider={false} />
      </NeumorphCard>
      <View style={{ padding: 16 }}>
        <GradientButton title={`Buy for ₹${p.premium.toLocaleString('en-IN')}`} gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('InsurancePurchase', { policyId: p.id })} />
        <Text style={{ color: theme.colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 }}>15 day free look period. Cancel anytime.</Text>
      </View>
    </Screen>
  );
}

export function InsurancePurchaseScreen({ route, navigation }: InvestStackScreenProps<'InsurancePurchase'>) {
  const theme = useTheme();
  const p = insurancePolicies.find((x) => x.id === route.params.policyId);
  if (!p) return <Screen><Header title="Purchase" /></Screen>;
  const tax = Math.round(p.premium * 0.18);
  const total = p.premium + tax;
  return (
    <Screen>
      <Header title="Purchase policy" subtitle={p.name} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient={{ colors: p.gradient, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }} radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Total payable</Text>
          <Text style={styles.heroAmount}>{formatINR(total, { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.heroSub}>Inclusive of 18% GST • Next billing in 12 months</Text>
        </GradientCard>
      </View>
      <SectionHeader title="Applicant" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Name" rightTitle="Ganpati Tari" onPress={() => {}} />
        <ListRow title="Date of birth" rightTitle="14 Aug 1995" onPress={() => {}} />
        <ListRow title="PAN" rightTitle="AAAPT1234Q" onPress={() => {}} />
        <ListRow title="Address" rightTitle="Pune, MH" onPress={() => {}} />
        <ListRow title="Nominee" rightTitle="Spouse" onPress={() => {}} divider={false} />
      </NeumorphCard>
      <SectionHeader title="Summary" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Premium" rightTitle={formatINR(p.premium, { maximumFractionDigits: 0 })} />
        <ListRow title="GST (18%)" rightTitle={formatINR(tax, { maximumFractionDigits: 0 })} />
        <ListRow title="Total" rightTitle={formatINR(total, { maximumFractionDigits: 0 })} emphasis="strong" divider={false} />
      </NeumorphCard>
      <View style={{ padding: 16 }}>
        <GradientButton title={`Pay ${formatINR(total, { maximumFractionDigits: 0 })}`} gradient="primary" fullWidth size="lg" onPress={() => navigation.popToTop()} />
        <Text style={{ color: theme.colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 }}>By proceeding you accept the insurer's terms.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroAmount: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
});
