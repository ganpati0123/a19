import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, ListRow, NeumorphCard, NumericKeypad, AmountInput, GradientCard, SectionHeader, Chip } from '@components/index';
import { operatorsByCategory, billCategoryLabels, billCategoryIcons, detectMobileOperator, operators, BillCategory } from '@data/operators';
import { plansForOperator, findPlan, planCategoryLabels } from '@data/plans';
import { formatINR } from '@utils/format';
import { PinFlow } from '../home/PinScreen';
import type { BillsStackScreenProps, BillsStackParamList } from '@navigation/types';

export function CategoryHomeScreen({ route, navigation }: BillsStackScreenProps<'CategoryHome'>) {
  const theme = useTheme();
  const cat = route.params.category as BillCategory;
  const ops = operatorsByCategory(cat);
  const [phone, setPhone] = useState('');
  const detected = cat === 'mobile' && phone.length >= 4 ? detectMobileOperator(phone) : undefined;

  return (
    <Screen>
      <Header title={`${billCategoryIcons[cat]} ${billCategoryLabels[cat]}`} />
      <View style={{ paddingHorizontal: 16 }}>
        <NeumorphCard style={{ padding: 14 }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, fontWeight: '700' }}>{cat === 'mobile' ? 'Phone number' : cat === 'electricity' ? 'Consumer number' : cat === 'fastag' ? 'Vehicle number' : 'Customer ID'}</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType={cat === 'mobile' ? 'number-pad' : 'default'}
            placeholder={cat === 'mobile' ? '9876543210' : 'CXXXXXXXX'}
            placeholderTextColor={theme.colors.placeholder}
            style={{ color: theme.colors.text, fontSize: 18, fontWeight: '700', marginTop: 4 }}
            maxLength={cat === 'mobile' ? 10 : 24}
          />
          {detected ? <Text style={{ color: theme.colors.success, fontSize: 12, marginTop: 4 }}>Detected: {detected.name}</Text> : null}
        </NeumorphCard>
      </View>

      <SectionHeader title="Pick operator" subtitle={`${ops.length} available`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {ops.map((o, i) => (
          <ListRow
            key={o.id}
            leading={<Text style={{ fontSize: 22 }}>{billCategoryIcons[o.category]}</Text>}
            title={o.name}
            subtitle={`Helpline ${o.helpline} • ⭐ ${o.rating}`}
            badge={detected?.id === o.id ? 'Auto' : undefined}
            badgeColor={theme.colors.primary}
            onPress={() => navigation.navigate('Operator', { category: cat, operatorId: o.id } as BillsStackParamList['Operator'])}
            divider={i < ops.length - 1}
          />
        ))}
      </NeumorphCard>
      {phone && cat !== 'mobile' ? (
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <GradientButton title="Continue" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('BillSummary', { operatorId: ops[0]?.id ?? operators[0].id, amount: 1320, phone })} />
        </View>
      ) : null}
    </Screen>
  );
}

export function OperatorScreen({ route, navigation }: BillsStackScreenProps<'Operator'>) {
  const theme = useTheme();
  const op = operators.find((o) => o.id === route.params.operatorId) ?? operatorsByCategory(route.params.category as BillCategory)[0];
  const plans = op.category === 'mobile' ? plansForOperator(op.id) : [];
  return (
    <Screen>
      <Header title={op.name} subtitle={billCategoryLabels[op.category]} />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>{billCategoryLabels[op.category]}</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{op.name}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 }}>Helpline: {op.helpline}</Text>
        </GradientCard>
      </View>
      {op.category === 'mobile' ? (
        <>
          <SectionHeader title="Browse plans" subtitle={`${plans.length} active`} />
          <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
            {plans.slice(0, 8).map((p, i) => (
              <ListRow
                key={p.id}
                title={`${formatINR(p.amount)} • ${planCategoryLabels[p.category]}`}
                subtitle={`${p.totalDataGb}GB • ${p.validityDays}d • ${p.voice === 'unlimited' ? 'Unlimited calls' : p.voice}`}
                rightTitle={p.popular ? 'Popular' : ''}
                rightTitleColor={theme.colors.primary}
                onPress={() => navigation.navigate('PlanDetail', { planId: p.id, phone: route.params.phone })}
                divider={i < 7}
              />
            ))}
          </NeumorphCard>
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <GradientButton title="Browse all plans" variant="outline" fullWidth size="md" onPress={() => navigation.navigate('OperatorPlans', { operatorId: op.id, phone: route.params.phone })} />
          </View>
        </>
      ) : (
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <GradientButton title="Pay bill" gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('BillSummary', { operatorId: op.id, amount: 1320, phone: route.params.phone })} />
        </View>
      )}
    </Screen>
  );
}

