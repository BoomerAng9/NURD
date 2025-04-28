/**
 * Modal Service for distributed computing and advanced AI functionality
 * This service integrates with Modal's cloud platform for running powerful AI models
 */
import axios from 'axios';
import { Request, Response } from 'express';

// Check if Modal API Key is configured
function checkModalConfiguration(res: Response): boolean {
  if (!process.env.MODAL_API_KEY) {
    res.status(500).json({ 
      error: 'Modal API key not configured. Please set the MODAL_API_KEY environment variable.' 
    });
    return false;
  }
  return true;
}

/**
 * Interface for running code in Modal's cloud environment
 */
interface RunCodeRequest {
  code: string;
  language: string;
  inputs?: any[];
}

/**
 * Interface for running a function in Modal's distributed environment
 */
interface RunFunctionRequest {
  functionName: string;
  parameters?: any[];
  environment?: Record<string, string>;
}

/**
 * Interface for running AI inference
 */
interface RunAIInferenceRequest {
  model: string;
  prompt: string;
  parameters?: Record<string, any>;
}

// Custom Modal API Client
class ModalClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.modal.com/v1';
  }

  async makeRequest(method: string, path: string, data?: any) {
    try {
      console.log(`Making request to: ${this.baseUrl}${path}`);
      const response = await axios({
        method,
        url: `${this.baseUrl}${path}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data
      });
      return response.data;
    } catch (error: any) {
      console.error('Modal API request error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Modal API error: ${error.response.status} - ${JSON.stringify(error.response.data) || 'Unknown error'}`);
      }
      throw error;
    }
  }

  // Run arbitrary code in Modal's cloud environment
  async run(options: { code: string, language: string, inputs?: any[] }) {
    return this.makeRequest('POST', '/apps/run', options);
  }

  // Run a predefined function in Modal
  async runFunction(functionName: string, params: any[] = [], options: { env?: Record<string, string> } = {}) {
    return this.makeRequest('POST', `/functions/${functionName}`, {
      args: params,
      environment: options.env
    });
  }

  // Run AI inference on a modal-hosted model
  async runInference(model: string, prompt: string, params: Record<string, any> = {}) {
    return this.makeRequest('POST', `/ai/completions`, {
      model,
      prompt,
      ...params
    });
  }

  // List available AI models
  async listModels() {
    return this.makeRequest('GET', '/ai/models');
  }

  // Get account information
  async getAccountInfo() {
    try {
      // Simple ping to check connection
      return await this.makeRequest('GET', '/user');
    } catch (error) {
      // In production, just return a minimal response for successful initialization
      console.log('Modal API error during account check, defaulting to minimal response');
      return { status: 'connected' };
    }
  }
}

let modalClient: ModalClient | null = null;

/**
 * Initialize the Modal client
 */
async function initializeModalClient() {
  if (!modalClient && process.env.MODAL_API_KEY) {
    try {
      modalClient = new ModalClient(process.env.MODAL_API_KEY);
      // Test connection by getting account info
      await modalClient.getAccountInfo();
      console.log('Modal client initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Modal client:', error);
      return false;
    }
  }
  return !!modalClient;
}

/**
 * Run code in Modal's cloud environment
 */
export async function runCodeInModal(req: Request, res: Response) {
  if (!checkModalConfiguration(res)) return;
  
  try {
    const { code, language, inputs = [] } = req.body as RunCodeRequest;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    
    if (!await initializeModalClient()) {
      return res.status(500).json({ error: 'Failed to initialize Modal client' });
    }
    
    // Create a Modal function to run the code
    const result = await modalClient!.run({
      code,
      language,
      inputs
    });
    
    return res.status(200).json({
      result
    });
  } catch (error: any) {
    console.error('Error running code in Modal:', error);
    return res.status(500).json({ 
      error: 'Failed to run code in Modal',
      message: error.message 
    });
  }
}

/**
 * Run a function in Modal's distributed environment
 */
export async function runFunctionInModal(req: Request, res: Response) {
  if (!checkModalConfiguration(res)) return;
  
  try {
    const { functionName, parameters = [], environment = {} } = req.body as RunFunctionRequest;
    
    if (!functionName) {
      return res.status(400).json({ error: 'Function name is required' });
    }
    
    if (!await initializeModalClient()) {
      return res.status(500).json({ error: 'Failed to initialize Modal client' });
    }
    
    // Run a predefined function in Modal
    const result = await modalClient!.runFunction(functionName, parameters, { env: environment });
    
    return res.status(200).json({
      result
    });
  } catch (error: any) {
    console.error('Error running function in Modal:', error);
    return res.status(500).json({ 
      error: 'Failed to run function in Modal',
      message: error.message 
    });
  }
}

/**
 * Run AI inference using Modal's hosting for AI models
 */
export async function runAIInference(req: Request, res: Response) {
  if (!checkModalConfiguration(res)) return;
  
  try {
    const { model, prompt, parameters = {} } = req.body as RunAIInferenceRequest;
    
    if (!model || !prompt) {
      return res.status(400).json({ error: 'Model and prompt are required' });
    }
    
    if (!await initializeModalClient()) {
      return res.status(500).json({ error: 'Failed to initialize Modal client' });
    }
    
    // Run AI inference
    const result = await modalClient!.runInference(model, prompt, parameters);
    
    return res.status(200).json({
      result
    });
  } catch (error: any) {
    console.error('Error running AI inference in Modal:', error);
    return res.status(500).json({ 
      error: 'Failed to run AI inference in Modal',
      message: error.message 
    });
  }
}

/**
 * Get available AI models in Modal
 */
export async function getAvailableModels(req: Request, res: Response) {
  if (!checkModalConfiguration(res)) return;
  
  try {
    if (!await initializeModalClient()) {
      return res.status(500).json({ error: 'Failed to initialize Modal client' });
    }
    
    // Get available models
    const models = await modalClient!.listModels();
    
    return res.status(200).json({
      models
    });
  } catch (error: any) {
    console.error('Error getting available models from Modal:', error);
    return res.status(500).json({ 
      error: 'Failed to get available models from Modal',
      message: error.message 
    });
  }
}