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
 * Generate code using AskCodi API with updated endpoint
 */
export async function generateCode(req: Request, res: Response) {
  try {
    if (!checkAskCodiConfiguration(res)) return;

    const { prompt, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeGenerationRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use updated AskCodi API endpoint
    const response = await axios.post(
      'https://api.askcodi.com/v1/chat/completions',
      {
        model: model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert programmer. Generate clean, well-commented, and efficient code based on the user\'s request. Include only the code and necessary comments.' },
          { role: 'user', content: `Generate code for: ${prompt}` }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices && response.data.choices[0] && response.data.choices[0].message
      ? response.data.choices[0].message.content
      : '';

    return res.json({ result });
  } catch (error) {
    console.error('Error generating code with AskCodi API:', error);
    
    try {
      // Fallback to OpenAI if AskCodi fails
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'Both AskCodi and OpenAI API keys are not functioning' });
      }

      const { prompt, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeGenerationRequest;
      
      // Use OpenAI API as fallback
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemMessage = "You are an expert programmer. Generate clean, well-commented, and efficient code based on the user's request. Include only the code and necessary comments.";

      // Make request to OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Generate code for: ${prompt}` }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      // Extract the code from the response
      const codeResult = response.choices[0]?.message?.content || '';
      return res.json({ 
        result: codeResult,
        source: 'openai_fallback'
      });
    } catch (fallbackError) {
      console.error('Fallback to OpenAI also failed:', fallbackError);
      return res.status(500).json({ 
        error: 'Error generating code with both AskCodi and OpenAI', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}

/**
 * Explain code using AskCodi API with updated endpoint
 */
export async function explainCodeWithAskCodi(req: Request, res: Response) {
  try {
    if (!checkAskCodiConfiguration(res)) return;

    const { code, language, model } = req.body as CodeExplanationRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // Use updated AskCodi API endpoint
    const response = await axios.post(
      'https://api.askcodi.com/v1/chat/completions',
      {
        model: model || 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: "You are an expert programmer and educator. Explain the provided code clearly, focusing on what it does, how it works, and why it's structured that way. Make your explanation accessible for students learning to code." 
          },
          { 
            role: 'user', 
            content: `Explain this ${language || 'code'} code in simple terms:\n\n${code}` 
          }
        ],
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices && response.data.choices[0] && response.data.choices[0].message
      ? response.data.choices[0].message.content
      : '';

    return res.json({ result });
  } catch (error) {
    console.error('Error explaining code with AskCodi API:', error);
    
    try {
      // Fallback to OpenAI if AskCodi fails
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'Both AskCodi and OpenAI API keys are not functioning' });
      }

      const { code, language, model } = req.body as CodeExplanationRequest;
      
      // Use OpenAI API as fallback
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Prepare the system message to indicate this is for code explanation
      const systemMessage = "You are an expert programmer and educator. Explain the provided code clearly, focusing on what it does, how it works, and why it's structured that way. Make your explanation accessible for students learning to code.";

      // Make request to OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Explain this ${language || 'code'} code:\n\n${code}` }
        ],
        temperature: 0.5,
      });

      // Extract the explanation from the response
      const explanation = response.choices[0]?.message?.content || '';
      return res.json({ 
        result: explanation,
        source: 'openai_fallback'
      });
    } catch (fallbackError) {
      console.error('Fallback to OpenAI also failed:', fallbackError);
      return res.status(500).json({ 
        error: 'Error explaining code with both AskCodi and OpenAI', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}

/**
 * Complete code using AskCodi API with updated endpoint
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
    
    // Use updated AskCodi API endpoint
    const response = await axios.post(
      'https://api.askcodi.com/v1/chat/completions',
      {
        model: model || 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert ${language} programmer. Complete the code snippet provided by the user in a way that satisfies the implied functionality. Return only the completed code, not an explanation.` 
          },
          { 
            role: 'user', 
            content: `Complete this ${language} code snippet. Provide a full implementation that would work:\n\n${code}` 
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices && response.data.choices[0] && response.data.choices[0].message
      ? response.data.choices[0].message.content
      : '';

    return res.json({ result });
  } catch (error) {
    console.error('Error completing code with AskCodi API:', error);
    
    try {
      // Fallback to OpenAI if AskCodi fails
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'Both AskCodi and OpenAI API keys are not functioning' });
      }

      const { code, language, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeCompletionRequest;
      
      // Use OpenAI API as fallback
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Prepare the system message to indicate this is for code completion
      const systemMessage = `You are an expert ${language} programmer. Complete the code snippet provided by the user in a way that satisfies the implied functionality. Return only the completed code, not an explanation.`;

      // Make request to OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Complete this ${language} code:\n\n${code}` }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      // Extract the completion from the response
      const completion = response.choices[0]?.message?.content || '';
      return res.json({ 
        result: completion,
        source: 'openai_fallback'
      });
    } catch (fallbackError) {
      console.error('Fallback to OpenAI also failed:', fallbackError);
      return res.status(500).json({ 
        error: 'Error completing code with both AskCodi and OpenAI', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}

/**
 * Get available models from AskCodi API
 */
export async function getModels(req: Request, res: Response) {
  try {
    if (!checkAskCodiConfiguration(res)) return;

    try {
      const response = await axios.get(
        'https://api.askcodi.com/v1/models/list',
        {
          headers: {
            'Authorization': `Bearer ${process.env.ASKCODI_API_KEY}`,
          },
        }
      );

      // Extract model names from the API response
      const models = response.data.data && Array.isArray(response.data.data) 
        ? response.data.data.map((model: any) => model.id || model.name) 
        : [];

      return res.json({ models });
    } catch (apiError) {
      console.warn('Could not fetch models from AskCodi API, returning default models instead:', apiError);
      
      // Return default models instead of error
      const defaultModels = [
        'gpt-3.5-turbo',
        'claude-instant-1',
        'mistral-tiny',
        'gemini-pro',
        'llama-2'
      ];
      
      return res.json({ 
        models: defaultModels,
        source: 'default' 
      });
    }
  } catch (error) {
    console.error('Unexpected error in getModels:', error);
    
    // Even in case of unexpected errors, return default models
    const fallbackModels = [
      'gpt-3.5-turbo',
      'claude-instant-1',
      'mistral-tiny'
    ];
    
    return res.json({ 
      models: fallbackModels,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}