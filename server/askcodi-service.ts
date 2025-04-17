import { Request, Response } from 'express';
import fetch from 'node-fetch';

// AskCodi API base URL
const ASKCODI_API_URL = 'https://api.askcodi.com';
const ASKCODI_API_KEY = process.env.ASKCODI_API_KEY;

// Check if AskCodi API key is configured
function checkAskCodiConfiguration(res: Response): boolean {
  if (!ASKCODI_API_KEY) {
    res.status(500).json({ 
      error: 'AskCodi API is not configured. Please add the ASKCODI_API_KEY to the environment variables.' 
    });
    return false;
  }
  return true;
}

/**
 * Interface for code generation request
 */
interface CodeGenerationRequest {
  prompt: string;
  model?: string;  // Default to a specific model if not provided
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
export async function generateCode(req: Request, res: Response) {
  if (!checkAskCodiConfiguration(res)) return;

  try {
    const { prompt, model = 'default', maxTokens = 500, temperature = 0.7 } = req.body as CodeGenerationRequest;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch(`${ASKCODI_API_URL}/code-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ASKCODI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        model,
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json({ code: data.code });
  } catch (error: any) {
    console.error('Error generating code with AskCodi:', error);
    res.status(500).json({ error: error.message || 'Failed to generate code' });
  }
}

/**
 * Explain code using AskCodi API
 */
export async function explainCodeWithAskCodi(req: Request, res: Response) {
  if (!checkAskCodiConfiguration(res)) return;

  try {
    const { code, language, model = 'default' } = req.body as CodeExplanationRequest;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const response = await fetch(`${ASKCODI_API_URL}/code-explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ASKCODI_API_KEY}`
      },
      body: JSON.stringify({
        code,
        language,
        model
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json({ explanation: data.explanation });
  } catch (error: any) {
    console.error('Error explaining code with AskCodi:', error);
    res.status(500).json({ error: error.message || 'Failed to explain code' });
  }
}

/**
 * Complete code using AskCodi API
 */
export async function completeCode(req: Request, res: Response) {
  if (!checkAskCodiConfiguration(res)) return;

  try {
    const { code, language, model = 'default', maxTokens = 200, temperature = 0.7 } = req.body as CodeCompletionRequest;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const response = await fetch(`${ASKCODI_API_URL}/code-completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ASKCODI_API_KEY}`
      },
      body: JSON.stringify({
        code,
        language,
        model,
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json({ completion: data.completion });
  } catch (error: any) {
    console.error('Error completing code with AskCodi:', error);
    res.status(500).json({ error: error.message || 'Failed to complete code' });
  }
}

/**
 * Get available models from AskCodi API
 */
export async function getModels(req: Request, res: Response) {
  if (!checkAskCodiConfiguration(res)) return;

  try {
    const response = await fetch(`${ASKCODI_API_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ASKCODI_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json({ models: data.models });
  } catch (error: any) {
    console.error('Error fetching AskCodi models:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch models' });
  }
}