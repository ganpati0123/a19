/**
 * Floating AI assistant overlay. Shows a glowing pill button that opens
 * a bottom sheet with mocked replies. Mounted once at the App root so it
 * appears on every screen automatically.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/ThemeProvider';
import { gradients } from '@theme/gradients';
import { aiSuggestions, useAIAssistant } from '@hooks/useAIAssistant';
import { useHaptics } from '@hooks/useHaptics';
import { useSettings } from '@hooks/useSettings';
import { PressableScale } from './PressableScale';

export function FloatingAI() {
  const theme = useTheme();
  const haptic = useHaptics();
  const sheet = useRef<BottomSheet>(null);
  const { settings } = useSettings();
  const { messages, isThinking, send, clear } = useAIAssistant();
  const [draft, setDraft] = useState('');

  const open = useCallback(() => {
    haptic('medium');
    sheet.current?.snapToIndex(0);
  }, [haptic]);

  const close = useCallback(() => {
    sheet.current?.close();
  }, []);

  const submit = useCallback(async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await send(text);
  }, [draft, send]);

  const snapPoints = useMemo(() => ['78%'], []);

  if (!settings.aiAssistantEnabled) return null;

  return (
    <>
      <PressableScale
        onPress={open}
        haptic="medium"
        style={styles.fab}
      >
        <LinearGradient
          colors={gradients.primaryStrong.colors as readonly [string, string, ...string[]]}
          start={gradients.primaryStrong.start}
          end={gradients.primaryStrong.end}
          style={styles.fabInner}
        >
          <Text style={styles.fabEmoji}>🤖</Text>
          <Text style={styles.fabLabel}>Ask AI</Text>
        </LinearGradient>
      </PressableScale>

      <BottomSheet
        ref={sheet}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.sheetHandle, width: 44 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.6}
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: theme.colors.text }]}>PayX Assistant</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                  {isThinking ? 'Thinking…' : 'Ask anything about payments, bills or your account.'}
                </Text>
              </View>
              <PressableScale
                onPress={() => {
                  haptic('selection');
                  clear();
                }}
                haptic={false}
                style={[styles.headerBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Text style={[styles.headerBtnText, { color: theme.colors.textMuted }]}>Clear</Text>
              </PressableScale>
              <PressableScale
                onPress={close}
                haptic={false}
                style={[styles.headerBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Text style={[styles.headerBtnText, { color: theme.colors.textMuted }]}>Close</Text>
              </PressableScale>
            </View>

            <View style={[styles.messages, { backgroundColor: theme.colors.background }]}>
              {messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.bubble,
                    m.role === 'user'
                      ? { alignSelf: 'flex-end', backgroundColor: theme.colors.primary }
                      : {
                          alignSelf: 'flex-start',
                          backgroundColor: theme.colors.surfaceElevated,
                          borderColor: theme.colors.border,
                          borderWidth: StyleSheet.hairlineWidth,
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      { color: m.role === 'user' ? '#fff' : theme.colors.text },
                    ]}
                  >
                    {m.text}
                  </Text>
                </View>
              ))}
              {isThinking ? (
                <View
                  style={[
                    styles.bubble,
                    {
                      alignSelf: 'flex-start',
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                      borderWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <Text style={[styles.bubbleText, { color: theme.colors.textMuted }]}>• • •</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.suggestionRow}>
              {aiSuggestions.slice(0, 4).map((s) => (
                <PressableScale
                  key={s}
                  onPress={() => send(s)}
                  haptic="selection"
                  style={[styles.suggestion, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.suggestionText, { color: theme.colors.text }]} numberOfLines={1}>
                    {s}
                  </Text>
                </PressableScale>
              ))}
            </View>

            <View style={[styles.composer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Type your message…"
                placeholderTextColor={theme.colors.placeholder}
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.inputBorder,
                  },
                ]}
                onSubmitEditing={submit}
                returnKeyType="send"
              />
              <PressableScale
                onPress={submit}
                haptic="light"
                style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.sendBtnText}>Send</Text>
              </PressableScale>
            </View>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 96,
    borderRadius: 26,
    overflow: 'hidden',
  },
  fabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  fabEmoji: {
    fontSize: 20,
  },
  fabLabel: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  suggestion: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 14,
  },
  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
});
