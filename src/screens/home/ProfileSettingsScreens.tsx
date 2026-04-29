import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, Avatar, GradientCard, GradientButton, ListRow, NeumorphCard, SectionHeader, Chip } from '@components/index';
import { useSettings } from '@hooks/useSettings';
import type { HomeStackScreenProps } from '@navigation/types';

export function ProfileScreen({ navigation }: HomeStackScreenProps<'Profile'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Profile" />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <GradientCard gradient="primaryStrong" radius={22} style={{ padding: 20, alignItems: 'center' }}>
          <Avatar name="Ganpati Tari" size={84} />
          <Text style={styles.name}>Ganpati Tari</Text>
          <Text style={styles.handle}>ganpati@payx • +91 9876 543 210</Text>
          <View style={styles.proRow}>
            <Chip label="✓ KYC Verified" active color="#1BB76E" />
            <Chip label="Premium Pro" active color="#F4A622" />
          </View>
        </GradientCard>
        <NeumorphCard style={{ paddingVertical: 4 }}>
          <ListRow title="Settings" subtitle="Theme, notifications, biometrics" onPress={() => navigation.navigate('Settings')} />
          <ListRow title="Bank accounts & UPI" subtitle="3 banks, 4 UPI IDs" onPress={() => navigation.navigate('BankAccounts')} />
          <ListRow title="Rewards" subtitle="₹274 cashback wallet" onPress={() => navigation.navigate('Rewards')} />
          <ListRow title="Refer & earn" subtitle="Earn ₹100 per friend" onPress={() => navigation.navigate('Referrals')} />
          <ListRow title="Help & support" subtitle="24x7 chat, FAQ, disputes" onPress={() => navigation.navigate('Help')} divider={false} />
        </NeumorphCard>
        <GradientButton title="Sign out" variant="outline" fullWidth size="md" onPress={() => {}} />
      </View>
    </Screen>
  );
}

export function SettingsScreen({ navigation }: HomeStackScreenProps<'Settings'>) {
  const theme = useTheme();
  const { settings, update } = useSettings();
  return (
    <Screen>
      <Header title="Settings" />
      <SectionHeader title="Appearance" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Theme" subtitle="System / Light / Dark" rightTitle={theme.preference} onPress={() => navigation.navigate('Appearance')} />
        <ListRow title="Home layout" rightTitle={settings.homeLayout} onPress={() => {}} />
        <ListRow title="Receipt theme" rightTitle={settings.receiptTheme} onPress={() => {}} divider={false} />
      </NeumorphCard>

      <SectionHeader title="Security" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Biometric login" rightTitle="" trailing={<Switch value={settings.biometricEnabled} onValueChange={(v) => update('biometricEnabled', v)} />} />
        <ListRow title="Hide balances" rightTitle="" trailing={<Switch value={settings.hideBalances} onValueChange={(v) => update('hideBalances', v)} />} />
        <ListRow title="Private mode" rightTitle="" trailing={<Switch value={settings.privateMode} onValueChange={(v) => update('privateMode', v)} />} />
        <ListRow title="Two-factor auth" rightTitle="" trailing={<Switch value={settings.twoFactorEnabled} onValueChange={(v) => update('twoFactorEnabled', v)} />} />
        <ListRow title="Reset UPI PIN" onPress={() => navigation.navigate('Security')} />
        <ListRow title="Manage devices" rightTitle="2" onPress={() => navigation.navigate('Security')} divider={false} />
      </NeumorphCard>

      <SectionHeader title="Notifications & feedback" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Push notifications" trailing={<Switch value={settings.notificationsEnabled} onValueChange={(v) => update('notificationsEnabled', v)} />} />
        <ListRow title="Haptics" trailing={<Switch value={settings.hapticsEnabled} onValueChange={(v) => update('hapticsEnabled', v)} />} />
        <ListRow title="Sounds" trailing={<Switch value={settings.soundsEnabled} onValueChange={(v) => update('soundsEnabled', v)} />} />
        <ListRow title="Cashback banners" trailing={<Switch value={settings.showCashbackBanners} onValueChange={(v) => update('showCashbackBanners', v)} />} />
        <ListRow title="Marketing emails" trailing={<Switch value={settings.marketingOptIn} onValueChange={(v) => update('marketingOptIn', v)} />} divider={false} />
      </NeumorphCard>

      <SectionHeader title="AI assistant" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Floating AI button" trailing={<Switch value={settings.aiAssistantEnabled} onValueChange={(v) => update('aiAssistantEnabled', v)} />} />
        <ListRow title="Spend insights" trailing={<Switch value={settings.showSpendInsights} onValueChange={(v) => update('showSpendInsights', v)} />} divider={false} />
      </NeumorphCard>

      <SectionHeader title="About" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Version" rightTitle="1.0.0 (Premium Pro Advanced AMX Eleven)" />
        <ListRow title="Help" onPress={() => navigation.navigate('Help')} />
        <ListRow title="Privacy policy" onPress={() => {}} />
        <ListRow title="Terms of service" onPress={() => {}} divider={false} />
      </NeumorphCard>
    </Screen>
  );
}

