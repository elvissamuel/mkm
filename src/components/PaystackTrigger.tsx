import React, { forwardRef, useImperativeHandle } from "react";
import { PaystackConsumer } from "react-paystack";

interface PaystackTriggerProps {
  email: string;
  amount: number;
  onSuccess: (reference: any) => void;
}

export interface PaystackTriggerRef {
  triggerPayment: () => void;
}

interface PaystackConsumerProps {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  onSuccess: () => void;
  onClose: () => void;
}

const PaystackTrigger = forwardRef<PaystackTriggerRef, PaystackTriggerProps>(
  ({ email, amount, onSuccess }, ref) => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
    let initializePaymentFn: (() => void) | null = null;

    const config: PaystackConsumerProps = {
      reference: new Date().getTime().toString(),
      email,
      amount: amount * 100,
      publicKey,
      onSuccess: () => onSuccess({}),
      onClose: () => {},
    };

    useImperativeHandle(ref, () => ({
      triggerPayment: () => {
        if (initializePaymentFn) initializePaymentFn();
      },
    }));

    return (
      <PaystackConsumer {...config}>
        {(arg: any) => {
          initializePaymentFn = arg.initializePayment;
          return null; // No visible UI needed
        }}
      </PaystackConsumer>
    );
  }
);

export default PaystackTrigger;
