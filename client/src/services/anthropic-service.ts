import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = 'claude-3-7-sonnet-20250219';

// Create Anthropic instance
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
});

/**
 * Course generation request parameters
 */
interface GenerateCourseParams {
  type: 'topic' | 'file';
  topic?: string;
  additional?: string;
  fileContent?: string;
  targetAudience?: string;
  courseLength?: string;
  includeQuizzes?: boolean;
}

/**
 * Structure of a lesson resource
 */
interface CourseResource {
  title: string;
  url: string;
  type: string;
}

/**
 * Structure of a lesson
 */
interface CourseLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  resources?: CourseResource[];
}

/**
 * Structure of a complete course
 */
export interface CourseStructure {
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: string;
  totalLessons: number;
  lessons: CourseLesson[];
}

/**
 * Generate a course using Anthropic API
 * @param params Course generation parameters
 * @returns Promise with course structure
 */
export async function generateCourse(params: GenerateCourseParams): Promise<CourseStructure> {
  try {
    let prompt = '';
    
    // Build the prompt based on input type
    if (params.type === 'topic') {
      prompt = `Please create a comprehensive course structure about "${params.topic}". ${
        params.additional ? `Additional context: ${params.additional}` : ''
      }`;
    } else if (params.type === 'file' && params.fileContent) {
      prompt = `Please analyze this content and create a comprehensive course structure based on it: 
      
      ${params.fileContent}`;
    } else {
      throw new Error('Invalid input parameters');
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
    
    IMPORTANT: Make sure to return ONLY a valid JSON object. No additional text before or after.`;
    
    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4000,
      temperature: 0.7,
      system: "You are an expert curriculum designer specialized in creating educational content. Your responses should be well-structured, comprehensive, and educationally sound.",
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Extract and parse the JSON response
    const content = typeof response.content[0] === 'object' && 'text' in response.content[0] 
      ? response.content[0].text 
      : '';
    try {
      // Find JSON in the response (in case the model adds any text around it)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in the response');
      }
      
      const courseData = JSON.parse(jsonMatch[0]) as CourseStructure;
      return courseData;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Failed to parse the course structure from AI response');
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error(`Failed to generate course: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Read file content as text
 * @param file File to read
 * @returns Promise with file content as string
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}