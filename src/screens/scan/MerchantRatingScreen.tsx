import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';
import { Screen, Header, GradientButton, NeumorphCard, Chip, PressableScale } from '@components/index';
import { findMerchant } from '@data/merchants';
import Toast from 'react-native-toast-message';
import type { ScanStackScreenProps } from '@navigation/types';

const tags = ['Quick service', 'Polite staff', 'Tasty', 'Clean', 'Value for money', 'Would visit again'];

export function MerchantRatingScreen({ route, navigation }: ScanStackScreenProps<'MerchantRating'>) {
  const theme = useTheme();
  const m = findMerchant(route.params.merchantId);
  const [rating, setRating] = useState(5);
  const [chosen, setChosen] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  const toggleTag = (t: string) => setChosen((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  return (
    <Screen>
      <Header title="Rate experience" subtitle={m?.name} />
      <View style={{ padding: 16 }}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <PressableScale key={s} onPress={() => setRating(s)} haptic="selection">
              <Text style={[styles.star, { color: s <= rating ? '#F4A622' : theme.colors.borderStrong }]}>★</Text>
            </PressableScale>
          ))}
        </View>
        <Text style={[styles.ratingLabel, { color: theme.colors.text }]}>{['Tap to rate', 'Bad', 'Could improve', 'OK', 'Great', 'Excellent'][rating]}</Text>

        <NeumorphCard style={{ padding: 14, marginTop: 16 }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>Quick tags</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tags.map((t) => (
              <Chip key={t} label={t} active={chosen.includes(t)} onPress={() => toggleTag(t)} />
            ))}
          </View>
        </NeumorphCard>

        <NeumorphCard style={{ padding: 14, marginTop: 12 }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>Tell us more</Text>
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            multiline
            placeholder="What stood out?"
            placeholderTextColor={theme.colors.placeholder}
            style={{ color: theme.colors.text, minHeight: 80, textAlignVertical: 'top' }}
          />
        </NeumorphCard>

        <View style={{ marginTop: 18, gap: 10 }}>
          <GradientButton title="Submit rating" gradient="primary" fullWidth size="lg" onPress={() => { Toast.show({ type: 'success', text1: 'Thanks for the feedback!', text2: `${rating} stars` }); navigation.popToTop(); }} />
          <GradientButton title="Skip" variant="ghost" fullWidth size="md" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  star: { fontSize: 56, fontWeight: '800' },
  ratingLabel: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginTop: 8 },
});
