import { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe with the secret key (will be undefined if key not provided)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

/**
 * Interface for creating a payment intent
 */
interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

/**
 * Interface for creating a subscription
 */
interface SubscriptionRequest {
  customerId: string;
  priceId: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

/**
 * Check if Stripe is properly configured
 */
function checkStripeConfiguration(res: Response): boolean {
  if (!stripe) {
    res.status(500).json({ 
      error: 'Stripe is not configured. Please add the STRIPE_SECRET_KEY to the environment variables.' 
    });
    return false;
  }
  return true;
}

/**
 * Create a payment intent
 */
export async function createPaymentIntent(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  try {
    const { amount, currency, description, metadata } = req.body as PaymentIntentRequest;
    
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required' });
    }

    const paymentIntent = await stripe!.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      metadata,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment intent' });
  }
}

/**
 * Create a subscription
 */
export async function createSubscription(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  try {
    const { customerId, priceId, quantity = 1, metadata } = req.body as SubscriptionRequest;
    
    if (!customerId || !priceId) {
      return res.status(400).json({ error: 'Customer ID and price ID are required' });
    }

    const subscription = await stripe!.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
          quantity,
        },
      ],
      metadata,
    });

    res.json({ subscriptionId: subscription.id });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message || 'Failed to create subscription' });
  }
}

/**
 * Create a customer in Stripe
 */
export async function createCustomer(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  try {
    const { email, name, metadata } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const customer = await stripe!.customers.create({
      email,
      name,
      metadata,
    });

    res.json({ customerId: customer.id });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: error.message || 'Failed to create customer' });
  }
}