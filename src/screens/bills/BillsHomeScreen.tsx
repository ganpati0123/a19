import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, ListRow, NeumorphCard, SectionHeader, PressableScale, GradientButton } from '@components/index';
import { billCategoryGradients, billCategoryIcons, billCategoryLabels, operators } from '@data/operators';
import type { BillsStackScreenProps, BillsStackParamList } from '@navigation/types';

const cats: (keyof typeof billCategoryLabels)[] = ['mobile', 'dth', 'electricity', 'water', 'gas', 'broadband', 'creditcard', 'fastag', 'insurance', 'loan', 'rent', 'lpg'];

export function BillsHomeScreen({ navigation }: BillsStackScreenProps<'BillsHome'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header showBack={false} title="Recharge & Bills" subtitle="One tap pay for everything" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="bills" radius={22} style={{ padding: 18 }}>
          <Text style={styles.kicker}>Save with PayX</Text>
          <Text style={styles.title}>Up to ₹500 cashback on bills</Text>
          <Text style={styles.sub}>Pay before due date with UPI for guaranteed cashback.</Text>
          <GradientButton title="Set up auto-pay" variant="ghost" textStyle={{ color: '#fff' }} onPress={() => navigation.navigate('AutoPay')} style={{ marginTop: 10 }} />
        </GradientCard>
      </View>

      <SectionHeader title="Categories" subtitle="Tap to begin" />
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {cats.map((c) => (
          <PressableScale key={c} onPress={() => navigation.navigate('CategoryHome', { category: c })} haptic="light" style={{ width: '30.5%' }}>
            <LinearGradient colors={billCategoryGradients[c]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.catTile}>
              <Text style={styles.catEmoji}>{billCategoryIcons[c]}</Text>
            </LinearGradient>
            <Text style={[styles.catLabel, { color: theme.colors.text }]} numberOfLines={1}>{billCategoryLabels[c]}</Text>
          </PressableScale>
        ))}
      </View>

      <SectionHeader title="Reminders" actionLabel="See all" onAction={() => navigation.navigate('BillReminders')} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow leading={<Text style={{ fontSize: 22 }}>⚡</Text>} title="Tata Power" subtitle="Due in 3 days • ₹1,320" rightTitle="Pay" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('CategoryHome', { category: 'electricity' })} />
        <ListRow leading={<Text style={{ fontSize: 22 }}>📡</Text>} title="ACT Fibernet" subtitle="Due tomorrow • ₹999" rightTitle="Pay" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('CategoryHome', { category: 'broadband' })} />
        <ListRow leading={<Text style={{ fontSize: 22 }}>🛣️</Text>} title="FASTag (KA01XX1234)" subtitle="Balance ₹240 • Recharge" rightTitle="Pay" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('CategoryHome', { category: 'fastag' })} divider={false} />
      </NeumorphCard>

      <SectionHeader title="Recently paid" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {operators.slice(0, 6).map((o, i) => (
          <ListRow
            key={o.id}
            leading={<Text style={{ fontSize: 22 }}>{billCategoryIcons[o.category]}</Text>}
            title={o.name}
            subtitle={`${billCategoryLabels[o.category]} • ⭐ ${o.rating}`}
            onPress={() => navigation.navigate('Operator', { category: o.category, operatorId: o.id } as BillsStackParamList['Operator'])}
            divider={i < 5}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  catTile: { aspectRatio: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 36 },
  catLabel: { fontSize: 12, fontWeight: '700', marginTop: 8, textAlign: 'center' },
});
