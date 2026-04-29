/**
 * Floating AI assistant state machine.
 *
 * Stores the chat thread in AsyncStorage so users can return to a
 * conversation across sessions. Generates mocked responses by sampling
 * from a curated bank of helpful, brand-tone replies.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { readJson, StorageKeys, writeJson } from '@utils/storage';
import { sleep } from '@utils/sleep';
import { shortId } from '@utils/format';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
}

const greetings: string[] = [
  'Hi! I\'m your PayX assistant. Ask me anything about payments, bills, or your account.',
  'Hello there! I can help you split bills, plan investments, or find cashback offers.',
  'Welcome back. What can I help you with today?',
];

const responseBank: { matchers: RegExp[]; replies: string[] }[] = [
  {
    matchers: [/balance|how much/i],
    replies: [
      'Your linked accounts show ₹84,360.45 across 3 banks. Tap "Balance" on the home screen for a live check.',
      'Here\'s a quick balance peek: HDFC ₹42,118 • Axis ₹17,920 • Kotak ₹24,322. Long-press a card to set it as default.',
    ],
  },
  {
    matchers: [/upi|pay|send/i],
    replies: [
      'To pay someone, tap the Home tab and pick a recent contact, then enter the amount.',
      'For instant UPI: open Home → tap a contact → enter an amount → confirm with PIN. Receipts are saved automatically.',
    ],
  },
  {
    matchers: [/scan|qr/i],
    replies: [
      'Use the Scan tab. Point at any UPI QR — we\'ll auto-fill merchant details. Long-press inside the viewfinder to flip the camera.',
      'Scanning is fastest in well-lit spaces. If a QR is dim, switch to the gallery picker from the top-right action.',
    ],
  },
  {
    matchers: [/recharge|mobile|prepaid|dth|electricity|bill/i],
    replies: [
      'Open the Bills tab → pick a category → enter your number. We auto-detect the operator and surface popular plans.',
      'Bill payments earn 1.2% cashback when paid before the due date. We schedule reminders 3 days before automatically.',
    ],
  },
  {
    matchers: [/gold|silver|invest|sip|mutual/i],
    replies: [
      'Investments live under the last tab. Daily SIPs start at ₹100 and gold can be purchased in 0.01g increments.',
      'Tip: if your portfolio is heavy on equity, try a 60-30-10 split (equity / debt / gold) — tap "Allocate" to model it.',
    ],
  },
  {
    matchers: [/cashback|reward/i],
    replies: [
      'Your cashback wallet is at ₹274.50. Spend it on any bill payment or convert to a gift voucher.',
      'Most rewards expire 90 days after issue. The Rewards screen shows the soonest-expiring batch first.',
    ],
  },
  {
    matchers: [/refund|dispute|charge/i],
    replies: [
      'For disputes, open the transaction in question, tap "Raise dispute", and pick a reason. Most cases resolve in 48-72 hours.',
      'You can attach screenshots to a dispute by long-pressing the receipt — we\'ll redact account numbers automatically.',
    ],
  },
  {
    matchers: [/dark|theme|mode/i],
    replies: [
      'Switch themes from Profile → Settings → Appearance. There\'s also a quick toggle in the home header.',
      'Dark mode dims the gradients but keeps key call-to-action buttons high contrast for accessibility.',
    ],
  },
  {
    matchers: [/help|support|contact/i],
    replies: [
      'For human support, open Profile → Help. We pick up chats 24x7 and average a 4 minute first response.',
      'You can reach a specialist through Profile → Help → "Talk to an expert". Premium users skip the queue.',
    ],
  },
];

const fallback = [
  'Got it! I can help with payments, bills, investments, and account help. Could you tell me a bit more?',
  'Tap any card on a screen for quick actions — most flows resolve in 2 taps.',
  'I\'m a mock assistant for now, but I\'ll do my best to be helpful! Try asking about balance, bills, scan or invest.',
  'I noted that. Meanwhile, you can swipe up the floating sheet for shortcuts.',
];

function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReply(prompt: string): string {
  for (const entry of responseBank) {
    if (entry.matchers.some((m) => m.test(prompt))) {
      return pickFrom(entry.replies);
    }
  }
  return pickFrom(fallback);
}

export function useAIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    readJson<AIMessage[]>(StorageKeys.aiHistory, []).then((stored) => {
      if (!aliveRef.current) return;
      if (stored.length === 0) {
        const seed: AIMessage = {
          id: shortId('ai_'),
          role: 'assistant',
          text: pickFrom(greetings),
          createdAt: Date.now(),
        };
        setMessages([seed]);
        writeJson(StorageKeys.aiHistory, [seed]).catch(() => {});
      } else {
        setMessages(stored);
      }
      setHydrated(true);
    });
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const sync = useCallback((next: AIMessage[]) => {
    setMessages(next);
    writeJson(StorageKeys.aiHistory, next.slice(-100)).catch(() => {});
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMessage: AIMessage = {
        id: shortId('ai_'),
        role: 'user',
        text: trimmed,
        createdAt: Date.now(),
      };
      const withUser = [...messages, userMessage];
      sync(withUser);
      setIsThinking(true);
      await sleep(700 + Math.random() * 900);
      if (!aliveRef.current) return;
      const reply: AIMessage = {
        id: shortId('ai_'),
        role: 'assistant',
        text: generateReply(trimmed),
        createdAt: Date.now(),
      };
      sync([...withUser, reply]);
      setIsThinking(false);
    },
    [messages, sync],
  );

  const clear = useCallback(() => {
    const seed: AIMessage = {
      id: shortId('ai_'),
      role: 'assistant',
      text: pickFrom(greetings),
      createdAt: Date.now(),
    };
    sync([seed]);
  }, [sync]);

  return useMemo(
    () => ({ messages, isThinking, hydrated, send, clear }),
    [messages, isThinking, hydrated, send, clear],
  );
}

export const aiSuggestions: string[] = [
  'Show me my last 5 transactions',
  'How do I pay my electricity bill?',
  'Suggest a SIP for ₹2000/month',
  'What\'s the gold price right now?',
  'Help me dispute a charge',
  'How do I switch to dark mode?',
  'Where are my cashback rewards?',
  'How can I split a restaurant bill?',
  'Set a monthly food budget',
  'How do I add a new bank account?',
];
