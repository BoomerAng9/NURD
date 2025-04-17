// API Service for making requests to our backend
import { toast } from '@/hooks/use-toast';

const BASE_URL = '/api';

// Generic error handler
const handleError = (error: any, customMessage?: string) => {
  console.error('API Error:', error);
  const message = customMessage || 'Something went wrong. Please try again.';
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive'
  });
  
  return Promise.reject(error);
};

// Generic POST request helper
export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleError(error);
  }
};

// Generic GET request helper
export const getData = async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
  try {
    let url = `${BASE_URL}${endpoint}`;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url = `${url}?${queryString}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleError(error);
  }
};

// AI Code Tools API (OpenAI)
export const aiCodeTools = {
  generateCodeSuggestion: (prompt: string, language?: string, maxTokens?: number) => 
    postData<{ suggestion: string }>('/ai/code-suggestion', { prompt, language, maxTokens }),
  
  explainCode: (code: string, language?: string) => 
    postData<{ explanation: string }>('/ai/code-explanation', { code, language }),
  
  optimizeCode: (code: string, language: string, focus?: 'performance' | 'readability' | 'security' | 'all') => 
    postData<{ optimizedCode: string }>('/ai/code-optimization', { code, language, focus })
};

// AskCodi API
export const askCodiTools = {
  generateCode: (prompt: string, model?: string, maxTokens?: number, temperature?: number) => 
    postData<{ code: string }>('/askcodi/generate', { prompt, model, maxTokens, temperature }),
  
  explainCode: (code: string, language?: string, model?: string) => 
    postData<{ explanation: string }>('/askcodi/explain', { code, language, model }),
  
  completeCode: (code: string, language: string, model?: string, maxTokens?: number, temperature?: number) => 
    postData<{ completion: string }>('/askcodi/complete', { code, language, model, maxTokens, temperature }),
  
  getModels: () => getData<{ models: string[] }>('/askcodi/models')
};

// Payment API
export const payments = {
  createPaymentIntent: (amount: number, currency: string, description?: string, metadata?: Record<string, string>) => 
    postData<{ clientSecret: string }>('/payments/create-payment-intent', { amount, currency, description, metadata }),
  
  createSubscription: (customerId: string, priceId: string, quantity?: number, metadata?: Record<string, string>) => 
    postData<{ subscriptionId: string }>('/payments/create-subscription', { customerId, priceId, quantity, metadata }),
  
  createCustomer: (email: string, name?: string, metadata?: Record<string, string>) => 
    postData<{ customerId: string }>('/payments/create-customer', { email, name, metadata })
};

export default {
  aiCodeTools,
  askCodiTools,
  payments
};