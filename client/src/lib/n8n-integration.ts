import { apiRequest } from './queryClient';

// Cast the API response to our expected types
// The apiRequest function returns a Response object that we need to cast to our expected types
function parseApiResponse<T>(response: any): T {
  return response as unknown as T;
}

// Interface for n8n webhook configuration
export interface N8nWebhook {
  id: string;
  name: string;
  endpoint: string;
  webhookId: string;
  isActive: boolean;
}

// Interface for n8n workflow configurations
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  nodes?: any[];
  connections?: any;
}

// Interface for an agent configuration
export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  workflowId?: string;
  discordIntegration?: {
    channelId: string;
    botToken?: string;
    enabled: boolean;
  };
  youtubeIntegration?: {
    channelId: string;
    apiKey?: string;
    enabled: boolean;
  };
  openNoteIntegration?: {
    notebookId: string;
    apiKey?: string;
    enabled: boolean;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// N8n API Class
export class N8nApi {
  private apiUrl: string;
  private apiKey: string | null = null;

  constructor(apiUrl: string = '', apiKey: string | null = null) {
    this.apiUrl = apiUrl || import.meta.env.VITE_N8N_API_URL || '';
    this.apiKey = apiKey || import.meta.env.VITE_N8N_API_KEY || null;
  }

  // Set or update API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Check if the API is configured
  isConfigured(): boolean {
    return Boolean(this.apiUrl && this.apiKey);
  }

  // Generic API request handler that includes the API key
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('N8n API is not configured. Please set the API URL and API Key.');
    }

    const url = `${this.apiUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-N8N-API-KEY'] = this.apiKey;
    }

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`N8n API error (${response.status}): ${errorData.message || response.statusText}`);
      }
      
      const responseData = await response.json();
      return responseData as T;
    } catch (error) {
      console.error('N8n API request failed:', error);
      throw error;
    }
  }

  // Get all workflows
  async getWorkflows(): Promise<N8nWorkflow[]> {
    return this.request<N8nWorkflow[]>('/workflows');
  }

  // Get a specific workflow by ID
  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>(`/workflows/${id}`);
  }

  // Create a new workflow
  async createWorkflow(workflow: Omit<N8nWorkflow, 'id'>): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>('/workflows', 'POST', workflow);
  }

  // Activate/deactivate a workflow
  async toggleWorkflowActive(id: string, active: boolean): Promise<N8nWorkflow> {
    return this.request<N8nWorkflow>(`/workflows/${id}/active`, 'POST', { active });
  }

  // Execute a workflow now (trigger it)
  async executeWorkflow(id: string, data?: any): Promise<any> {
    return this.request<any>(`/workflows/${id}/execute`, 'POST', data);
  }

  // Get all webhooks
  async getWebhooks(): Promise<N8nWebhook[]> {
    return this.request<N8nWebhook[]>('/webhooks');
  }

  // Create a webhook for a workflow
  async createWebhook(workflowId: string, name: string): Promise<N8nWebhook> {
    return this.request<N8nWebhook>('/webhooks', 'POST', { workflowId, name });
  }

  // Create an agent using n8n
  async createAgent(config: AgentConfig): Promise<AgentConfig> {
    // First create a workflow for this agent
    const workflow = await this.createWorkflow({
      name: `Agent: ${config.name}`,
      active: config.isActive,
      nodes: [], // Would normally contain the node configuration
      connections: {}
    });
    
    // Attach the workflow ID to the agent config
    const agentWithWorkflow = {
      ...config,
      workflowId: workflow.id
    };
    
    // Save the agent config to your backend
    const response = await apiRequest('POST', '/api/agents', agentWithWorkflow);
    return parseApiResponse<AgentConfig>(response);
  }

  // Get all agents
  async getAgents(): Promise<AgentConfig[]> {
    const response = await apiRequest('GET', '/api/agents');
    return parseApiResponse<AgentConfig[]>(response);
  }

  // Update an agent
  async updateAgent(id: string, config: Partial<AgentConfig>): Promise<AgentConfig> {
    const response = await apiRequest('PUT', `/api/agents/${id}`, config);
    return parseApiResponse<AgentConfig>(response);
  }

  // Delete an agent
  async deleteAgent(id: string): Promise<void> {
    // First get the agent to find its workflow
    const response = await apiRequest('GET', `/api/agents/${id}`);
    const agent = parseApiResponse<AgentConfig>(response);
    
    if (agent?.workflowId) {
      // Deactivate the workflow first
      await this.toggleWorkflowActive(agent.workflowId, false);
      
      // Then delete it
      await this.request(`/workflows/${agent.workflowId}`, 'DELETE');
    }
    
    // Finally delete the agent from your backend
    await apiRequest('DELETE', `/api/agents/${id}`);
  }

  // Connect an agent to Discord
  async connectAgentToDiscord(
    agentId: string, 
    channelId: string, 
    botToken?: string
  ): Promise<AgentConfig> {
    const response = await apiRequest('PUT', `/api/agents/${agentId}/integrations/discord`, {
      channelId,
      botToken,
      enabled: true
    });
    return parseApiResponse<AgentConfig>(response);
  }

  // Connect an agent to YouTube
  async connectAgentToYouTube(
    agentId: string, 
    channelId: string, 
    apiKey?: string
  ): Promise<AgentConfig> {
    const response = await apiRequest('PUT', `/api/agents/${agentId}/integrations/youtube`, {
      channelId,
      apiKey,
      enabled: true
    });
    return parseApiResponse<AgentConfig>(response);
  }

  // Connect an agent to OpenNote
  async connectAgentToOpenNote(
    agentId: string, 
    notebookId: string, 
    apiKey?: string
  ): Promise<AgentConfig> {
    const response = await apiRequest('PUT', `/api/agents/${agentId}/integrations/opennote`, {
      notebookId,
      apiKey,
      enabled: true
    });
    return parseApiResponse<AgentConfig>(response);
  }
}

// Create and export a default instance
const n8nApi = new N8nApi();
export default n8nApi;