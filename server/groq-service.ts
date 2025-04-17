import { Request, Response } from 'express';
import Groq from 'groq-sdk';

/**
 * Check if GROQ API key is configured
 */
function checkGroqConfiguration(res: Response): boolean {
  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: 'GROQ API key is not configured' });
    return false;
  }
  return true;
}

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
 * Generate code using GROQ API with Llama 3 or Mistral models
 */
export async function generateCodeWithGroq(req: Request, res: Response) {
  try {
    if (!checkGroqConfiguration(res)) return;

    const { prompt, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeGenerationRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Initialize GROQ client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemMessage = "You are an expert programmer. Generate clean, well-commented, and efficient code based on the user's request. Include only the code and necessary comments.";

    console.log("Generating code with GROQ using prompt:", prompt);
    
    // Make request to GROQ API with preferred model
    const response = await groq.chat.completions.create({
      model: model || 'llama3-70b-8192', // Default to Llama 3 70B
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Generate code for: ${prompt}` }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    // Extract the code from the response
    const codeResult = response.choices[0]?.message?.content || '';
    console.log("GROQ response received successfully");
    
    return res.json({ 
      result: codeResult,
      source: 'groq'
    });
  } catch (error) {
    console.error('Error generating code with GROQ:', error);
    return res.status(500).json({ 
      error: 'Error generating code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Explain code using GROQ API
 */
export async function explainCodeWithGroq(req: Request, res: Response) {
  try {
    if (!checkGroqConfiguration(res)) return;

    const { code, language, model } = req.body as CodeExplanationRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // Initialize GROQ client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Prepare the system message to indicate this is for code explanation
    const systemMessage = "You are an expert programmer and educator. Explain the provided code clearly, focusing on what it does, how it works, and why it's structured that way. Make your explanation accessible for students learning to code.";

    console.log("Explaining code with GROQ, language:", language);
    
    // Make request to GROQ API
    const response = await groq.chat.completions.create({
      model: model || 'llama3-70b-8192', // Default to Llama 3 70B
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Explain this ${language || 'code'} code in simple terms:\n\n${code}` }
      ],
      temperature: 0.5,
    });

    // Extract the explanation from the response
    const explanation = response.choices[0]?.message?.content || '';
    console.log("GROQ explanation response received successfully");
    
    return res.json({ 
      result: explanation,
      source: 'groq'
    });
  } catch (error) {
    console.error('Error explaining code with GROQ:', error);
    return res.status(500).json({ 
      error: 'Error explaining code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Complete code using GROQ API
 */
export async function completeCodeWithGroq(req: Request, res: Response) {
  try {
    if (!checkGroqConfiguration(res)) return;

    const { code, language, model, maxTokens = 2048, temperature = 0.7 } = req.body as CodeCompletionRequest;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!language) {
      return res.status(400).json({ error: 'Language is required' });
    }
    
    // Initialize GROQ client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Prepare the system message to indicate this is for code completion
    const systemMessage = `You are an expert ${language} programmer. Complete the code snippet provided by the user in a way that satisfies the implied functionality. Return only the completed code, not an explanation.`;

    console.log("Completing code with GROQ, language:", language);
    
    // Make request to GROQ API
    const response = await groq.chat.completions.create({
      model: model || 'llama3-70b-8192', // Default to Llama 3 70B
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Complete this ${language} code snippet. Provide a full implementation that would work:\n\n${code}` }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    // Extract the completion from the response
    const completion = response.choices[0]?.message?.content || '';
    console.log("GROQ code completion response received successfully");
    
    return res.json({ 
      result: completion,
      source: 'groq'
    });
  } catch (error) {
    console.error('Error completing code with GROQ:', error);
    return res.status(500).json({ 
      error: 'Error completing code', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

/**
 * Get available GROQ models
 */
export async function getGroqModels(req: Request, res: Response) {
  try {
    // Check if we have a GROQ API key
    const hasGroqApi = !!process.env.GROQ_API_KEY;
    console.log('GROQ API key available:', hasGroqApi);
    
    // Return a curated list of GROQ models optimized for coding tasks
    const groqModels = [
      // Meta's Llama family
      'llama3-70b-8192',      // Llama 3 70B (most powerful)
      'llama3-8b-8192',       // Llama 3 8B (fast)
      'llama3.1-8b-8192',     // Llama 3.1 8B (fast and improved)
      'llama3.1-70b-8192',    // Llama 3.1 70B (most powerful and improved)
      'llama2-70b-4096',      // Legacy Llama 2 (fallback)
      
      // Mistral AI models
      'mistral-7b-instruct',  // Mistral 7B (fast)
      'mixtral-8x7b-32768',   // Mixtral 8x7B (powerful)
      'mixtral-8x22b-32768',  // Mixtral large (experimental)
      
      // Google models
      'gemma-7b-it',          // Gemma 7B
      
      // Stable models
      'stable-code-3b',       // Code-specific small model
    ];
    
    // Add category information for better organization
    const categorizedModels = {
      models: groqModels,
      categories: {
        'llama': ['llama3-70b-8192', 'llama3-8b-8192', 'llama3.1-8b-8192', 'llama3.1-70b-8192', 'llama2-70b-4096'],
        'mistral': ['mistral-7b-instruct', 'mixtral-8x7b-32768', 'mixtral-8x22b-32768'],
        'google': ['gemma-7b-it'],
        'stable': ['stable-code-3b']
      },
      source: hasGroqApi ? 'groq_api' : 'groq_static',
      apiStatus: hasGroqApi ? 'available' : 'unavailable',
      timestamp: new Date().toISOString()
    };
    
    console.log('Returning model list with', groqModels.length, 'models');
    return res.json(categorizedModels);
  } catch (error) {
    console.error('Unexpected error in getGroqModels:', error);
    
    // Even in case of unexpected errors, return default models
    const fallbackModels = [
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768'
    ];
    
    return res.json({ 
      models: fallbackModels,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorTimestamp: new Date().toISOString()
    });
  }
}