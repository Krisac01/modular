import { STRIPE_PRODUCTS } from '@/stripe-config';
import { StripeProduct, StripeSubscription } from '@/types/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createCheckoutSession(
  priceId: string,
  mode: 'subscription' | 'payment',
  successUrl: string,
  cancelUrl: string
) {
  try {
    const { data: sessionData, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: priceId,
        mode,
        success_url: successUrl,
        cancel_url: cancelUrl,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return sessionData;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function redirectToCheckout(product: StripeProduct) {
  try {
    const { url } = await createCheckoutSession(
      product.priceId,
      product.mode,
      `${window.location.origin}/checkout/success`,
      `${window.location.origin}/checkout/canceled`
    );

    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

export async function getSubscription(): Promise<StripeSubscription | null> {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return Object.values(STRIPE_PRODUCTS).find(product => product.priceId === priceId);
}

export function isSubscriptionActive(subscription: StripeSubscription | null): boolean {
  if (!subscription) return false;
  return subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing';
}