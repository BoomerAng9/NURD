import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { 
  insertCourseSchema, 
  insertLessonSchema, 
  insertLessonProgressSchema,
  insertUserProgressSchema
} from "@shared/progress-schema";
import { ZodError } from "zod";

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
  // User Routes
  app.post('/api/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(userData);
      
      // Return user data without password
      const { password, ...userWithoutPassword } = newUser;
      
      // Broadcast new user joined event
      broadcastMessage({
        type: 'NEW_USER',
        data: {
          username: userWithoutPassword.username,
          first_name: userWithoutPassword.first_name
        }
      });
      
      return res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

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

  // Landing Page Routes
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
    // Check if user is admin
    const userId = req.session?.userId;
    const user = await storage.getUserById(userId);
    if (!user?.is_admin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const content = await storage.updateLandingContent(req.body);
    return res.status(200).json(content);
  } catch (error) {
    console.error("Error updating landing content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Achievement Routes
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
      // Check if user is admin
      const userId = req.session?.userId;
      const user = await storage.getUserById(userId);
      if (!user?.is_admin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const content = await storage.updateLandingContent(req.body);
      return res.status(200).json(content);
    } catch (error) {
      console.error("Error updating landing content:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

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
      const userAchievement = await storage.awardAchievement(userId, achievementId);
      
      // Broadcast achievement earned
      broadcastMessage({
        type: 'ACHIEVEMENT_EARNED',
        data: {
          userId,
          achievementId
        }
      });
      
      return res.status(201).json(userAchievement);
    } catch (error) {
      console.error("Error awarding achievement:", error);
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

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');
    const clientId = req.headers['sec-websocket-key'] as string;
    clients.set(clientId, ws);

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
      clients.delete(clientId);
    });
  });

  return httpServer;
}