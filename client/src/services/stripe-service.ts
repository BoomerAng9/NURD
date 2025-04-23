/**
 * Stripe payment service for the NURD application
 * Handles client-side payment processing actions
 */

// Define interface for payment intent creation
interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description?: string;
}

// Define interface for payment intent response
interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

// Define interface for subscription processing
interface SubscriptionRequest {
  plan: string;
  customerId?: string;
}

// Define interface for subscription response
interface SubscriptionResponse {
  subscriptionId: string;
  clientSecret: string;
}

/**
 * Create a payment intent for one-time payments
 */
export async function createPaymentIntent(data: PaymentIntentRequest): Promise<PaymentIntentResponse> {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Payment intent creation failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    throw new Error(error.message || 'Failed to create payment intent');
  }
}

/**
 * Create or get subscription for recurring payments
 */
export async function createSubscription(data: SubscriptionRequest): Promise<SubscriptionResponse> {
  try {
    const response = await fetch('/api/get-or-create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Subscription creation failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    throw new Error(error.message || 'Failed to create subscription');
  }
}

/**
 * Cancel an active subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Subscription cancellation failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    throw new Error(error.message || 'Failed to cancel subscription');
  }
}

/**
 * Get customer payment methods
 */
export async function getPaymentMethods(): Promise<any[]> {
  try {
    const response = await fetch('/api/payment-methods', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Getting payment methods failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting payment methods:', error);
    throw new Error(error.message || 'Failed to get payment methods');
  }
}

/**
 * Check if a user has an active subscription
 */
export async function checkSubscriptionStatus(): Promise<{ 
  active: boolean, 
  plan?: string, 
  endDate?: string,
  trialEnd?: string
}> {
  try {
    const response = await fetch('/api/subscription-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Checking subscription status failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error checking subscription status:', error);
    return { active: false };
  }
}