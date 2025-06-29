export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
}

export interface StripeSubscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export type SubscriptionStatus =
  | 'not_started'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export interface StripeOrder {
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  customer_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: OrderStatus;
  order_date: string;
}

export type OrderStatus = 'pending' | 'completed' | 'canceled';