// AskCodi service for AI code tools
import { askCodiTools } from './api-service';

/**
 * Generate code using AskCodi API
 */
export async function getCodeGenerationWithAskCodi({
  prompt,
  model = 'default',
  maxTokens = 500,
  temperature = 0.7
}: {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  try {
    const response = await askCodiTools.generateCode(prompt, model, maxTokens, temperature);
    return response.code;
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
  model = 'default'
}: {
  code: string;
  language?: string;
  model?: string;
}): Promise<string> {
  try {
    const response = await askCodiTools.explainCode(code, language, model);
    return response.explanation;
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
  model = 'default',
  maxTokens = 200,
  temperature = 0.7
}: {
  code: string;
  language: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  try {
    const response = await askCodiTools.completeCode(code, language, model, maxTokens, temperature);
    return response.completion;
  } catch (error) {
    console.error('Error completing code with AskCodi:', error);
    throw error;
  }
}

/**
 * Get available AskCodi models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await askCodiTools.getModels();
    return response.models;
  } catch (error) {
    console.error('Error fetching AskCodi models:', error);
    throw error;
  }
}

// Export all functions
export default {
  getCodeGenerationWithAskCodi,
  getCodeExplanationWithAskCodi,
  getCodeCompletionWithAskCodi,
  getAvailableModels
};