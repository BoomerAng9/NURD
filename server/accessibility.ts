import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI SDK
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = 'gpt-4o';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Interface for simplify content request
 */
interface SimplifyContentRequest {
  content: string;
  level: 'easy' | 'medium' | 'advanced';
  format?: 'short' | 'detailed';
}

/**
 * Interface for text-to-speech request
 */
interface TextToSpeechRequest {
  content: string;
  voice?: 'default' | 'clear' | 'slow';
}

/**
 * Interface for image description request
 */
interface DescribeImageRequest {
  imageUrl: string;
  detailLevel?: 'basic' | 'detailed';
}

/**
 * Interface for content explanation request
 */
interface ExplainContentRequest {
  content: string;
  context?: string;
  type?: 'code' | 'math' | 'concept' | 'general';
}

/**
 * Interface for code narrator request
 */
interface CodeNarratorRequest {
  code: string;
  language: string;
  narrationLevel?: 'basic' | 'detailed' | 'teaching';
  includeAudio?: boolean;
  voiceStyle?: 'default' | 'clear' | 'slow';
}

/**
 * Simplify content to make it more accessible
 */
export async function simplifyContent(req: Request, res: Response) {
  try {
    const params = req.body as SimplifyContentRequest;

    if (!params.content) {
      return res.status(400).json({
        error: 'Missing required parameter: content'
      });
    }

    // Build prompt based on simplification level
    let simplificationPrompt = '';
    switch (params.level) {
      case 'easy':
        simplificationPrompt = 'Simplify this content for elementary school students. Use short sentences, basic vocabulary, and explain any complex terms.';
        break;
      case 'medium':
        simplificationPrompt = 'Adapt this content for middle school students. Balance simplicity with some field-specific terminology, explaining key concepts.';
        break;
      case 'advanced':
        simplificationPrompt = 'Maintain the technical accuracy while making this content more accessible. Clarify complex ideas but preserve domain-specific language.';
        break;
      default:
        simplificationPrompt = 'Make this content more accessible while preserving its meaning.';
    }

    // Add format instructions
    if (params.format === 'short') {
      simplificationPrompt += ' Create a condensed version that covers the main points.';
    } else if (params.format === 'detailed') {
      simplificationPrompt += ' Include detailed explanations while maintaining clarity.';
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an accessibility specialist who makes content more understandable for diverse learning needs.'
        },
        {
          role: 'user',
          content: `${simplificationPrompt}\n\nContent to simplify:\n${params.content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract the simplified content from the response
    const simplified = response.choices[0].message.content || '';

    return res.status(200).json({
      simplified
    });
  } catch (error) {
    console.error('Error in simplifyContent:', error);
    return res.status(500).json({
      error: `Failed to simplify content: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

/**
 * Get text-to-speech conversion
 */
export async function textToSpeech(req: Request, res: Response) {
  try {
    const params = req.body as TextToSpeechRequest;

    if (!params.content) {
      return res.status(400).json({
        error: 'Missing required parameter: content'
      });
    }

    // Determine voice settings based on request
    let voice = 'alloy'; // default voice
    let speed = 1.0; // default speed

    if (params.voice === 'clear') {
      voice = 'nova'; // clearer voice
    } else if (params.voice === 'slow') {
      speed = 0.8; // slower speed
    }

    // Call OpenAI API for text-to-speech
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: params.content,
      speed: speed,
    });

    // Convert audio data to base64 for client-side playback
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString('base64');

    // Return base64-encoded audio data with metadata
    return res.status(200).json({
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`
    });
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    return res.status(500).json({
      error: `Failed to convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

/**
 * Get AI-generated description of an image
 */
export async function describeImage(req: Request, res: Response) {
  try {
    const params = req.body as DescribeImageRequest;

    if (!params.imageUrl) {
      return res.status(400).json({
        error: 'Missing required parameter: imageUrl'
      });
    }

    // Determine detail level for image description
    const detailPrompt = params.detailLevel === 'detailed'
      ? 'Provide a detailed description of this image, including colors, objects, people, actions, and background elements.'
      : 'Describe this image concisely, focusing on the main subjects and actions.';

    // Call OpenAI API with the image
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an accessibility specialist who creates accurate and helpful image descriptions for visually impaired users.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: detailPrompt },
            {
              type: 'image_url',
              image_url: { url: params.imageUrl }
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract the image description from the response
    const description = response.choices[0].message.content || '';

    return res.status(200).json({
      description
    });
  } catch (error) {
    console.error('Error in describeImage:', error);
    return res.status(500).json({
      error: `Failed to describe image: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

/**
 * Get AI-powered explanation of complex content
 */
export async function explainContent(req: Request, res: Response) {
  try {
    const params = req.body as ExplainContentRequest;

    if (!params.content) {
      return res.status(400).json({
        error: 'Missing required parameter: content'
      });
    }

    // Build explanation prompt based on content type
    let explanationPrompt = '';
    switch (params.type) {
      case 'code':
        explanationPrompt = 'Explain this code clearly, without assuming advanced programming knowledge. Break down each section and explain what it does in simple terms.';
        break;
      case 'math':
        explanationPrompt = 'Explain this mathematical concept step-by-step, using analogies and visual descriptions where helpful. Avoid assuming advanced math knowledge.';
        break;
      case 'concept':
        explanationPrompt = 'Explain this concept using simple language, metaphors, and concrete examples. Make it accessible to someone new to this field.';
        break;
      default:
        explanationPrompt = 'Explain this content clearly in a way that makes it accessible to more people. Avoid jargon when possible and define any necessary technical terms.';
    }

    // Include additional context if provided
    if (params.context) {
      explanationPrompt += `\n\nAdditional context: ${params.context}`;
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an educational expert who explains complex topics clearly for diverse learning needs.'
        },
        {
          role: 'user',
          content: `${explanationPrompt}\n\nContent to explain:\n${params.content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract the explanation from the response
    const explanation = response.choices[0].message.content || '';

    return res.status(200).json({
      explanation
    });
  } catch (error) {
    console.error('Error in explainContent:', error);
    return res.status(500).json({
      error: `Failed to explain content: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

/**
 * Generate audio narration for code with step-by-step explanation
 */
export async function narrateCode(req: Request, res: Response) {
  try {
    const params = req.body as CodeNarratorRequest;

    if (!params.code) {
      return res.status(400).json({
        error: 'Missing required parameter: code'
      });
    }

    if (!params.language) {
      return res.status(400).json({
        error: 'Missing required parameter: language'
      });
    }

    // Determine narration level
    let narrationPrompt = '';
    switch (params.narrationLevel) {
      case 'basic':
        narrationPrompt = 'Provide a brief overview of what this code does in simple, non-technical language. Focus on the main purpose and outcome, not implementation details.';
        break;
      case 'detailed':
        narrationPrompt = 'Provide a detailed step-by-step explanation of how this code works. Explain each important line or block in sequence, describing what it does and why. Use clear non-technical language where possible.';
        break;
      case 'teaching':
        narrationPrompt = 'Create a comprehensive teaching narration of this code. Explain the concepts, patterns, and purpose behind each section. Include best practices, potential pitfalls, and educational context. Make it accessible to beginners while highlighting important programming concepts.';
        break;
      default:
        narrationPrompt = 'Provide a clear, step-by-step explanation of this code that would help someone understand how it works. Focus on readability and accessibility, avoiding unnecessary jargon.';
    }

    // Append language-specific context
    narrationPrompt += `\n\nThis is ${params.language} code.`;

    // Call OpenAI API to create the narration
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert programming instructor specializing in accessibility. You create clear, concise narrations of code for users with diverse needs, including those with visual impairments or learning disabilities.'
        },
        {
          role: 'user',
          content: `${narrationPrompt}\n\nCode to narrate:\n\`\`\`${params.language}\n${params.code}\n\`\`\``
        }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    // Extract the narration from the response
    const narration = response.choices[0].message.content || '';

    // If audio is not requested, return text only
    if (!params.includeAudio) {
      return res.status(200).json({
        narration
      });
    }

    // Generate audio if requested
    let voice = 'alloy'; // default voice
    let speed = 1.0; // default speed

    if (params.voiceStyle === 'clear') {
      voice = 'nova'; // clearer voice
    } else if (params.voiceStyle === 'slow') {
      speed = 0.8; // slower speed
    }

    // Call OpenAI API for text-to-speech
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: narration,
      speed: speed,
    });

    // Convert audio data to base64 for client-side playback
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString('base64');

    // Return both text and audio
    return res.status(200).json({
      narration,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`
    });
  } catch (error) {
    console.error('Error in narrateCode:', error);
    return res.status(500).json({
      error: `Failed to narrate code: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}