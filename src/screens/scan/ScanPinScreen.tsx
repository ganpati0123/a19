import React from 'react';
import { PinFlow } from '../home/PinScreen';
import type { ScanStackScreenProps } from '@navigation/types';

export function ScanPinScreen({ route, navigation }: ScanStackScreenProps<'ScanPin'>) {
  return (
    <PinFlow
      merchantId={route.params.merchantId}
      amount={route.params.amount}
      title="Confirm with UPI PIN"
      subtitle={`Method: ${route.params.method.toUpperCase()}`}
      onSuccess={(transactionId) =>
        navigation.replace('ScanSuccess', { merchantId: route.params.merchantId, amount: route.params.amount, transactionId })
      }
    />
  );
}
