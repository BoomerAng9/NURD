import { users, type User, type InsertUser, landingContent, type LandingContent, type InsertLandingContent } from "@shared/schema";
import { 
  courses, 
  lessons, 
  userProgress, 
  lessonProgress, 
  achievements, 
  userAchievements,
  streaks,
  activityLogs,
  type Course,
  type Lesson,
  type UserProgress,
  type LessonProgress,
  type Achievement,
  type UserAchievement,
  type InsertCourse,
  type InsertLesson,
  type InsertUserProgress,
  type InsertLessonProgress,
  type InsertAchievement,
  type InsertUserAchievement
} from "@shared/progress-schema";
import { db } from "./db";
import { eq, and, desc, sql, asc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Landing content methods
  getLandingContent(): Promise<LandingContent[]>;
  updateLandingContent(content: InsertLandingContent): Promise<LandingContent>;
  deleteLandingContent(id: number): Promise<void>;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserXP(userId: number, xpToAdd: number): Promise<User>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getFeaturedCourses(limit?: number): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;

  // Lesson methods
  getLessons(courseId: number): Promise<Lesson[]>;
  getLessonById(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressForCourse(userId: number, courseId: number): Promise<UserProgress | undefined>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Lesson progress methods
  getLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined>;
  createOrUpdateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;

  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievement(userId: number, achievementId: number): Promise<UserAchievement>;

  // Streak methods
  getUserStreak(userId: number): Promise<{ current: number, max: number, lastActivity: Date } | undefined>;
  updateUserStreak(userId: number): Promise<{ current: number, max: number }>;

  // Activity methods
  logActivity(userId: number, activityType: string, detail?: string, xpEarned?: number, relatedId?: number, relatedType?: string): Promise<void>;
  getUserActivities(userId: number, limit?: number): Promise<any[]>;
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // Landing content methods
  async getLandingContent(): Promise<LandingContent[]> {
    const content = await db
      .select()
      .from(landingContent)
      .orderBy(asc(landingContent.displayOrder));
      
    if (content.length === 0) {
      // Create a default entry if no content exists
      const [defaultContent] = await db
        .insert(landingContent)
        .values({
          title: 'Welcome to NURD',
          content: 'Where innovation meets education',
          mediaUrl: null,
          mediaType: null,
          displayOrder: 0,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();
      return [defaultContent];
    }
    
    return content;
  }

  async updateLandingContent(content: Partial<InsertLandingContent>): Promise<LandingContent> {
    const [updatedContent] = await db
      .insert(landingContent)
      .values({
        ...content,
        updated_at: new Date()
      })
      .returning();
    return updatedContent;
  }
  
  async deleteLandingContent(id: number): Promise<void> {
    await db
      .delete(landingContent)
      .where(eq(landingContent.id, id));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserXP(userId: number, xpToAdd: number): Promise<User> {
    // Update user XP and potentially level up
    const [updatedUser] = await db
      .update(users)
      .set({
        xp_points: sql`${users.xp_points} + ${xpToAdd}`,
        // Simple level calculation: level = floor(xp / 100) + 1
        level: sql`GREATEST(FLOOR((${users.xp_points} + ${xpToAdd}) / 100) + 1, ${users.level})`,
        updated_at: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return db.select().from(courses).orderBy(asc(courses.title));
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getFeaturedCourses(limit: number = 5): Promise<Course[]> {
    return db
      .select()
      .from(courses)
      .where(eq(courses.is_featured, true))
      .limit(limit);
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.category, category));
  }

  // Lesson methods
  async getLessons(courseId: number): Promise<Lesson[]> {
    return db
      .select()
      .from(lessons)
      .where(eq(lessons.course_id, courseId))
      .orderBy(asc(lessons.order_index));
  }

  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return db
      .select()
      .from(userProgress)
      .where(eq(userProgress.user_id, userId))
      .orderBy(desc(userProgress.last_accessed));
  }

  async getUserProgressForCourse(userId: number, courseId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.user_id, userId),
          eq(userProgress.course_id, courseId)
        )
      );
    return progress || undefined;
  }

  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress already exists for this user and course
    const existingProgress = await this.getUserProgressForCourse(
      progress.user_id,
      progress.course_id
    );

    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          ...progress,
          last_accessed: new Date()
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();

      return updatedProgress;
    } else {
      // Create new progress
      const [newProgress] = await db
        .insert(userProgress)
        .values(progress)
        .returning();

      return newProgress;
    }
  }

  // Lesson progress methods
  async getLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.user_id, userId),
          eq(lessonProgress.lesson_id, lessonId)
        )
      );
    return progress || undefined;
  }

  async createOrUpdateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    // Check if progress already exists for this user and lesson
    const existingProgress = await this.getLessonProgress(
      progress.user_id,
      progress.lesson_id
    );

    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db
        .update(lessonProgress)
        .set({
          ...progress,
          last_accessed: new Date()
        })
        .where(eq(lessonProgress.id, existingProgress.id))
        .returning();

      // Update course progress
      await this.updateCourseProgressOnLessonCompletion(progress.user_id, progress.lesson_id);

      return updatedProgress;
    } else {
      // Create new progress
      const [newProgress] = await db
        .insert(lessonProgress)
        .values(progress)
        .returning();

      // Update course progress if lesson is completed
      if (progress.is_completed) {
        await this.updateCourseProgressOnLessonCompletion(progress.user_id, progress.lesson_id);
      }

      return newProgress;
    }
  }

  // Helper method to update course progress when a lesson is completed
  private async updateCourseProgressOnLessonCompletion(userId: number, lessonId: number): Promise<void> {
    // Get the lesson to find its course
    const lesson = await this.getLessonById(lessonId);
    if (!lesson) return;

    // Get course
    const course = await this.getCourseById(lesson.course_id);
    if (!course) return;

    // Count completed lessons in this course for this user
    const completedLessons = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lesson_id, lessons.id))
      .where(
        and(
          eq(lessonProgress.user_id, userId),
          eq(lessons.course_id, course.id),
          eq(lessonProgress.is_completed, true)
        )
      );

    const completedCount = completedLessons[0]?.count || 0;

    // Calculate progress percentage
    const progressPercentage = Math.round((completedCount / course.total_lessons) * 100);
    const isCompleted = completedCount >= course.total_lessons;

    // Get existing user progress for this course
    const existingProgress = await this.getUserProgressForCourse(userId, course.id);

    if (existingProgress) {
      // Update progress
      await db
        .update(userProgress)
        .set({
          progress_percentage: progressPercentage,
          completed_lessons: completedCount,
          last_accessed: new Date(),
          is_completed: isCompleted,
          completion_date: isCompleted && !existingProgress.is_completed ? new Date() : existingProgress.completion_date
        })
        .where(eq(userProgress.id, existingProgress.id));

      // Award XP for course completion if just completed
      if (isCompleted && !existingProgress.is_completed) {
        await this.updateUserXP(userId, course.total_xp - existingProgress.earned_xp);

        // Log activity
        await this.logActivity(
          userId,
          'course_completion',
          `Completed course: ${course.title}`,
          course.total_xp - existingProgress.earned_xp,
          course.id,
          'course'
        );

        // Check for completion achievements
        await this.checkAndAwardAchievements(userId);
      }
    } else {
      // Create new progress
      await db
        .insert(userProgress)
        .values({
          user_id: userId,
          course_id: course.id,
          progress_percentage: progressPercentage,
          completed_lessons: completedCount,
          is_completed: isCompleted,
          completion_date: isCompleted ? new Date() : null,
          earned_xp: isCompleted ? course.total_xp : 0
        });

      // Award XP for course completion
      if (isCompleted) {
        await this.updateUserXP(userId, course.total_xp);

        // Log activity
        await this.logActivity(
          userId,
          'course_completion',
          `Completed course: ${course.title}`,
          course.total_xp,
          course.id,
          'course'
        );

        // Check for completion achievements
        await this.checkAndAwardAchievements(userId);
      }
    }
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements).orderBy(asc(achievements.title));
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    // Join user achievements with achievement details
    const userAchs = await db
      .select({
        id: userAchievements.id,
        user_id: userAchievements.user_id,
        achievement_id: userAchievements.achievement_id,
        earned_at: userAchievements.earned_at,
        is_viewed: userAchievements.is_viewed,
        achievement: achievements
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievement_id, achievements.id))
      .where(eq(userAchievements.user_id, userId))
      .orderBy(desc(userAchievements.earned_at));

    return userAchs;
  }

  async awardAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    // Check if user already has this achievement
    const [existingAchievement] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.user_id, userId),
          eq(userAchievements.achievement_id, achievementId)
        )
      );

    if (existingAchievement) {
      return existingAchievement;
    }

    // Get achievement details
    const achievement = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, achievementId))
      .then(rows => rows[0]);

    if (!achievement) {
      throw new Error(`Achievement not found with id: ${achievementId}`);
    }

    // Award the achievement
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        user_id: userId,
        achievement_id: achievementId,
        earned_at: new Date(),
        is_viewed: false
      })
      .returning();

    // Award XP for the achievement
    if (achievement.xp_reward > 0) {
      await this.updateUserXP(userId, achievement.xp_reward);

      // Log activity
      await this.logActivity(
        userId,
        'achievement_earned',
        `Earned achievement: ${achievement.title}`,
        achievement.xp_reward,
        achievement.id,
        'achievement'
      );
    }

    return userAchievement;
  }

  // Helper method to check and award achievements based on user progress
  private async checkAndAwardAchievements(userId: number): Promise<void> {
    // Get all achievements
    const allAchievements = await this.getAchievements();

    // Get user's courses progress
    const coursesProgress = await this.getUserProgress(userId);
    const completedCourses = coursesProgress.filter(p => p.is_completed).length;

    // Check for course completion achievements
    const completionAchievements = allAchievements.filter(
      a => a.type === 'completion' && a.requirement === 'courses_completed'
    );

    for (const achievement of completionAchievements) {
      if (completedCourses >= achievement.requirement_value) {
        // Award achievement
        await this.awardAchievement(userId, achievement.id).catch(err => {
          console.error('Error awarding achievement:', err);
        });
      }
    }

    // Check for streak achievements
    const streak = await this.getUserStreak(userId);
    if (streak) {
      const streakAchievements = allAchievements.filter(
        a => a.type === 'streak' && a.requirement === 'consecutive_days'
      );

      for (const achievement of streakAchievements) {
        if (streak.current >= achievement.requirement_value) {
          // Award achievement
          await this.awardAchievement(userId, achievement.id).catch(err => {
            console.error('Error awarding achievement:', err);
          });
        }
      }
    }
  }

  // Streak methods
  async getUserStreak(userId: number): Promise<{ current: number, max: number, lastActivity: Date } | undefined> {
    const [streak] = await db
      .select()
      .from(streaks)
      .where(eq(streaks.user_id, userId));

    if (!streak) return undefined;

    return {
      current: streak.current_streak,
      max: streak.max_streak,
      lastActivity: streak.last_activity_date
    };
  }

  async updateUserStreak(userId: number): Promise<{ current: number, max: number }> {
    // Get existing streak
    const [existingStreak] = await db
      .select()
      .from(streaks)
      .where(eq(streaks.user_id, userId));

    const now = new Date();

    if (!existingStreak) {
      // Create new streak
      const [newStreak] = await db
        .insert(streaks)
        .values({
          user_id: userId,
          current_streak: 1,
          max_streak: 1,
          last_activity_date: now
        })
        .returning();

      return {
        current: 1,
        max: 1
      };
    }

    // Check if we need to update streak
    const lastActivity = new Date(existingStreak.last_activity_date);
    const daysSinceLastActivity = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    let currentStreak = existingStreak.current_streak;
    let maxStreak = existingStreak.max_streak;

    if (daysSinceLastActivity === 0) {
      // Already logged in today, no need to update streak
    } else if (daysSinceLastActivity === 1) {
      // Consecutive day, increase streak
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Streak broken
      currentStreak = 1;
    }

    // Update streak
    const [updatedStreak] = await db
      .update(streaks)
      .set({
        current_streak: currentStreak,
        max_streak: maxStreak,
        last_activity_date: now
      })
      .where(eq(streaks.user_id, userId))
      .returning();

    return {
      current: updatedStreak.current_streak,
      max: updatedStreak.max_streak
    };
  }

  // Activity methods
  async logActivity(
    userId: number, 
    activityType: string, 
    detail?: string, 
    xpEarned: number = 0, 
    relatedId?: number, 
    relatedType?: string
  ): Promise<void> {
    await db
      .insert(activityLogs)
      .values({
        user_id: userId,
        activity_type: activityType,
        activity_detail: detail,
        xp_earned: xpEarned,
        related_id: relatedId,
        related_type: relatedType,
        created_at: new Date()
      });

    // Update user streak if they've logged an activity
    await this.updateUserStreak(userId);
  }

  async getUserActivities(userId: number, limit: number = 20): Promise<any[]> {
    return db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.user_id, userId))
      .orderBy(desc(activityLogs.created_at))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();