export function OperatorPlansScreen({ route, navigation }: BillsStackScreenProps<'OperatorPlans'>) {
  const theme = useTheme();
  const plans = plansForOperator(route.params.operatorId);
  const [filter, setFilter] = useState<string>('all');
  const tabs = ['all', 'unlimited', 'topup', 'short-validity', 'long-validity'];
  const filtered = filter === 'all' ? plans : plans.filter((p) => p.category === filter);
  return (
    <Screen>
      <Header title="All plans" subtitle={`${plans.length} options`} />
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {tabs.map((t) => <Chip key={t} label={t.toUpperCase()} active={filter === t} onPress={() => setFilter(t)} />)}
      </View>
      <NeumorphCard style={{ marginHorizontal: 16, marginTop: 12, paddingVertical: 4 }}>
        {filtered.map((p, i) => (
          <ListRow
            key={p.id}
            title={`${formatINR(p.amount)}`}
            subtitle={`${p.totalDataGb}GB • ${p.validityDays}d • ${p.bestFor}`}
            rightTitle={p.popular ? 'Popular' : `${p.cashbackPercent}%`}
            rightTitleColor={p.popular ? theme.colors.primary : theme.colors.success}
            onPress={() => navigation.navigate('PlanDetail', { planId: p.id, phone: route.params.phone })}
            divider={i < filtered.length - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function PlanDetailScreen({ route, navigation }: BillsStackScreenProps<'PlanDetail'>) {
  const theme = useTheme();
  const p = findPlan(route.params.planId);
  if (!p) return <Screen><Header title="Plan" /></Screen>;
  return (
    <Screen>
      <Header title="Plan details" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="primaryStrong" radius={22} style={{ padding: 18 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>{planCategoryLabels[p.category]}</Text>
          <AmountInput amount={p.amount} fontSize={42} align="left" style={{ alignSelf: 'flex-start' }} />
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>{p.bestFor}</Text>
        </GradientCard>
      </View>
      <NeumorphCard style={{ marginHorizontal: 16, marginTop: 14, paddingVertical: 4 }}>
        <ListRow title="Validity" rightTitle={`${p.validityDays} days`} />
        <ListRow title="Total data" rightTitle={`${p.totalDataGb} GB`} />
        {p.perDayDataGb ? <ListRow title="Per day data" rightTitle={`${p.perDayDataGb} GB`} /> : null}
        <ListRow title="Voice" rightTitle={typeof p.voice === 'string' ? p.voice : 'Unlimited'} />
        <ListRow title="SMS / day" rightTitle={`${p.smsPerDay}`} />
        {p.ottBundle?.length ? <ListRow title="OTT bundle" rightTitle={p.ottBundle.join(', ')} /> : null}
        <ListRow title="Cashback" rightTitle={`${p.cashbackPercent}%`} rightTitleColor={theme.colors.success} divider={false} />
      </NeumorphCard>
      <SectionHeader title="Extras" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {p.extras.map((e, i) => <ListRow key={i} title={e} divider={i < p.extras.length - 1} />)}
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <GradientButton title={`Recharge ${formatINR(p.amount, { maximumFractionDigits: 0 })}`} gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('BillSummary', { operatorId: p.operatorId, amount: p.amount, planId: p.id, phone: route.params.phone })} />
      </View>
    </Screen>
  );
}

export function BillSummaryScreen({ route, navigation }: BillsStackScreenProps<'BillSummary'>) {
  const theme = useTheme();
  const op = operators.find((o) => o.id === route.params.operatorId);
  return (
    <Screen>
      <Header title="Confirm payment" subtitle={op?.name} />
      <View style={{ padding: 16 }}>
        <GradientCard gradient="primary" radius={22} style={{ padding: 18, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' }}>Total payable</Text>
          <AmountInput amount={route.params.amount} fontSize={42} />
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 }}>{op?.name} • {route.params.phone ?? '—'}</Text>
        </GradientCard>
        <NeumorphCard style={{ marginTop: 16, paddingVertical: 4 }}>
          <ListRow title="Operator" rightTitle={op?.name ?? '—'} />
          <ListRow title="Customer ref" rightTitle={route.params.phone ?? '—'} />
          {route.params.planId ? <ListRow title="Plan" rightTitle={route.params.planId} /> : null}
          <ListRow title="Convenience fee" rightTitle="₹0" />
          <ListRow title="Cashback" rightTitle={`₹${Math.round(route.params.amount * 0.02)}`} rightTitleColor={theme.colors.success} divider={false} />
        </NeumorphCard>
        <View style={{ marginTop: 18 }}>
          <GradientButton title={`Pay ${formatINR(route.params.amount, { maximumFractionDigits: 0 })}`} gradient="primary" fullWidth size="lg" onPress={() => navigation.navigate('BillsPin', { operatorId: route.params.operatorId, amount: route.params.amount, planId: route.params.planId, phone: route.params.phone })} />
        </View>
      </View>
    </Screen>
  );
}

export function BillsPinScreen({ route, navigation }: BillsStackScreenProps<'BillsPin'>) {
  return (
    <PinFlow
      amount={route.params.amount}
      title="Confirm bill payment"
      subtitle={`Operator ${route.params.operatorId}`}
      onSuccess={(transactionId) => navigation.replace('BillsSuccess', { operatorId: route.params.operatorId, amount: route.params.amount, transactionId })}
    />
  );
}

export function BillsSuccessScreen({ route, navigation }: BillsStackScreenProps<'BillsSuccess'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header showBack={false} title="" />
      <View style={{ padding: 16, alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 84 }}>✅</Text>
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800' }}>Bill paid successfully</Text>
        <AmountInput amount={route.params.amount} fontSize={48} />
        <NeumorphCard style={{ alignSelf: 'stretch', marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Reference" rightTitle={route.params.transactionId.toUpperCase()} />
          <ListRow title="Cashback" rightTitle={`₹${Math.round(route.params.amount * 0.02)}`} rightTitleColor={theme.colors.success} />
          <ListRow title="Receipt" onPress={() => navigation.getParent()?.navigate('HomeTab', { screen: 'Receipt', params: { transactionId: route.params.transactionId } } as any)} divider={false} />
        </NeumorphCard>
        <View style={{ width: '100%', marginTop: 18, gap: 8 }}>
          <GradientButton title="Done" gradient="primary" fullWidth size="lg" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}

export function BillRemindersScreen({ navigation }: BillsStackScreenProps<'BillReminders'>) {
  const theme = useTheme();
  const items = [
    { id: 'r1', title: 'Tata Power', sub: 'Due 3 May • ₹1,320', amt: 1320 },
    { id: 'r2', title: 'ACT Fibernet', sub: 'Due 1 May • ₹999', amt: 999 },
    { id: 'r3', title: 'BSNL Broadband', sub: 'Due 8 May • ₹599', amt: 599 },
    { id: 'r4', title: 'Adani Gas', sub: 'Due 12 May • ₹740', amt: 740 },
    { id: 'r5', title: 'HDFC Card', sub: 'Due 15 May • ₹12,440', amt: 12440 },
  ];
  return (
    <Screen>
      <Header title="Reminders" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {items.map((it, i) => (
          <ListRow key={it.id} title={it.title} subtitle={it.sub} rightTitle="Pay" rightTitleColor={theme.colors.primary} onPress={() => navigation.navigate('ReminderDetail', { reminderId: it.id })} divider={i < items.length - 1} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function ReminderDetailScreen({ route, navigation }: BillsStackScreenProps<'ReminderDetail'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Reminder" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Reference" rightTitle={route.params.reminderId} />
        <ListRow title="Auto pay" rightTitle="Off" onPress={() => navigation.navigate('AutoPay')} />
        <ListRow title="Notify before" rightTitle="2 days" />
        <ListRow title="Snooze" rightTitle="3 days" divider={false} onPress={() => {}} />
      </NeumorphCard>
    </Screen>
  );
}

export function AutoPayScreen({ navigation }: BillsStackScreenProps<'AutoPay'>) {
  const theme = useTheme();
  const items = [
    { id: 'm1', title: 'Tata Power', sub: 'Up to ₹2,500/mo', status: 'Active' },
    { id: 'm2', title: 'Netflix subscription', sub: '₹649/mo', status: 'Active' },
    { id: 'm3', title: 'Spotify Premium', sub: '₹179/mo', status: 'Paused' },
  ];
  return (
    <Screen>
      <Header title="Auto-pay" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {items.map((it, i) => (
          <ListRow key={it.id} title={it.title} subtitle={it.sub} rightTitle={it.status} rightTitleColor={it.status === 'Active' ? theme.colors.success : theme.colors.warning} onPress={() => navigation.navigate('AutoPayDetail', { mandateId: it.id })} divider={i < items.length - 1} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function AutoPayDetailScreen({ route }: BillsStackScreenProps<'AutoPayDetail'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Mandate" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Mandate ID" rightTitle={route.params.mandateId.toUpperCase()} />
        <ListRow title="Bank" rightTitle="HDFC ••4321" />
        <ListRow title="Frequency" rightTitle="Monthly" />
        <ListRow title="Cap" rightTitle="₹2,500" />
        <ListRow title="Pause" rightTitle=">" rightTitleColor={theme.colors.warning} onPress={() => {}} />
        <ListRow title="Cancel" rightTitle=">" rightTitleColor={theme.colors.danger} onPress={() => {}} divider={false} />
      </NeumorphCard>
    </Screen>
  );
}

const styles = StyleSheet.create({});
