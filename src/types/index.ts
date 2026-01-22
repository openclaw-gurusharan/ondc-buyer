// Re-export ONDC/Beckn types from @ondc-sdk/shared
export * from '@ondc-sdk/shared/types';

// Additional local types specific to this buyer portal
export interface CartItemProps {
  item: {
    item: { id: string; descriptor?: { name: string }; price?: { value?: string; currency: string } };
    quantity: number;
  };
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  disabled: boolean;
}

export interface CartSummaryProps {
  subtotal: number;
  currency: string;
  onCheckout: () => void;
  checkoutDisabled: boolean;
}
