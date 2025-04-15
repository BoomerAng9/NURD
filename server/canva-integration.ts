import { Request, Response } from 'express';
import axios from 'axios';

// Constants for Canva API
const CANVA_API_BASE_URL = 'https://api.canva.com/v1';

/**
 * Interface for Canva authentication
 */
interface CanvaAuth {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Interface for design retrieval
 */
interface CanvaDesignRequest {
  designId: string;
}

/**
 * Interface for design creation request
 */
interface CanvaCreateDesignRequest {
  templateId?: string;
  title: string;
  folderId?: string;
  elements?: any[];
}

/**
 * Get Canva API configuration
 */
function getCanvaConfig(): CanvaAuth {
  return {
    apiKey: process.env.CANVA_API_KEY || '',
    clientId: process.env.CANVA_CLIENT_ID || '',
    clientSecret: process.env.CANVA_CLIENT_SECRET || '',
    redirectUri: process.env.CANVA_REDIRECT_URI || '',
  };
}

/**
 * Initialize Canva API client
 */
async function getCanvaClient() {
  const config = getCanvaConfig();
  
  if (!config.apiKey || !config.clientId || !config.clientSecret) {
    throw new Error('Canva API credentials are not configured');
  }
  
  // Create axios instance with Canva API configuration
  const client = axios.create({
    baseURL: CANVA_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    }
  });
  
  return client;
}

/**
 * Initiate Canva OAuth flow
 */
export async function initiateCanvaAuth(req: Request, res: Response) {
  try {
    const config = getCanvaConfig();
    
    if (!config.clientId || !config.redirectUri) {
      return res.status(500).json({ 
        error: 'Canva API credentials are not configured' 
      });
    }
    
    const authUrl = `https://www.canva.com/oauth/authorize?` +
      `client_id=${config.clientId}` +
      `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
      `&response_type=code` +
      `&scope=designs:read designs:write`;
    
    return res.json({ authUrl });
  } catch (error) {
    console.error('Error initiating Canva auth:', error);
    return res.status(500).json({ error: 'Failed to initiate Canva authentication' });
  }
}

/**
 * Handle Canva OAuth callback
 */
export async function handleCanvaCallback(req: Request, res: Response) {
  try {
    const { code } = req.query;
    const config = getCanvaConfig();
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing' });
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.canva.com/oauth/token', {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    });
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Store tokens in session or database
    // This is a simplified example - in production, you would securely store these tokens
    if (req.session) {
      (req.session as any).canvaTokens = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + (expires_in * 1000),
      };
    }
    
    return res.redirect('/canva-integration');
  } catch (error) {
    console.error('Error handling Canva callback:', error);
    return res.status(500).json({ error: 'Failed to complete Canva authentication' });
  }
}

/**
 * Get user's Canva designs
 */
export async function getCanvaDesigns(req: Request, res: Response) {
  try {
    const client = await getCanvaClient();
    
    // Get user designs from Canva API
    const response = await client.get('/designs');
    
    return res.json(response.data);
  } catch (error) {
    console.error('Error getting Canva designs:', error);
    return res.status(500).json({ error: 'Failed to get Canva designs' });
  }
}

/**
 * Get a specific Canva design
 */
export async function getCanvaDesign(req: Request, res: Response) {
  try {
    const { designId } = req.params;
    const client = await getCanvaClient();
    
    if (!designId) {
      return res.status(400).json({ error: 'Design ID is required' });
    }
    
    // Get specific design from Canva API
    const response = await client.get(`/designs/${designId}`);
    
    return res.json(response.data);
  } catch (error) {
    console.error('Error getting Canva design:', error);
    return res.status(500).json({ error: 'Failed to get Canva design' });
  }
}

/**
 * Create a new Canva design
 */
export async function createCanvaDesign(req: Request, res: Response) {
  try {
    const { title, templateId, folderId, elements } = req.body;
    const client = await getCanvaClient();
    
    if (!title) {
      return res.status(400).json({ error: 'Design title is required' });
    }
    
    // Create design payload
    const designPayload: CanvaCreateDesignRequest = {
      title,
    };
    
    if (templateId) designPayload.templateId = templateId;
    if (folderId) designPayload.folderId = folderId;
    if (elements) designPayload.elements = elements;
    
    // Create design via Canva API
    const response = await client.post('/designs', designPayload);
    
    return res.json(response.data);
  } catch (error) {
    console.error('Error creating Canva design:', error);
    return res.status(500).json({ error: 'Failed to create Canva design' });
  }
}

/**
 * Create an embedded Canva design editor URL
 */
export async function getCanvaEditorUrl(req: Request, res: Response) {
  try {
    const { designId } = req.query;
    const config = getCanvaConfig();
    
    if (!designId) {
      return res.status(400).json({ error: 'Design ID is required' });
    }
    
    // Generate embedded editor URL
    const embedUrl = `https://www.canva.com/design/${designId}/edit?embed=true&ui=true`;
    
    return res.json({ embedUrl });
  } catch (error) {
    console.error('Error generating Canva editor URL:', error);
    return res.status(500).json({ error: 'Failed to generate Canva editor URL' });
  }
}