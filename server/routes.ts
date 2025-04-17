import express, { type Express, type Request } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupSSOAuth } from "./sso-auth";
import { generateCourse } from "./ai-course-generator";
import { 
  generateCodeSuggestion,
  explainCode,
  optimizeCode 
} from "./ai-code-tools";
import {
  generateCode,
  explainCodeWithAskCodi,
  completeCode,
  getModels
} from "./askcodi-service";
import { 
  createPaymentIntent,
  createSubscription,
  createCustomer
} from "./payment-processing";
import { 
  getSkillCategories, 
  getSkillCategoryById, 
  createSkillCategory,
  getSkillOfferings,
  getSkillOfferingById,
  createSkillOffering,
  toggleSkillOfferingStatus,
  getSkillRequests,
  getSkillRequestById,
  createSkillRequest,
  toggleSkillRequestStatus,
  getSkillExchanges,
  getSkillExchangeById,
  createSkillExchange,
  updateSkillExchangeStatus
} from "./skill_storage";
import { insertUserSchema, themePreferencesSchema } from "@shared/schema";
import { 
  insertCourseSchema, 
  insertLessonSchema, 
  insertLessonProgressSchema,
  insertUserProgressSchema
} from "@shared/progress-schema";
import {
  insertSkillCategorySchema,
  insertSkillOfferingSchema,
  insertSkillRequestSchema,
  insertSkillExchangeSchema
} from "@shared/schema";
import { ZodError } from "zod";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';

