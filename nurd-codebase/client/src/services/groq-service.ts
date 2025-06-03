/**
 * Service for handling GROQ API requests
 */

/**
 * Interface for code generation request
 */
interface CodeGenerationRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Interface for code explanation request
 */
interface CodeExplanationRequest {
  code: string;
  language?: string;
  model?: string;
}

/**
 * Interface for code completion request
 */
interface CodeCompletionRequest {
  code: string;
  language: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Get available GROQ models for code generation and explanation
 */
export async function getGroqModels(): Promise<string[]> {
  try {
    console.log('Fetching available GROQ models...');
    const response = await fetch('/api/groq/models');
    
    if (!response.ok) {
      console.warn(`GROQ models API returned status ${response.status}`);
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched GROQ models:', data.models);
    return data.models || [];
  } catch (error) {
    console.error('Error fetching GROQ models:', error);
    // Return comprehensive set of fallback models
    const fallbackModels = [
      // Llama models
      'llama3-70b-8192',      // Llama 3 70B (most powerful)
      'llama3-8b-8192',       // Llama 3 8B (fast)
      'llama3.1-8b-8192',     // Llama 3.1 8B (improved)
      'llama3.1-70b-8192',    // Llama 3.1 70B (improved, most powerful)
      
      // Mixtral models
      'mixtral-8x7b-32768',   // Mixtral 8x7B (powerful)
      
      // Mistral models
      'mistral-7b-instruct',  // Mistral 7B (fast)
      
      // Gemma models
      'gemma-7b-it',          // Google's Gemma 7B
      
      // Legacy models (fallback)
      'llama2-70b-4096'       // Llama 2 (legacy)
    ];
    
    console.log('Using fallback model list');
    return fallbackModels;
  }
}

/**
 * Generate code using GROQ API
 */
export async function getCodeGenerationWithGroq(request: CodeGenerationRequest): Promise<string> {
  try {
    const response = await fetch('/api/groq/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || '';
  } catch (error) {
    console.error('Error in code generation with GROQ:', error);
    throw error;
  }
}

/**
 * Get explanation for code using GROQ API
 */
export async function getCodeExplanationWithGroq(request: CodeExplanationRequest): Promise<string> {
  try {
    const response = await fetch('/api/groq/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || '';
  } catch (error) {
    console.error('Error in code explanation with GROQ:', error);
    throw error;
  }
}

/**
 * Get code completion using GROQ API
 */
export async function getCodeCompletionWithGroq(request: CodeCompletionRequest): Promise<string> {
  try {
    const response = await fetch('/api/groq/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || '';
  } catch (error) {
    console.error('Error in code completion with GROQ:', error);
    throw error;
  }
}