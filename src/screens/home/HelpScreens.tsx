import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientCard, GradientButton, ListRow, NeumorphCard, SectionHeader } from '@components/index';
import type { HomeStackScreenProps } from '@navigation/types';

interface Article {
  id: string;
  title: string;
  body: string;
  category: 'payments' | 'security' | 'bills' | 'invest' | 'account';
}

export const helpArticles: Article[] = [
  { id: 'h1', title: 'How do I send money via UPI?', body: 'Open the Home tab, pick a contact, enter an amount and confirm with your UPI PIN. Receipts save automatically.', category: 'payments' },
  { id: 'h2', title: 'Resetting UPI PIN', body: 'Go to Bank accounts → Bank → Reset UPI PIN. You will be asked for your debit card last 6 digits and OTP.', category: 'security' },
  { id: 'h3', title: 'How is cashback credited?', body: 'Cashback for bills and merchants is credited to your wallet within 24 hours of a successful payment.', category: 'bills' },
  { id: 'h4', title: 'How to start an SIP', body: 'Open the Investments tab, pick a fund, choose monthly SIP and confirm. Auto-debit can be set on any saved bank.', category: 'invest' },
  { id: 'h5', title: 'Disputed transactions', body: 'Open the transaction in question, tap Raise dispute and choose a reason. Most cases resolve in 48-72 hours.', category: 'payments' },
  { id: 'h6', title: 'Two-factor authentication', body: 'Settings → Security → Two-factor auth. Enable to add a TOTP layer to high-value transactions.', category: 'security' },
  { id: 'h7', title: 'Why was my recharge delayed?', body: 'Operators can take up to 30 minutes to process top-ups during peak hours.', category: 'bills' },
  { id: 'h8', title: 'Closing my account', body: 'Profile → Help → Close account. Make sure to withdraw cashback wallet first.', category: 'account' },
];

export function HelpScreen({ navigation }: HomeStackScreenProps<'Help'>) {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Help & support" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="paymentInfo" radius={20} style={{ padding: 18 }}>
          <Text style={styles.kicker}>NEED A HUMAN?</Text>
          <Text style={styles.title}>Chat with a specialist</Text>
          <Text style={styles.sub}>24x7 support, average 4 minute first response.</Text>
          <GradientButton title="Open chat" variant="ghost" textStyle={{ color: '#fff' }} onPress={() => {}} style={{ marginTop: 10 }} />
        </GradientCard>
      </View>
      <SectionHeader title="Top articles" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        {helpArticles.map((a, i) => (
          <ListRow
            key={a.id}
            title={a.title}
            subtitle={a.category}
            onPress={() => navigation.navigate('HelpArticle', { articleId: a.id })}
            divider={i < helpArticles.length - 1}
          />
        ))}
      </NeumorphCard>
    </Screen>
  );
}

export function HelpArticleScreen({ route }: HomeStackScreenProps<'HelpArticle'>) {
  const theme = useTheme();
  const a = helpArticles.find((x) => x.id === route.params.articleId) ?? helpArticles[0];
  return (
    <Screen>
      <Header title="Article" />
      <View style={{ padding: 16 }}>
        <Text style={[styles.h1, { color: theme.colors.text }]}>{a.title}</Text>
        <Text style={[styles.cat, { color: theme.colors.textMuted }]}>Category: {a.category}</Text>
        <Text style={[styles.body, { color: theme.colors.text }]}>{a.body}</Text>
        <Text style={[styles.body, { color: theme.colors.text }]}>
          {'\n'}If this article didn\'t answer your question, you can chat with a human specialist or raise a structured ticket. Our average first response is under 5 minutes during business hours and under 15 minutes overnight.
        </Text>
        <Text style={[styles.body, { color: theme.colors.text }]}>
          {'\n'}You can also browse related categories on the Help home page. Premium Pro members skip the queue and get a dedicated relationship manager.
        </Text>
        <NeumorphCard style={{ marginTop: 18, paddingVertical: 4 }}>
          <ListRow title="Was this helpful?" rightTitle="👍 👎" />
          <ListRow title="Talk to a specialist" onPress={() => {}} />
          <ListRow title="Raise a ticket" onPress={() => {}} divider={false} />
        </NeumorphCard>
      </View>
    </Screen>
  );
}

export function ReferralsScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <Header title="Refer & earn" />
      <View style={{ paddingHorizontal: 16 }}>
        <GradientCard gradient="rainbow" radius={22} style={{ padding: 20 }}>
          <Text style={styles.kicker}>EARN UP TO ₹10,000</Text>
          <Text style={styles.title}>Invite friends, earn rewards</Text>
          <Text style={styles.sub}>You both earn ₹100 when they make their first payment.</Text>
          <GradientButton title="Share invite link" variant="ghost" textStyle={{ color: '#fff' }} onPress={() => {}} style={{ marginTop: 10 }} />
        </GradientCard>
      </View>
      <SectionHeader title="Your referrals" subtitle="3 friends joined this month" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow title="Riya Sharma" subtitle="Joined 5 days ago" rightTitle="₹100" rightTitleColor={theme.colors.success} />
        <ListRow title="Karan Mehta" subtitle="Joined 2 weeks ago" rightTitle="₹100" rightTitleColor={theme.colors.success} />
        <ListRow title="Aisha Khan" subtitle="Pending first payment" rightTitle="—" divider={false} />
      </NeumorphCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  h1: { fontSize: 22, fontWeight: '800' },
  cat: { fontSize: 12, marginTop: 4 },
  body: { fontSize: 14, lineHeight: 22, marginTop: 12 },
});
