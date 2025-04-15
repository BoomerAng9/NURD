// OpenAI Service for Accessibility Features
// This service handles AI-powered accessibility enhancements

import { queryClient } from '@/lib/queryClient';
const API_ENDPOINT = '/api/accessibility';

// Interface for simplified content request
export interface SimplifyContentRequest {
  content: string;
  level: 'easy' | 'medium' | 'advanced';
  format?: 'short' | 'detailed';
}

// Interface for text-to-speech request
export interface TextToSpeechRequest {
  content: string;
  voice?: 'default' | 'clear' | 'slow';
}

// Interface for image description request
export interface DescribeImageRequest {
  imageUrl: string;
  detailLevel?: 'basic' | 'detailed';
}

// Interface for content explanation request
export interface ExplainContentRequest {
  content: string;
  context?: string;
  type?: 'code' | 'math' | 'concept' | 'general';
}

// Simplify content to make it more accessible
export async function simplifyContent(data: SimplifyContentRequest): Promise<{ simplified: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/simplify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error simplifying content:', error);
    throw error;
  }
}

// Get text-to-speech conversion
export async function getTextToSpeech(data: TextToSpeechRequest): Promise<{ audioUrl: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting text-to-speech:', error);
    throw error;
  }
}

// Get AI-generated description of an image
export async function describeImage(data: DescribeImageRequest): Promise<{ description: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/describe-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error describing image:', error);
    throw error;
  }
}

// Get AI-powered explanation of complex content
export async function explainContent(data: ExplainContentRequest): Promise<{ explanation: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error explaining content:', error);
    throw error;
  }
}