// Add websocket diagnostics
const WEBSOCKET_DIAGNOSTICS = true;

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept documents, images, and videos
  const acceptedTypes = [
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    
    // Videos
    'video/mp4', 'video/webm', 'video/quicktime'
  ];
  
  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({ 
  storage: storage_config,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

// Store connected WebSocket clients
const clients = new Map<string, WebSocket>();

// Broadcast message to all connected clients
function broadcastMessage(message: any) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  setupSSOAuth(app);
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    return res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });
  
  // File Upload Route
  app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Generate public URL for the file
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers.host;
      const baseUrl = `${protocol}://${host}`;
      const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      
      // Return success with file information
      return res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'File upload failed', error: error.message });
    }
  });
  
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Allow public access to the uploads directory
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  }, express.static(uploadDir));
  
  // User Routes - Registration handled in auth.ts

  app.get('/api/user/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Course Routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/courses/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const featuredCourses = await storage.getFeaturedCourses(limit);
      return res.status(200).json(featuredCourses);
    } catch (error) {
      console.error("Error fetching featured courses:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/courses/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const courses = await storage.getCoursesByCategory(category);
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses by category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      return res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/courses', async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const newCourse = await storage.createCourse(courseData);
      return res.status(201).json(newCourse);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating course:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lesson Routes
  app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const lessons = await storage.getLessons(courseId);
      return res.status(200).json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/lessons/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLessonById(id);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      return res.status(200).json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/lessons', async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const newLesson = await storage.createLesson(lessonData);
      return res.status(201).json(newLesson);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating lesson:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Progress Routes
  app.get('/api/users/:userId/progress', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/users/:userId/progress/:courseId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      const progress = await storage.getUserProgressForCourse(userId, courseId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error fetching user progress for course:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/progress', async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateUserProgress(progressData);
      return res.status(201).json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error updating progress:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lesson Progress Routes
  app.get('/api/users/:userId/lessons/:lessonId/progress', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const lessonId = parseInt(req.params.lessonId);
      const progress = await storage.getLessonProgress(userId, lessonId);
      
      if (!progress) {
        return res.status(404).json({ message: "Lesson progress not found" });
      }
      
      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/lesson-progress', async (req, res) => {
    try {
      const progressData = insertLessonProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateLessonProgress(progressData);
      
      // Broadcast progress update
      broadcastMessage({
        type: 'LESSON_PROGRESS_UPDATE',
        data: {
          userId: progressData.user_id,
          lessonId: progressData.lesson_id,
          isCompleted: progressData.is_completed
        }
      });
      
      return res.status(201).json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error updating lesson progress:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Achievement Routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      return res.status(200).json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/users/:userId/achievements', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      return res.status(200).json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/users/:userId/achievements/:achievementId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievementId = parseInt(req.params.achievementId);
      
      const achievement = await storage.awardAchievement(userId, achievementId);
      
      // Broadcast achievement earned event
      broadcastMessage({
        type: 'ACHIEVEMENT_EARNED',
        data: {
          userId,
          achievementId,
          timestamp: new Date().toISOString()
        }
      });
      
      return res.status(201).json(achievement);
    } catch (error) {
      console.error("Error awarding achievement:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Landing Page Content Routes
  app.get('/api/landing-content', async (req, res) => {
    try {
      const content = await storage.getLandingContent();
      return res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching landing content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/landing-content', async (req, res) => {
    try {
      // Since we've removed Supabase auth, we're temporarily allowing all requests
      // In a production environment, you would implement proper authentication
      
      const content = await storage.updateLandingContent(req.body);
      return res.status(200).json(content);
    } catch (error) {
      console.error("Error updating landing content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Streak Routes
  app.get('/api/users/:userId/streak', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streak = await storage.getUserStreak(userId);
      
      if (!streak) {
        return res.status(404).json({ message: "Streak not found" });
      }
      
      return res.status(200).json(streak);
    } catch (error) {
      console.error("Error fetching user streak:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/users/:userId/streak/update', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updatedStreak = await storage.updateUserStreak(userId);
      return res.status(200).json(updatedStreak);
    } catch (error) {
      console.error("Error updating streak:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Theme Preferences Routes
  app.get('/api/users/:userId/theme-preferences', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await storage.getUserThemePreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: "Theme preferences not found" });
      }
      
      return res.status(200).json(preferences);
    } catch (error) {
      console.error("Error fetching theme preferences:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/users/:userId/theme-preferences', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferencesData = themePreferencesSchema.partial().parse(req.body);
      
      const updatedUser = await storage.updateUserThemePreferences(userId, preferencesData);
      
      // Return only theme preferences
      const { color_scheme, theme_mode, accent_color } = updatedUser;
      return res.status(200).json({ color_scheme, theme_mode, accent_color });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error updating theme preferences:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Skill Marketplace Routes
  // Categories
  app.get('/api/skill-categories', async (req, res) => {
    try {
      const categories = await getSkillCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching skill categories:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/skill-categories', async (req, res) => {
    try {
      const categoryData = insertSkillCategorySchema.parse(req.body);
      const newCategory = await createSkillCategory(categoryData);
      return res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating skill category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Skill Offerings
  app.get('/api/skill-offerings', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const activeOnly = req.query.activeOnly === 'true';
      
      const offerings = await getSkillOfferings(categoryId, userId, activeOnly);
      return res.status(200).json(offerings);
    } catch (error) {
      console.error("Error fetching skill offerings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/skill-offerings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const offering = await getSkillOfferingById(id);
      
      if (!offering) {
        return res.status(404).json({ message: "Skill offering not found" });
      }
      
      return res.status(200).json(offering);
    } catch (error) {
      console.error("Error fetching skill offering:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/skill-offerings', async (req, res) => {
    try {
      const offeringData = insertSkillOfferingSchema.parse(req.body);
      const newOffering = await createSkillOffering(offeringData);
      
      // Broadcast new skill offering
      broadcastMessage({
        type: 'NEW_SKILL_OFFERING',
        data: {
          id: newOffering.id,
          title: newOffering.title,
          userId: newOffering.user_id,
          categoryId: newOffering.category_id
        }
      });
      
      return res.status(201).json(newOffering);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating skill offering:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch('/api/skill-offerings/:id/toggle-status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const offering = await toggleSkillOfferingStatus(id);
      
      if (!offering) {
        return res.status(404).json({ message: "Skill offering not found" });
      }
      
      // Broadcast status change
      broadcastMessage({
        type: 'SKILL_OFFERING_STATUS_CHANGE',
        data: {
          id: offering.id,
          isActive: offering.is_active
        }
      });
      
      return res.status(200).json(offering);
    } catch (error) {
      console.error("Error toggling skill offering status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Skill Requests
  app.get('/api/skill-requests', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const activeOnly = req.query.activeOnly === 'true';
      
      const requests = await getSkillRequests(categoryId, userId, activeOnly);
      return res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching skill requests:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/skill-requests/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await getSkillRequestById(id);
      
      if (!request) {
        return res.status(404).json({ message: "Skill request not found" });
      }
      
      return res.status(200).json(request);
    } catch (error) {
      console.error("Error fetching skill request:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/skill-requests', async (req, res) => {
    try {
      const requestData = insertSkillRequestSchema.parse(req.body);
      const newRequest = await createSkillRequest(requestData);
      
      // Broadcast new skill request
      broadcastMessage({
        type: 'NEW_SKILL_REQUEST',
        data: {
          id: newRequest.id,
          title: newRequest.title,
          userId: newRequest.user_id,
          categoryId: newRequest.category_id
        }
      });
      
      return res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating skill request:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch('/api/skill-requests/:id/toggle-status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await toggleSkillRequestStatus(id);
      
      if (!request) {
        return res.status(404).json({ message: "Skill request not found" });
      }
      
      // Broadcast status change
      broadcastMessage({
        type: 'SKILL_REQUEST_STATUS_CHANGE',
        data: {
          id: request.id,
          isActive: request.is_active
        }
      });
      
      return res.status(200).json(request);
    } catch (error) {
      console.error("Error toggling skill request status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Skill Exchanges
  app.get('/api/skill-exchanges', async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const status = req.query.status as string | undefined;
      
      const exchanges = await getSkillExchanges(userId, status);
      return res.status(200).json(exchanges);
    } catch (error) {
      console.error("Error fetching skill exchanges:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/skill-exchanges/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exchange = await getSkillExchangeById(id);
      
      if (!exchange) {
        return res.status(404).json({ message: "Skill exchange not found" });
      }
      
      return res.status(200).json(exchange);
    } catch (error) {
      console.error("Error fetching skill exchange:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/skill-exchanges', async (req, res) => {
    try {
      const exchangeData = insertSkillExchangeSchema.parse(req.body);
      const newExchange = await createSkillExchange(exchangeData);
      
      // Broadcast new skill exchange
      broadcastMessage({
        type: 'NEW_SKILL_EXCHANGE',
        data: {
          id: newExchange.id,
          offererId: newExchange.offerer_id,
          requesterId: newExchange.requester_id,
          status: newExchange.status
        }
      });
      
      return res.status(201).json(newExchange);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating skill exchange:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch('/api/skill-exchanges/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const exchange = await updateSkillExchangeStatus(id, status);
      
      if (!exchange) {
        return res.status(404).json({ message: "Skill exchange not found" });
      }
      
      // Broadcast exchange status change
      broadcastMessage({
        type: 'SKILL_EXCHANGE_STATUS_CHANGE',
        data: {
          id: exchange.id,
          status: exchange.status
        }
      });
      
      return res.status(200).json(exchange);
    } catch (error) {
      console.error("Error updating skill exchange status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Activity Routes
  app.get('/api/users/:userId/activities', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activities = await storage.getUserActivities(userId, limit);
      return res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/users/:userId/activities', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { activity_type, detail, xp_earned, related_id, related_type } = req.body;
      
      await storage.logActivity(
        userId,
        activity_type,
        detail,
        xp_earned || 0,
        related_id,
        related_type
      );
      
      return res.status(201).json({ message: "Activity logged successfully" });
    } catch (error) {
      console.error("Error logging activity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Initialize Anthropic API client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // AI Code Snippet Generator Endpoint
  app.post('/api/code-generator', async (req, res) => {
    try {
      const { prompt, language, context } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const systemPrompt = `You are an expert coding assistant specializing in ${language || 'programming'}. 
Your task is to generate high-quality, efficient, and well-documented code snippets based on user requests.
Follow these guidelines:
1. Write clean, maintainable code that follows best practices for the language
2. Include brief comments explaining key parts of the code
3. Return ONLY code without explanations before or after (comments within code are encouraged)
4. Focus on practical, working solutions that demonstrate good programming patterns`;

      const userPrompt = context 
        ? `Using the following code context:\n\`\`\`\n${context}\n\`\`\`\n\nPlease generate: ${prompt}`
        : prompt;

      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ],
      });

      // Extract text from the response content - handling both ContentBlock and string types
      const content = response.content[0];
      // Use type assertion to safely handle the response
      const codeText = typeof content === 'object' && content.type === 'text' ? (content as any).text : '';
      
      return res.status(200).json({
        code: codeText,
        language: language || 'text'
      });
    } catch (error: any) {
      console.error("Error generating code snippet:", error);
      return res.status(500).json({ 
        message: "Failed to generate code snippet",
        error: error.message
      });
    }
  });

  // AI Code Suggestion Endpoint (real-time suggestions)
  app.post('/api/code-suggestion', async (req, res) => {
    try {
      const { code, language, cursorPosition } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Code content is required" });
      }

      const systemPrompt = `You are an intelligent code completion assistant. 
Your task is to provide helpful autocompletion suggestions based on the code a user is writing.
Follow these guidelines:
1. Analyze the code context and the cursor position to provide relevant suggestions
2. Provide brief, focused completions that follow the established code style and patterns
3. Return ONLY the suggested code completion without any explanations
4. Suggestions should be 1-5 lines at most and directly applicable as a completion`;

      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        max_tokens: 200,
        system: systemPrompt,
        messages: [
          { 
            role: "user", 
            content: `I'm writing code in ${language || 'a programming language'}. My cursor is at position ${cursorPosition || 'the end'}. Please suggest a completion for this code:\n\`\`\`\n${code}\n\`\`\`` 
          }
        ],
      });

      // Extract text from the response content - handling both ContentBlock and string types
      const content = response.content[0];
      // Use type assertion to safely handle the response
      const suggestionText = typeof content === 'object' && content.type === 'text' ? (content as any).text : '';
      
      return res.status(200).json({
        suggestion: suggestionText,
      });
    } catch (error: any) {
      console.error("Error generating code suggestion:", error);
      return res.status(500).json({ 
        message: "Failed to generate suggestion",
        error: error.message
      });
    }
  });

  // Create HTTP server
  // AI Endpoints
  // AI Course Generation
  app.post('/api/ai/generate-course', generateCourse);
  
  // AI Code Tools
  app.post('/api/ai/code-suggestion', generateCodeSuggestion);
  app.post('/api/ai/code-explanation', explainCode);
  app.post('/api/ai/code-optimization', optimizeCode);
  
  // AskCodi API Endpoints
  app.post('/api/askcodi/generate', generateCode);
  app.post('/api/askcodi/explain', explainCodeWithAskCodi);
  app.post('/api/askcodi/complete', completeCode);
  app.get('/api/askcodi/models', getModels);
  
  // Payment Processing Endpoints
  app.post('/api/payments/create-payment-intent', createPaymentIntent);
  app.post('/api/payments/create-subscription', createSubscription);
  app.post('/api/payments/create-customer', createCustomer);

  const httpServer = createServer(app);

  // Create a simpler WebSocket server
  console.log('Setting up WebSocket server on path: /ws');
  
  // Create a dedicated endpoint for initial WebSocket test
  app.get('/api/websocket-status', (req, res) => {
    return res.status(200).json({
      status: 'ready',
      message: 'WebSocket server is available at /ws'
    });
  });
  
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws', 
    // Disable perMessageDeflate to avoid compression issues
    perMessageDeflate: false 
  });
  
  // Log any WebSocket server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    if (WEBSOCKET_DIAGNOSTICS) {
      console.log('WebSocket client connected from:', req.socket.remoteAddress, 'headers:', JSON.stringify(req.headers, null, 2));
    } else {
      console.log('WebSocket client connected from:', req.socket.remoteAddress);
    }
    
    const clientId = req.headers['sec-websocket-key'] || `${Date.now()}-${Math.random()}`;
    clients.set(clientId as string, ws);
    console.log('Total connected clients:', clients.size);

    ws.send(JSON.stringify({
      type: 'WELCOME',
      message: 'Connected to NURD real-time server'
    }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        if (data.type === 'USER_ACTIVITY') {
          broadcastMessage({
            type: 'USER_ACTIVITY',
            data: data.data
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(clientId as string);
    });
  });

  return httpServer;
}