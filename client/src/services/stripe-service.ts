// Stripe Payment Service

// Define interfaces for our payment service functions
export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionRequest {
  customerId: string;
  priceId: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

// Function to create a payment intent
export async function createPaymentIntent(request: PaymentIntentRequest): Promise<{ clientSecret: string }> {
  try {
    const response = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return { clientSecret: data.clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Function to create a subscription
export async function createSubscription(request: SubscriptionRequest): Promise<{ subscriptionId: string }> {
  try {
    const response = await fetch('/api/payments/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return { subscriptionId: data.subscriptionId };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}