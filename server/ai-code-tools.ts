import { Request, Response } from 'express';
import OpenAI from 'openai';

// Lazy singleton — boot must succeed even if OPENAI_API_KEY is unset.
// First call to a route in this module is where the missing-key error surfaces.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Interface for code suggestion request
 */
interface CodeSuggestionRequest {
  prompt: string;
  language?: string;
  maxTokens?: number;
}

/**
 * Interface for code explanation request
 */
interface CodeExplanationRequest {
  code: string;
  language?: string;
}

/**
 * Interface for code optimization request
 */
interface CodeOptimizationRequest {
  code: string;
  language: string;
  focus?: 'performance' | 'readability' | 'security' | 'all';
}

/**
 * Generate code suggestion based on prompt using GPT-3.5
 */
export async function generateCodeSuggestion(req: Request, res: Response) {
  try {
    const { prompt, language, maxTokens = 500 } = req.body as CodeSuggestionRequest;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create appropriate system message based on language
    let systemMessage = `You are an expert coding assistant proficient in all programming languages.`;
    if (language) {
      systemMessage += ` The user wants code in ${language}. Provide only the code without explanations unless asked.`;
    }

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
    });

    const suggestion = response.choices[0].message.content?.trim() || '';
    
    res.json({ suggestion });
  } catch (error: any) {
    console.error('Error generating code suggestion:', error);
    res.status(500).json({ error: error.message || 'Failed to generate code suggestion' });
  }
}

/**
 * Explain code using GPT-3.5
 */
export async function explainCode(req: Request, res: Response) {
  try {
    const { code, language } = req.body as CodeExplanationRequest;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Create system message
    let systemMessage = `You are an expert coding tutor who explains code clearly and concisely.`;
    if (language) {
      systemMessage += ` The code is written in ${language}.`;
    }
    systemMessage += ` Explain the code in a way that helps beginners understand the concepts. Break down complex parts.`;

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Explain this code:\n\n${code}` }
      ],
      max_tokens: 1000,
    });

    const explanation = response.choices[0].message.content?.trim() || '';
    
    res.json({ explanation });
  } catch (error: any) {
    console.error('Error explaining code:', error);
    res.status(500).json({ error: error.message || 'Failed to explain code' });
  }
}

/**
 * Optimize code using GPT-3.5
 */
export async function optimizeCode(req: Request, res: Response) {
  try {
    const { code, language, focus = 'all' } = req.body as CodeOptimizationRequest;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Create system message based on optimization focus
    let systemMessage = `You are an expert code optimizer specializing in ${language}.`;
    
    switch (focus) {
      case 'performance':
        systemMessage += ` Focus on optimizing the code for maximum performance. Consider time complexity, memory usage, and efficient algorithms.`;
        break;
      case 'readability':
        systemMessage += ` Focus on improving code readability. Consider naming conventions, code structure, and clear documentation.`;
        break;
      case 'security':
        systemMessage += ` Focus on improving code security. Identify and fix potential vulnerabilities and ensure secure coding practices.`;
        break;
      case 'all':
      default:
        systemMessage += ` Optimize the code for performance, readability, and security while maintaining its functionality.`;
    }

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Optimize this ${language} code:\n\n${code}` }
      ],
      max_tokens: 1500,
    });

    const optimizedCode = response.choices[0].message.content?.trim() || '';
    
    res.json({ optimizedCode });
  } catch (error: any) {
    console.error('Error optimizing code:', error);
    res.status(500).json({ error: error.message || 'Failed to optimize code' });
  }
}