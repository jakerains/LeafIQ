export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: StripeProduct[] = [
  {
    id: 'prod_SPQHHhO9MNzgOD',
    priceId: 'price_1RUbQXPxWdc12GF1Nyf5z0as',
    name: 'LeafIQ - Monthly Subscription',
    description: 'Monthly Subscription for LeafIQ',
    mode: 'subscription'
  }
];