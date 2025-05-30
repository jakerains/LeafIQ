import { products } from '../stripe-config';
import { supabase } from './supabase';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('You must be logged in to make a purchase');
    }

    const product = products.find(p => p.priceId === priceId);
    if (!product) {
      throw new Error('Invalid product selected');
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/canceled`,
        mode: mode
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function getUserSubscription() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function getUserOrders() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export function getProductByPriceId(priceId: string) {
  return products.find(p => p.priceId === priceId);
}