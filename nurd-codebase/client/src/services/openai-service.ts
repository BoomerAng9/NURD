// OpenAI Service for AI functionality
import OpenAI from 'openai';

// Define interfaces for our AI service functions
export interface CodeSuggestionRequest {
  prompt: string;
  language?: string;
  maxTokens?: number;
}

export interface CodeExplanationRequest {
  code: string;
  language?: string;
}

export interface CodeOptimizationRequest {
  code: string;
  language: string;
  focus?: 'performance' | 'readability' | 'security' | 'all';
}

// API functions for our OpenAI-powered features
export async function getCodeSuggestion(request: CodeSuggestionRequest): Promise<string> {
  try {
    const response = await fetch('/api/ai/code-suggestion', {
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
    return data.suggestion;
  } catch (error) {
    console.error('Error getting code suggestion:', error);
    throw error;
  }
}

export async function getCodeExplanation(request: CodeExplanationRequest): Promise<string> {
  try {
    const response = await fetch('/api/ai/code-explanation', {
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
    return data.explanation;
  } catch (error) {
    console.error('Error getting code explanation:', error);
    throw error;
  }
}

export async function getCodeOptimization(request: CodeOptimizationRequest): Promise<string> {
  try {
    const response = await fetch('/api/ai/code-optimization', {
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
    return data.optimizedCode;
  } catch (error) {
    console.error('Error getting code optimization:', error);
    throw error;
  }
}