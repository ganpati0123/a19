import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, NeumorphCard, ListRow, GradientButton } from '@components/index';
import { useHaptics } from '@hooks/useHaptics';
import Toast from 'react-native-toast-message';
import type { HomeStackScreenProps } from '@navigation/types';

export function ShareReceiptScreen({ route, navigation }: HomeStackScreenProps<'ShareReceipt'>) {
  const theme = useTheme();
  const haptic = useHaptics();

  const send = (channel: string) => {
    haptic('success');
    Toast.show({ type: 'success', text1: `Receipt shared via ${channel}`, text2: route.params.transactionId.toUpperCase() });
    setTimeout(() => navigation.goBack(), 600);
  };

  return (
    <Screen>
      <Header title="Share receipt" />
      <NeumorphCard style={{ marginHorizontal: 16, paddingVertical: 4 }}>
        <ListRow leading={<Text style={styles.emo}>💬</Text>} title="WhatsApp" subtitle="Send to a contact instantly" onPress={() => send('WhatsApp')} />
        <ListRow leading={<Text style={styles.emo}>📧</Text>} title="Email" subtitle="Attach as PDF" onPress={() => send('Email')} />
        <ListRow leading={<Text style={styles.emo}>📨</Text>} title="SMS" subtitle="Plain text summary" onPress={() => send('SMS')} />
        <ListRow leading={<Text style={styles.emo}>📋</Text>} title="Copy link" subtitle="Read-only receipt URL" onPress={() => send('Clipboard')} />
        <ListRow leading={<Text style={styles.emo}>💾</Text>} title="Save to device" subtitle="Saves a PDF locally" onPress={() => send('Files')} divider={false} />
      </NeumorphCard>
      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <GradientButton title="Done" gradient="primary" fullWidth size="lg" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emo: { fontSize: 22 },
});
