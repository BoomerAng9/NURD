import Anthropic from '@anthropic-ai/sdk';
import { Request, Response } from 'express';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = 'claude-3-7-sonnet-20250219';

// Create Anthropic instance
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Structure of a course generation request
 */
interface CourseGenerationRequest {
  type: 'topic' | 'file';
  topic?: string;
  additional?: string;
  fileContent?: string;
  targetAudience?: string;
  courseLength?: string;
  includeQuizzes?: boolean;
}

/**
 * Generate course structure using Anthropic API
 */
export async function generateCourse(req: Request, res: Response) {
  try {
    const params = req.body as CourseGenerationRequest;
    
    if (
      (params.type === 'topic' && !params.topic) || 
      (params.type === 'file' && !params.fileContent)
    ) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }
    
    let prompt = '';
    
    // Build the prompt based on input type
    if (params.type === 'topic') {
      prompt = `Please create a comprehensive course structure about "${params.topic}". ${
        params.additional ? `Additional context: ${params.additional}` : ''
      }`;
    } else {
      prompt = `Please analyze this content and create a comprehensive course structure based on it: 
      
      ${params.fileContent}`;
    }
    
    // Add specifications based on parameters
    prompt += `\n\nTarget audience: ${params.targetAudience || 'beginners'}
    Course length: ${params.courseLength || 'medium'} (short: 2-3 lessons, medium: 4-6 lessons, long: 7-10 lessons)
    Include quizzes: ${params.includeQuizzes ? 'Yes' : 'No'}
    
    Please structure your response as a JSON object with the following format:
    {
      "title": "Course Title",
      "description": "A comprehensive description of the course",
      "level": "Beginner OR Intermediate OR Advanced",
      "category": "Main category of the course",
      "duration": "Estimated duration (e.g., 5 hours)",
      "totalLessons": number,
      "lessons": [
        {
          "id": "1",
          "title": "Lesson title",
          "description": "Brief lesson description",
          "content": "Detailed lesson content overview",
          "duration": "Estimated lesson duration",
          "resources": [
            {
              "title": "Resource title",
              "url": "Resource URL or placeholder",
              "type": "Resource type (pdf, video, link, etc.)"
            }
          ]
        }
      ]
    }
    
    Make sure your JSON follows this exact structure with these exact field names. The response should be ONLY the JSON object.`;
    
    // Call Anthropic API with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('API request timed out after 25 seconds')), 25000);
    });
    
    const apiPromise = anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4000,
      temperature: 0.7,
      system: "You are an expert curriculum designer specialized in creating educational content. Your responses should be well-structured, comprehensive, and educationally sound.",
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    const response = await Promise.race([apiPromise, timeoutPromise]) as Awaited<typeof apiPromise>;
    
    // Extract the content from the response
    const content = typeof response.content[0] === 'object' && 'text' in response.content[0] 
      ? response.content[0].text 
      : '';
    
    try {
      // Find JSON in the response (in case the model adds any text around it)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in the response');
      }
      
      const courseData = JSON.parse(jsonMatch[0]);
      return res.status(200).json(courseData);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse the course structure from AI response'
      });
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ 
      error: `Failed to generate course: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}