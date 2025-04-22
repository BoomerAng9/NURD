/**
 * Accessibility Services for NURD application
 * Provides client-side interactions with accessibility-related APIs
 */

// Code Narrator API interface
export interface CodeNarrationRequest {
  code: string;
  language: string;
  narrationLevel?: 'basic' | 'detailed' | 'teaching';
  includeAudio?: boolean;
  voiceStyle?: 'default' | 'clear' | 'slow';
}

export interface CodeNarrationResponse {
  narration: string;
  audioUrl?: string;
}

// Text-to-Speech API interface
export interface TextToSpeechRequest {
  content: string;
  voice?: 'default' | 'clear' | 'slow';
}

export interface TextToSpeechResponse {
  audioUrl: string;
}

// Image Description API interface
export interface ImageDescriptionRequest {
  imageUrl: string;
  detailLevel?: 'basic' | 'detailed';
}

export interface ImageDescriptionResponse {
  description: string;
}

// Content Explanation API interface
export interface ContentExplanationRequest {
  content: string;
  context?: string;
  type?: 'code' | 'math' | 'concept' | 'general';
}

export interface ContentExplanationResponse {
  explanation: string;
}

// Content Simplification API interface
export interface ContentSimplificationRequest {
  content: string;
  level: 'easy' | 'medium' | 'advanced';
  format?: 'short' | 'detailed';
}

export interface ContentSimplificationResponse {
  simplified: string;
}

/**
 * Get narration for code to improve accessibility
 */
export async function getNarration(params: CodeNarrationRequest): Promise<CodeNarrationResponse> {
  try {
    const response = await fetch('/api/accessibility/narrate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get code narration');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getNarration:', error);
    throw error;
  }
}

/**
 * Convert text to speech for accessibility
 */
export async function getTextToSpeech(params: TextToSpeechRequest): Promise<TextToSpeechResponse> {
  try {
    const response = await fetch('/api/accessibility/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to convert text to speech');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getTextToSpeech:', error);
    throw error;
  }
}

/**
 * Get AI-generated description of an image
 */
export async function getImageDescription(params: ImageDescriptionRequest): Promise<ImageDescriptionResponse> {
  try {
    const response = await fetch('/api/accessibility/describe-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get image description');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getImageDescription:', error);
    throw error;
  }
}

/**
 * Get AI-powered explanation of complex content
 */
export async function getContentExplanation(params: ContentExplanationRequest): Promise<ContentExplanationResponse> {
  try {
    const response = await fetch('/api/accessibility/explain-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get content explanation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getContentExplanation:', error);
    throw error;
  }
}

/**
 * Get simplified version of content for improved accessibility
 */
export async function getSimplifiedContent(params: ContentSimplificationRequest): Promise<ContentSimplificationResponse> {
  try {
    const response = await fetch('/api/accessibility/simplify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to simplify content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getSimplifiedContent:', error);
    throw error;
  }
}