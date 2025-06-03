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
 * Generate code using OpenAI directly, using GPT-4 Nano
 */
export async function generateCode(req: Request, res: Response) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const { prompt, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeGenerationRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Use OpenAI API directly
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemMessage = "You are an expert programmer. Generate clean, well-commented, and efficient code based on the user's request. Include only the code and necessary comments.";

    console.log("Generating code with OpenAI using prompt:", prompt);
    
    // Make request to OpenAI API with GPT-4 Nano (gpt-4-1106-preview)
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // Using GPT-4 Nano as requested
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Generate code for: ${prompt}` }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    // Extract the code from the response
    const codeResult = response.choices[0]?.message?.content || '';
    console.log("OpenAI response received successfully");
    
    return res.json({ 
      result: codeResult,
      source: 'openai'
    });
  } catch (error) {
    console.error('Error generating code with OpenAI:', error);
    return res.status(500).json({ 
      error: 'Error generating code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Explain code using OpenAI API and GPT-4 Nano
 */
export async function explainCodeWithAskCodi(req: Request, res: Response) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const { code, language, model } = req.body as CodeExplanationRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // Use OpenAI API directly
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare the system message to indicate this is for code explanation
    const systemMessage = "You are an expert programmer and educator. Explain the provided code clearly, focusing on what it does, how it works, and why it's structured that way. Make your explanation accessible for students learning to code.";

    console.log("Explaining code with OpenAI, language:", language);
    
    // Make request to OpenAI API with GPT-4 Nano
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // Using GPT-4 Nano as requested
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Explain this ${language || 'code'} code in simple terms:\n\n${code}` }
      ],
      temperature: 0.5,
    });

    // Extract the explanation from the response
    const explanation = response.choices[0]?.message?.content || '';
    console.log("OpenAI explanation response received successfully");
    
    return res.json({ 
      result: explanation,
      source: 'openai'
    });
  } catch (error) {
    console.error('Error explaining code with OpenAI:', error);
    return res.status(500).json({ 
      error: 'Error explaining code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Complete code using OpenAI API with GPT-4 Nano model
 */
export async function completeCode(req: Request, res: Response) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const { code, language, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeCompletionRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!language) {
      return res.status(400).json({ error: 'Language is required' });
    }
    
    // Use OpenAI API directly
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare the system message to indicate this is for code completion
    const systemMessage = `You are an expert ${language} programmer. Complete the code snippet provided by the user in a way that satisfies the implied functionality. Return only the completed code, not an explanation.`;

    console.log("Completing code with OpenAI, language:", language);
    
    // Make request to OpenAI API with GPT-4 Nano model
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // Using GPT-4 Nano as requested
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Complete this ${language} code snippet. Provide a full implementation that would work:\n\n${code}` }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    // Extract the completion from the response
    const completion = response.choices[0]?.message?.content || '';
    console.log("OpenAI code completion response received successfully");
    
    return res.json({ 
      result: completion,
      source: 'openai'
    });
  } catch (error) {
    console.error('Error completing code with OpenAI:', error);
    return res.status(500).json({ 
      error: 'Error completing code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Get available OpenAI models
 */
export async function getModels(req: Request, res: Response) {
  try {
    // Return OpenAI models directly instead of fetching from AskCodi
    const openaiModels = [
      'gpt-4-1106-preview', // GPT-4 Nano (primary)
      'gpt-3.5-turbo',      // GPT-3.5 Turbo (fallback)
    ];
    
    return res.json({ 
      models: openaiModels,
      source: 'openai_static'
    });
  } catch (error) {
    console.error('Unexpected error in getModels:', error);
    
    // Even in case of unexpected errors, return default models
    const fallbackModels = [
      'gpt-4-1106-preview',
      'gpt-3.5-turbo'
    ];
    
    return res.json({ 
      models: fallbackModels,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}