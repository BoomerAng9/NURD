/**
 * AskCodi API integration service
 * Provides functions to interact with the AskCodi API through our backend
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
 * Generate code using AskCodi API
 */
export async function getCodeGenerationWithAskCodi({
  prompt,
  model,
  maxTokens = 2048,
  temperature = 0.7
}: CodeGenerationRequest): Promise<string> {
  try {
    const response = await fetch('/api/askcodi/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        maxTokens,
        temperature
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate code');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error generating code with AskCodi:', error);
    throw error;
  }
}

/**
 * Explain code using AskCodi API
 */
export async function getCodeExplanationWithAskCodi({
  code,
  language,
  model
}: CodeExplanationRequest): Promise<string> {
  try {
    const response = await fetch('/api/askcodi/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        model
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to explain code');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error explaining code with AskCodi:', error);
    throw error;
  }
}

/**
 * Complete code using AskCodi API
 */
export async function getCodeCompletionWithAskCodi({
  code,
  language,
  model,
  maxTokens = 2048,
  temperature = 0.7
}: CodeCompletionRequest): Promise<string> {
  try {
    const response = await fetch('/api/askcodi/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        model,
        maxTokens,
        temperature
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to complete code');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error completing code with AskCodi:', error);
    throw error;
  }
}

/**
 * Default models to use when API request fails
 */
const DEFAULT_MODELS = [
  'gpt-3.5-turbo',
  'claude-instant-1',
  'mistral-tiny',
  'gemini-pro',
  'llama-2'
];

/**
 * Get available AskCodi models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch('/api/askcodi/models');

    if (!response.ok) {
      console.warn('AskCodi models API failed, using default models');
      return DEFAULT_MODELS;
    }

    const data = await response.json();
    return data.models.length > 0 ? data.models : DEFAULT_MODELS;
  } catch (error) {
    console.error('Error fetching AskCodi models:', error);
    // Return default models instead of throwing error
    return DEFAULT_MODELS;
  }
}