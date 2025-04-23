import { Request, Response } from 'express';
import Stripe from 'stripe';
import type { Stripe as StripeTypes } from 'stripe';

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

/**
 * Get or create a subscription with a payment intent
 * Used for initiating subscription payments
 */
export async function getOrCreateSubscription(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  // Check user authentication
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get user from request (assuming req.user exists from passport or auth middleware)
    const user: any = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // If user already has an active subscription, retrieve it
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe!.subscriptions.retrieve(user.stripeSubscriptionId);
        
        // Get the payment intent from the subscription's latest invoice
        const latestInvoice = await stripe!.invoices.retrieve(subscription.latest_invoice as string);
        // Cast to expected type to access non-standard properties
        const invoiceData = latestInvoice as unknown as { payment_intent: string };
        const paymentIntent = await stripe!.paymentIntents.retrieve(invoiceData.payment_intent);

        return res.json({
          subscriptionId: subscription.id,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (err) {
        // If retrieval fails (e.g., subscription was deleted in Stripe), continue to create a new one
        console.warn('Failed to retrieve existing subscription, creating new one:', err);
      }
    }
    
    // Parse plan data from request
    const { plan, billingCycle = 'monthly' } = req.body;
    if (!plan) {
      return res.status(400).json({ error: 'Subscription plan is required' });
    }

    // Get the appropriate price ID based on the selected plan and billing cycle
    const priceId = getPriceIdForPlan(plan, billingCycle);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription plan or billing cycle' });
    }

    // Create or use existing customer
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe!.customers.create({
        email: user.email || 'unknown@example.com',
        name: user.username || user.name || 'NURD User',
        metadata: {
          userId: user.id.toString(),
        },
      });
      customerId = customer.id;
      
      // Update user with the new Stripe customer ID (depends on your storage implementation)
      if (typeof req.app.locals.storage?.updateUserStripeInfo === 'function') {
        await req.app.locals.storage.updateUserStripeInfo(user.id, { stripeCustomerId: customerId });
      }
    }

    // Create a subscription
    const subscription = await stripe!.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user with subscription ID
    if (typeof req.app.locals.storage?.updateUserStripeInfo === 'function') {
      await req.app.locals.storage.updateUserStripeInfo(user.id, { 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id
      });
    }

    // Return the subscription ID and client secret
    const invoiceId = subscription.latest_invoice as string;
    const invoice = await stripe!.invoices.retrieve(invoiceId);
    // Cast to expected type to access non-standard properties
    const invoiceData = invoice as unknown as { payment_intent: string };
    const paymentIntent = await stripe!.paymentIntents.retrieve(invoiceData.payment_intent);

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message || 'Failed to create subscription' });
  }
}

/**
 * Get subscription details for the current user
 */
export async function getSubscriptionStatus(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  // Check user authentication
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user: any = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // If user doesn't have a subscription, return inactive status
    if (!user.stripeSubscriptionId) {
      return res.json({ active: false });
    }

    // Retrieve subscription from Stripe
    const subscription = await stripe!.subscriptions.retrieve(user.stripeSubscriptionId);

    // Cast the subscription to the expected type to access typed properties
    const subscriptionData = subscription as unknown as StripeTypes.Subscription;
    
    // Get the data we need safely
    const subscriptionEndTimestamp = subscriptionData.current_period_end || null;
    const trialEndTimestamp = subscriptionData.trial_end || null;
    
    // Return subscription status
    res.json({
      active: subscription.status === 'active',
      plan: subscription.items.data[0].price.id,
      endDate: subscriptionEndTimestamp 
        ? new Date(subscriptionEndTimestamp * 1000).toISOString()
        : undefined,
      trialEnd: trialEndTimestamp 
        ? new Date(trialEndTimestamp * 1000).toISOString() 
        : undefined,
    });
  } catch (error: any) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message || 'Failed to get subscription status' });
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  // Check user authentication
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user: any = req.user;
    
    if (!user || !user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel subscription at period end
    const subscription = await stripe!.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
  }
}

/**
 * Get user's saved payment methods
 */
export async function getPaymentMethods(req: Request, res: Response) {
  if (!checkStripeConfiguration(res)) return;

  // Check user authentication
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user: any = req.user;
    
    if (!user || !user.stripeCustomerId) {
      return res.json([]);
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe!.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    res.json(paymentMethods.data);
  } catch (error: any) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({ error: error.message || 'Failed to get payment methods' });
  }
}

/**
 * Helper function to get the Stripe price ID for a plan
 */
function getPriceIdForPlan(plan: string, billingCycle: string = 'monthly'): string | null {
  // In production, these would be environment variables or stored in a database
  // For the new pricing model with the NURD Subscription and VIBE Boot Camp
  
  if (plan === 'subscription') {
    if (billingCycle === 'yearly') {
      return process.env.STRIPE_PRICE_SUBSCRIPTION_YEARLY || 'price_subscription_yearly';
    } else {
      return process.env.STRIPE_PRICE_SUBSCRIPTION_MONTHLY || 'price_subscription_monthly';
    }
  } else if (plan === 'bootcamp') {
    return process.env.STRIPE_PRICE_BOOTCAMP || 'price_bootcamp';
  }
  
  // Legacy plan options
  switch (plan) {
    case 'basic':
      return process.env.STRIPE_PRICE_BASIC || 'price_basic';
    case 'standard':
      return process.env.STRIPE_PRICE_STANDARD || 'price_standard';
    case 'premium':
      return process.env.STRIPE_PRICE_PREMIUM || 'price_premium';
    default:
      return null;
  }
}