export function AppearanceScreen({ navigation }: HomeStackScreenProps<'Appearance'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Appearance" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="System default" subtitle="Match device theme" rightTitle={theme.preference === 'system' ? '✓' : ''} onPress={() => theme.setPreference('system')} />
        <ListRow title="Light" subtitle="Crisp white surfaces" rightTitle={theme.preference === 'light' ? '✓' : ''} onPress={() => theme.setPreference('light')} />
        <ListRow title="Dark" subtitle="Easy on eyes at night" rightTitle={theme.preference === 'dark' ? '✓' : ''} onPress={() => theme.setPreference('dark')} divider={false} />
      </NeumorphCard>
      <SectionHeader title="Quick toggle" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientButton title={theme.isDark ? 'Switch to Light' : 'Switch to Dark'} gradient="primary" fullWidth size="lg" onPress={theme.toggle} />
      </View>
    </Screen>
  );
}

export function SecurityScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Security" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Reset UPI PIN" subtitle="Across all linked banks" onPress={() => {}} />
        <ListRow title="Change app PIN" onPress={() => {}} />
        <ListRow title="Manage devices" rightTitle="2 active" onPress={() => {}} />
        <ListRow title="Login history" onPress={() => {}} />
        <ListRow title="Block UPI" subtitle="Temporarily block all transactions" rightTitleColor={theme.colors.danger} onPress={() => {}} divider={false} />
      </NeumorphCard>
    </Screen>
  );
}

export function NotificationsScreen() {
  const items = [
    { id: 'n1', title: 'Cashback received', body: '₹40 added to your wallet from electricity bill', time: '2m' },
    { id: 'n2', title: 'Payment to Riya Sharma', body: '₹240 paid via HDFC ••4321', time: '1h' },
    { id: 'n3', title: 'SIP debit reminder', body: 'Equity SIP of ₹2,000 will run on 5th May', time: '3h' },
    { id: 'n4', title: 'New device login', body: 'iPhone 15 Pro signed in from Mumbai', time: '5h' },
    { id: 'n5', title: 'Bill due in 3 days', body: 'Tata Power ₹1,320 — pay before due date for cashback', time: '1d' },
    { id: 'n6', title: 'Festive offer', body: 'Get 5% extra cashback on movie tickets this weekend', time: '1d' },
    { id: 'n7', title: 'Gold price alert', body: '24K crossed ₹7,200/g — review your portfolio', time: '2d' },
  ];
  return (
    <Screen>
      <Header title="Notifications" subtitle={`${items.length} updates`} />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {items.map((n, i) => (
          <ListRow key={n.id} title={n.title} subtitle={n.body} rightTitle={n.time} divider={i < items.length - 1} onPress={() => {}} />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 12 },
  handle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  proRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
});
