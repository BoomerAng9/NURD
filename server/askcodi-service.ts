import { Request, Response } from 'express';
import axios from 'axios';

/**
 * Check if AskCodi API key is configured
 */
function checkAskCodiConfiguration(res: Response): boolean {
  if (!process.env.ASKCODI_API_KEY) {
    res.status(500).json({ error: 'AskCodi API key is not configured' });
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
  try {
    if (!checkAskCodiConfiguration(res)) return;

    const { prompt, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeGenerationRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      'https://api.askcodi.com/v1/code/generate',
      {
        prompt,
        model: model || 'gpt-4o-mini', // Default model
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    return res.json({ result: response.data.choices[0].text });
  } catch (error) {
    console.error('Error generating code with AskCodi API:', error);
    return res.status(500).json({ 
      error: 'Error generating code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Explain code using AskCodi API
 */
export async function explainCodeWithAskCodi(req: Request, res: Response) {
  try {
    if (!checkAskCodiConfiguration(res)) return;

    const { code, language, model } = req.body as CodeExplanationRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const response = await axios.post(
      'https://api.askcodi.com/v1/code/explain',
      {
        code,
        language: language || 'javascript',
        model: model || 'claude-3-5-sonnet',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    return res.json({ result: response.data.explanation });
  } catch (error) {
    console.error('Error explaining code with AskCodi API:', error);
    return res.status(500).json({ 
      error: 'Error explaining code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Complete code using AskCodi API
 */
export async function completeCode(req: Request, res: Response) {
  try {
    if (!checkAskCodiConfiguration(res)) return;

    const { code, language, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeCompletionRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!language) {
      return res.status(400).json({ error: 'Language is required' });
    }

    const response = await axios.post(
      'https://api.askcodi.com/v1/code/complete',
      {
        code,
        language,
        model: model || 'gemini-1.5-flash',
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    return res.json({ result: response.data.choices[0].text });
  } catch (error) {
    console.error('Error completing code with AskCodi API:', error);
    return res.status(500).json({ 
      error: 'Error completing code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Get available models from AskCodi API
 */
export async function getModels(req: Request, res: Response) {
  try {
    if (!checkAskCodiConfiguration(res)) return;

    const response = await axios.get(
      'https://api.askcodi.com/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    return res.json({ models: response.data.models });
  } catch (error) {
    console.error('Error getting models from AskCodi API:', error);
    return res.status(500).json({ 
      error: 'Error retrieving models', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}