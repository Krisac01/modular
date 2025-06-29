import { StripeProduct } from './types/stripe';

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  annualSubscription: {
    priceId: 'price_1RfRmpP1fdYPMIGJqQljgkIE',
    name: 'Suscripción anual Agrosolutions',
    description: 'Suscripción anual Agrosolutions',
    mode: 'subscription'
  }
};