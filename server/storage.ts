import crypto from 'crypto';
import { 
  users, 
  type User, 
  type InsertUser, 
  landingContent, 
  type LandingContent, 
  type InsertLandingContent,
  skill_categories,
  skill_offerings,
  skill_requests,
  skill_exchanges,
  type SkillCategory,
  type SkillOffering,
  type SkillRequest,
  type SkillExchange,
  type InsertSkillCategory,
  type InsertSkillOffering,
  type InsertSkillRequest,
  type InsertSkillExchange,
  // Image Locker system
  image_categories,
  app_pages,
  images,
  image_page_mappings,
  image_tags,
  image_tag_mappings,
  type ImageCategory,
  type AppPage,
  type Image,
  type ImagePageMapping,
  type ImageTag,
  type ImageTagMapping,
  type InsertImageCategory,
  type InsertAppPage,
  type InsertImage,
  type InsertImagePageMapping,
  type InsertImageTag,
  type InsertImageTagMapping
} from "@shared/schema";
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
import { eq, and, desc, sql, asc, or } from "drizzle-orm";

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
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByProvider(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUserFromSocial(user: Partial<InsertUser> & { email: string }): Promise<User>;
  linkSocialProvider(userId: number, provider: string, providerId: string): Promise<User>;
  verifyEmail(token: string): Promise<boolean>;
  requestPasswordReset(email: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
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

  // Skill marketplace methods - Categories
  getSkillCategories(): Promise<SkillCategory[]>;
  getSkillCategoryById(id: number): Promise<SkillCategory | undefined>;
  createSkillCategory(category: InsertSkillCategory): Promise<SkillCategory>;

  // Skill marketplace methods - Offerings
  getSkillOfferings(categoryId?: number, userId?: number, activeOnly?: boolean): Promise<SkillOffering[]>;
  getSkillOfferingById(id: number): Promise<SkillOffering | undefined>;
  createSkillOffering(offering: InsertSkillOffering): Promise<SkillOffering>;
  toggleSkillOfferingStatus(id: number): Promise<SkillOffering | undefined>;

  // Skill marketplace methods - Requests
  getSkillRequests(categoryId?: number, userId?: number, activeOnly?: boolean): Promise<SkillRequest[]>;
  getSkillRequestById(id: number): Promise<SkillRequest | undefined>;
  createSkillRequest(request: InsertSkillRequest): Promise<SkillRequest>;
  toggleSkillRequestStatus(id: number): Promise<SkillRequest | undefined>;

  // Skill marketplace methods - Exchanges
  getSkillExchanges(userId?: number, status?: string): Promise<SkillExchange[]>;
  getSkillExchangeById(id: number): Promise<SkillExchange | undefined>;
  createSkillExchange(exchange: InsertSkillExchange): Promise<SkillExchange>;
  updateSkillExchangeStatus(id: number, status: string): Promise<SkillExchange | undefined>;
  
  // Theme preferences methods
  getUserThemePreferences(userId: number): Promise<{ color_scheme: string, theme_mode: string, accent_color: string } | undefined>;
  updateUserThemePreferences(userId: number, preferences: { color_scheme?: string, theme_mode?: string, accent_color?: string }): Promise<User>;

  // Image Locker - Category methods
  getImageCategories(): Promise<ImageCategory[]>;
  getImageCategoryById(id: number): Promise<ImageCategory | undefined>;
  createImageCategory(category: InsertImageCategory): Promise<ImageCategory>;
  updateImageCategory(id: number, category: Partial<InsertImageCategory>): Promise<ImageCategory | undefined>;
  deleteImageCategory(id: number): Promise<boolean>;

  // Image Locker - App Pages methods
  getAppPages(): Promise<AppPage[]>;
  getAppPageById(id: number): Promise<AppPage | undefined>;
  getAppPageByName(name: string): Promise<AppPage | undefined>;
  getAppPageByRoute(route: string): Promise<AppPage | undefined>;
  createAppPage(page: InsertAppPage): Promise<AppPage>;
  updateAppPage(id: number, page: Partial<InsertAppPage>): Promise<AppPage | undefined>;
  deleteAppPage(id: number): Promise<boolean>;

  // Image Locker - Image methods
  getImages(categoryId?: number, options?: { limit?: number, offset?: number, active?: boolean }): Promise<Image[]>;
  getImageById(id: number): Promise<Image | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  updateImage(id: number, image: Partial<InsertImage>): Promise<Image | undefined>;
  toggleImageActive(id: number): Promise<Image | undefined>;
  deleteImage(id: number): Promise<boolean>;
  incrementImageUsageCount(id: number): Promise<Image | undefined>;

  // Image Locker - Image-Page mappings methods
  getImagesForPage(pageId: number, options?: { usageType?: string, limit?: number, offset?: number }): Promise<(Image & { mapping: ImagePageMapping })[]>;
  getPagesForImage(imageId: number): Promise<(AppPage & { mapping: ImagePageMapping })[]>;
  createImagePageMapping(mapping: InsertImagePageMapping): Promise<ImagePageMapping>;
  updateImagePageMapping(imageId: number, pageId: number, mapping: Partial<InsertImagePageMapping>): Promise<ImagePageMapping | undefined>;
  deleteImagePageMapping(imageId: number, pageId: number): Promise<boolean>;

  // Image Locker - Tags methods
  getImageTags(): Promise<ImageTag[]>;
  createImageTag(tag: InsertImageTag): Promise<ImageTag>;
  tagImage(imageId: number, tagId: number): Promise<void>;
  untagImage(imageId: number, tagId: number): Promise<void>;
  getImagesByTag(tagId: number, options?: { limit?: number, offset?: number }): Promise<Image[]>;
  getTagsForImage(imageId: number): Promise<ImageTag[]>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByProvider(provider: string, providerId: string): Promise<User | undefined> {
    const providerField = `${provider}_id` as keyof typeof users;
    if (!users[providerField]) {
      return undefined;
    }
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users[providerField] as any, providerId));
    
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createUserFromSocial(userData: Partial<InsertUser> & { email: string, email_verified?: boolean }): Promise<User> {
    // Generate a verification token if needed
    const verificationToken = !userData.email_verified 
      ? crypto.randomBytes(32).toString('hex')
      : undefined;
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        verification_token: verificationToken
      })
      .returning();
    
    // If email not verified, send verification email
    if (verificationToken) {
      // Import sendVerificationEmail without creating circular dependency
      const { sendVerificationEmail } = require('./sso-auth');
      await sendVerificationEmail(userData.email, verificationToken);
    }
    
    return user;
  }

  async linkSocialProvider(userId: number, provider: string, providerId: string): Promise<User> {
    const providerField = `${provider}_id` as keyof typeof users;
    if (!users[providerField]) {
      throw new Error(`Provider ${provider} not supported`);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        [providerField]: providerId,
        updated_at: new Date()
      } as any)
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verification_token, token));
    
    if (!user) {
      return false;
    }
    
    await db
      .update(users)
      .set({
        email_verified: true,
        verification_token: null,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));
    
    return true;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    if (!user) {
      return false;
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1 hour
    
    await db
      .update(users)
      .set({
        reset_password_token: resetToken,
        reset_password_expires: expiration,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));
    
    // Import sendPasswordResetEmail without creating circular dependency
    const { sendPasswordResetEmail } = require('./sso-auth');
    return await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.reset_password_token, token));
    
    if (!user) {
      return false;
    }
    
    // Check if token has expired
    if (!user.reset_password_expires || user.reset_password_expires < new Date()) {
      return false;
    }
    
    // Hash the new password
    const hashPassword = (password: string) => {
      const salt = crypto.randomBytes(16).toString('hex');
      return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex') + ':' + salt;
    };
    
    await db
      .update(users)
      .set({
        password: hashPassword(newPassword),
        reset_password_token: null,
        reset_password_expires: null,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));
    
    return true;
  }

  async updateUserXP(userId: number, xpToAdd: number): Promise<User> {
    // Update user XP and potentially level up
    const [updatedUser] = await db
      .update(users)
      .set({
        xp: sql`${users.xp} + ${xpToAdd}`,
        // Simple level calculation: level = floor(xp / 100) + 1
        level: sql`GREATEST(FLOOR((${users.xp} + ${xpToAdd}) / 100) + 1, ${users.level})`,
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

  // Skill marketplace methods - Categories
  async getSkillCategories(): Promise<SkillCategory[]> {
    return db.select().from(skill_categories).orderBy(asc(skill_categories.name));
  }

  async getSkillCategoryById(id: number): Promise<SkillCategory | undefined> {
    const [category] = await db.select().from(skill_categories).where(eq(skill_categories.id, id));
    return category || undefined;
  }

  async createSkillCategory(category: InsertSkillCategory): Promise<SkillCategory> {
    const [newCategory] = await db.insert(skill_categories).values(category).returning();
    return newCategory;
  }

  // Skill marketplace methods - Offerings
  async getSkillOfferings(categoryId?: number, userId?: number, activeOnly: boolean = false): Promise<SkillOffering[]> {
    let query = db.select().from(skill_offerings);
    
    // Apply filters
    if (categoryId) {
      query = query.where(eq(skill_offerings.category_id, categoryId));
    }
    
    if (userId) {
      query = query.where(eq(skill_offerings.user_id, userId));
    }
    
    if (activeOnly) {
      query = query.where(eq(skill_offerings.is_active, true));
    }
    
    // Order by most recent first
    return query.orderBy(desc(skill_offerings.created_at));
  }

  async getSkillOfferingById(id: number): Promise<SkillOffering | undefined> {
    const [offering] = await db.select().from(skill_offerings).where(eq(skill_offerings.id, id));
    return offering || undefined;
  }

  async createSkillOffering(offering: InsertSkillOffering): Promise<SkillOffering> {
    const [newOffering] = await db.insert(skill_offerings).values(offering).returning();
    
    // Log activity
    if (newOffering) {
      await this.logActivity(
        newOffering.user_id,
        'skill_offering_created',
        `Created skill offering: ${newOffering.title}`,
        10, // Award 10 XP for creating a skill offering
        newOffering.id,
        'skill_offering'
      );
    }
    
    return newOffering;
  }

  async toggleSkillOfferingStatus(id: number): Promise<SkillOffering | undefined> {
    // Get current offering
    const offering = await this.getSkillOfferingById(id);
    if (!offering) return undefined;
    
    // Toggle status
    const [updatedOffering] = await db
      .update(skill_offerings)
      .set({
        is_active: !offering.is_active,
        updated_at: new Date()
      })
      .where(eq(skill_offerings.id, id))
      .returning();
    
    return updatedOffering;
  }

  // Skill marketplace methods - Requests
  async getSkillRequests(categoryId?: number, userId?: number, activeOnly: boolean = false): Promise<SkillRequest[]> {
    let query = db.select().from(skill_requests);
    
    // Apply filters
    if (categoryId) {
      query = query.where(eq(skill_requests.category_id, categoryId));
    }
    
    if (userId) {
      query = query.where(eq(skill_requests.user_id, userId));
    }
    
    if (activeOnly) {
      query = query.where(eq(skill_requests.is_active, true));
    }
    
    // Order by most recent first
    return query.orderBy(desc(skill_requests.created_at));
  }

  async getSkillRequestById(id: number): Promise<SkillRequest | undefined> {
    const [request] = await db.select().from(skill_requests).where(eq(skill_requests.id, id));
    return request || undefined;
  }

  async createSkillRequest(request: InsertSkillRequest): Promise<SkillRequest> {
    const [newRequest] = await db.insert(skill_requests).values(request).returning();
    
    // Log activity
    if (newRequest) {
      await this.logActivity(
        newRequest.user_id,
        'skill_request_created',
        `Created skill request: ${newRequest.title}`,
        5, // Award 5 XP for creating a skill request
        newRequest.id,
        'skill_request'
      );
    }
    
    return newRequest;
  }

  async toggleSkillRequestStatus(id: number): Promise<SkillRequest | undefined> {
    // Get current request
    const request = await this.getSkillRequestById(id);
    if (!request) return undefined;
    
    // Toggle status
    const [updatedRequest] = await db
      .update(skill_requests)
      .set({
        is_active: !request.is_active,
        updated_at: new Date()
      })
      .where(eq(skill_requests.id, id))
      .returning();
    
    return updatedRequest;
  }

  // Skill marketplace methods - Exchanges
  async getSkillExchanges(userId?: number, status?: string): Promise<SkillExchange[]> {
    let query = db.select().from(skill_exchanges);
    
    // Apply filters
    if (userId) {
      query = query.where(
        or(
          eq(skill_exchanges.offerer_id, userId),
          eq(skill_exchanges.requester_id, userId)
        )
      );
    }
    
    if (status) {
      query = query.where(eq(skill_exchanges.status, status));
    }
    
    // Order by most recent first
    return query.orderBy(desc(skill_exchanges.created_at));
  }

  async getSkillExchangeById(id: number): Promise<SkillExchange | undefined> {
    const [exchange] = await db.select().from(skill_exchanges).where(eq(skill_exchanges.id, id));
    return exchange || undefined;
  }

  async createSkillExchange(exchange: InsertSkillExchange): Promise<SkillExchange> {
    const [newExchange] = await db.insert(skill_exchanges).values(exchange).returning();
    
    // Log activity for both parties
    if (newExchange) {
      // For the offerer
      await this.logActivity(
        newExchange.offerer_id,
        'skill_exchange_initiated',
        `Initiated a skill exchange as teacher`,
        0, // No XP awarded for initiating
        newExchange.id,
        'skill_exchange'
      );
      
      // For the requester
      await this.logActivity(
        newExchange.requester_id,
        'skill_exchange_received',
        `Received a skill exchange offer as student`,
        0, // No XP awarded for receiving
        newExchange.id,
        'skill_exchange'
      );
    }
    
    return newExchange;
  }

  async updateSkillExchangeStatus(id: number, status: string): Promise<SkillExchange | undefined> {
    // Get current exchange
    const exchange = await this.getSkillExchangeById(id);
    if (!exchange) return undefined;
    
    const now = new Date();
    const updateData: any = {
      status,
      updated_at: now
    };
    
    // If completing exchange, set completed_at date
    if (status === 'completed' && !exchange.completed_at) {
      updateData.completed_at = now;
    }
    
    // Update exchange status
    const [updatedExchange] = await db
      .update(skill_exchanges)
      .set(updateData)
      .where(eq(skill_exchanges.id, id))
      .returning();
    
    // Handle status-specific actions
    if (updatedExchange) {
      // For completed exchanges
      if (status === 'completed' && exchange.status !== 'completed') {
        // Award XP to both parties for completed exchange
        await this.updateUserXP(updatedExchange.offerer_id, 15); // 15 XP for teaching
        await this.updateUserXP(updatedExchange.requester_id, 10); // 10 XP for learning
        
        // Log completion activities
        await this.logActivity(
          updatedExchange.offerer_id,
          'skill_exchange_completed',
          `Completed a skill exchange as teacher`,
          15,
          updatedExchange.id,
          'skill_exchange'
        );
        
        await this.logActivity(
          updatedExchange.requester_id,
          'skill_exchange_completed',
          `Completed a skill exchange as student`,
          10,
          updatedExchange.id,
          'skill_exchange'
        );
        
        // Check for achievements
        await this.checkAndAwardAchievements(updatedExchange.offerer_id);
        await this.checkAndAwardAchievements(updatedExchange.requester_id);
      }
      
      // For cancelled or rejected exchanges
      if (status === 'cancelled' || status === 'rejected') {
        const action = status === 'cancelled' ? 'cancelled' : 'rejected';
        
        // Log cancellation/rejection activities
        await this.logActivity(
          updatedExchange.offerer_id,
          `skill_exchange_${action}`,
          `Skill exchange ${action}`,
          0,
          updatedExchange.id,
          'skill_exchange'
        );
        
        await this.logActivity(
          updatedExchange.requester_id,
          `skill_exchange_${action}`,
          `Skill exchange ${action}`,
          0,
          updatedExchange.id,
          'skill_exchange'
        );
      }
    }
    
    return updatedExchange;
  }

  // Theme preferences methods
  async getUserThemePreferences(userId: number): Promise<{ color_scheme: string, theme_mode: string, accent_color: string } | undefined> {
    const [user] = await db
      .select({
        color_scheme: users.color_scheme,
        theme_mode: users.theme_mode,
        accent_color: users.accent_color
      })
      .from(users)
      .where(eq(users.id, userId));
      
    return user || undefined;
  }
  
  async updateUserThemePreferences(userId: number, preferences: { color_scheme?: string, theme_mode?: string, accent_color?: string }): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...preferences,
        updated_at: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
  }
  
  // Image Locker - Category methods
  async getImageCategories(): Promise<ImageCategory[]> {
    return db
      .select()
      .from(image_categories)
      .orderBy(asc(image_categories.name));
  }

  async getImageCategoryById(id: number): Promise<ImageCategory | undefined> {
    const [category] = await db
      .select()
      .from(image_categories)
      .where(eq(image_categories.id, id));
    
    return category || undefined;
  }

  async createImageCategory(category: InsertImageCategory): Promise<ImageCategory> {
    const [newCategory] = await db
      .insert(image_categories)
      .values(category)
      .returning();
    
    return newCategory;
  }

  async updateImageCategory(id: number, category: Partial<InsertImageCategory>): Promise<ImageCategory | undefined> {
    const [updatedCategory] = await db
      .update(image_categories)
      .set({
        ...category,
        updated_at: new Date()
      })
      .where(eq(image_categories.id, id))
      .returning();
    
    return updatedCategory || undefined;
  }

  async deleteImageCategory(id: number): Promise<boolean> {
    try {
      await db
        .delete(image_categories)
        .where(eq(image_categories.id, id));
      
      return true;
    } catch (error) {
      console.error('Error deleting image category:', error);
      return false;
    }
  }

  // Image Locker - App Pages methods
  async getAppPages(): Promise<AppPage[]> {
    return db
      .select()
      .from(app_pages)
      .orderBy(asc(app_pages.name));
  }

  async getAppPageById(id: number): Promise<AppPage | undefined> {
    const [page] = await db
      .select()
      .from(app_pages)
      .where(eq(app_pages.id, id));
    
    return page || undefined;
  }

  async getAppPageByName(name: string): Promise<AppPage | undefined> {
    const [page] = await db
      .select()
      .from(app_pages)
      .where(eq(app_pages.name, name));
    
    return page || undefined;
  }

  async getAppPageByRoute(route: string): Promise<AppPage | undefined> {
    const [page] = await db
      .select()
      .from(app_pages)
      .where(eq(app_pages.route, route));
    
    return page || undefined;
  }

  async createAppPage(page: InsertAppPage): Promise<AppPage> {
    const [newPage] = await db
      .insert(app_pages)
      .values(page)
      .returning();
    
    return newPage;
  }

  async updateAppPage(id: number, page: Partial<InsertAppPage>): Promise<AppPage | undefined> {
    const [updatedPage] = await db
      .update(app_pages)
      .set(page)
      .where(eq(app_pages.id, id))
      .returning();
    
    return updatedPage || undefined;
  }

  async deleteAppPage(id: number): Promise<boolean> {
    try {
      await db
        .delete(app_pages)
        .where(eq(app_pages.id, id));
      
      return true;
    } catch (error) {
      console.error('Error deleting app page:', error);
      return false;
    }
  }

  // Image Locker - Image methods
  async getImages(categoryId?: number, options?: { limit?: number, offset?: number, active?: boolean }): Promise<Image[]> {
    let query = db.select().from(images);
    
    if (categoryId) {
      query = query.where(eq(images.category_id, categoryId));
    }
    
    if (options?.active !== undefined) {
      query = query.where(eq(images.is_active, options.active));
    }
    
    query = query.orderBy(desc(images.uploaded_at));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return query;
  }

  async getImageById(id: number): Promise<Image | undefined> {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, id));
    
    return image || undefined;
  }

  async createImage(image: InsertImage): Promise<Image> {
    const [newImage] = await db
      .insert(images)
      .values({
        ...image,
        uploaded_at: new Date()
      })
      .returning();
    
    return newImage;
  }

  async updateImage(id: number, image: Partial<InsertImage>): Promise<Image | undefined> {
    const [updatedImage] = await db
      .update(images)
      .set(image)
      .where(eq(images.id, id))
      .returning();
    
    return updatedImage || undefined;
  }

  async toggleImageActive(id: number): Promise<Image | undefined> {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, id));
    
    if (!image) {
      return undefined;
    }
    
    const [updatedImage] = await db
      .update(images)
      .set({
        is_active: !image.is_active
      })
      .where(eq(images.id, id))
      .returning();
    
    return updatedImage;
  }

  async deleteImage(id: number): Promise<boolean> {
    try {
      await db
        .delete(images)
        .where(eq(images.id, id));
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  async incrementImageUsageCount(id: number): Promise<Image | undefined> {
    const [updatedImage] = await db
      .update(images)
      .set({
        usage_count: sql`${images.usage_count} + 1`
      })
      .where(eq(images.id, id))
      .returning();
    
    return updatedImage || undefined;
  }

  // Image Locker - Image-Page mappings methods
  async getImagesForPage(pageId: number, options?: { usageType?: string, limit?: number, offset?: number }): Promise<(Image & { mapping: ImagePageMapping })[]> {
    let query = db
      .select({
        ...images,
        mapping: image_page_mappings
      })
      .from(images)
      .innerJoin(
        image_page_mappings,
        and(
          eq(images.id, image_page_mappings.image_id),
          eq(image_page_mappings.page_id, pageId)
        )
      );
    
    if (options?.usageType) {
      query = query.where(eq(image_page_mappings.usage_type, options.usageType));
    }
    
    query = query.orderBy(asc(image_page_mappings.position));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return query;
  }

  async getPagesForImage(imageId: number): Promise<(AppPage & { mapping: ImagePageMapping })[]> {
    return db
      .select({
        ...app_pages,
        mapping: image_page_mappings
      })
      .from(app_pages)
      .innerJoin(
        image_page_mappings,
        and(
          eq(app_pages.id, image_page_mappings.page_id),
          eq(image_page_mappings.image_id, imageId)
        )
      )
      .orderBy(asc(app_pages.name));
  }

  async createImagePageMapping(mapping: InsertImagePageMapping): Promise<ImagePageMapping> {
    // Increment the image usage count
    await this.incrementImageUsageCount(mapping.image_id);
    
    const [newMapping] = await db
      .insert(image_page_mappings)
      .values({
        ...mapping,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();
    
    return newMapping;
  }

  async updateImagePageMapping(imageId: number, pageId: number, mapping: Partial<InsertImagePageMapping>): Promise<ImagePageMapping | undefined> {
    const [updatedMapping] = await db
      .update(image_page_mappings)
      .set({
        ...mapping,
        updated_at: new Date()
      })
      .where(
        and(
          eq(image_page_mappings.image_id, imageId),
          eq(image_page_mappings.page_id, pageId)
        )
      )
      .returning();
    
    return updatedMapping || undefined;
  }

  async deleteImagePageMapping(imageId: number, pageId: number): Promise<boolean> {
    try {
      // Decrement the image usage count if needed
      const image = await this.getImageById(imageId);
      if (image && image.usage_count > 0) {
        await db
          .update(images)
          .set({
            usage_count: image.usage_count - 1
          })
          .where(eq(images.id, imageId));
      }
      
      await db
        .delete(image_page_mappings)
        .where(
          and(
            eq(image_page_mappings.image_id, imageId),
            eq(image_page_mappings.page_id, pageId)
          )
        );
      
      return true;
    } catch (error) {
      console.error('Error deleting image-page mapping:', error);
      return false;
    }
  }

  // Image Locker - Tags methods
  async getImageTags(): Promise<ImageTag[]> {
    return db
      .select()
      .from(image_tags)
      .orderBy(asc(image_tags.name));
  }

  async createImageTag(tag: InsertImageTag): Promise<ImageTag> {
    const [newTag] = await db
      .insert(image_tags)
      .values(tag)
      .returning();
    
    return newTag;
  }

  async tagImage(imageId: number, tagId: number): Promise<void> {
    // Check if the tag is already applied
    const [existingTag] = await db
      .select()
      .from(image_tag_mappings)
      .where(
        and(
          eq(image_tag_mappings.image_id, imageId),
          eq(image_tag_mappings.tag_id, tagId)
        )
      );
    
    if (!existingTag) {
      await db
        .insert(image_tag_mappings)
        .values({
          image_id: imageId,
          tag_id: tagId
        });
    }
  }

  async untagImage(imageId: number, tagId: number): Promise<void> {
    await db
      .delete(image_tag_mappings)
      .where(
        and(
          eq(image_tag_mappings.image_id, imageId),
          eq(image_tag_mappings.tag_id, tagId)
        )
      );
  }

  async getImagesByTag(tagId: number, options?: { limit?: number, offset?: number }): Promise<Image[]> {
    let query = db
      .select({
        ...images
      })
      .from(images)
      .innerJoin(
        image_tag_mappings,
        and(
          eq(images.id, image_tag_mappings.image_id),
          eq(image_tag_mappings.tag_id, tagId)
        )
      )
      .orderBy(desc(images.uploaded_at));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return query;
  }

  async getTagsForImage(imageId: number): Promise<ImageTag[]> {
    return db
      .select({
        ...image_tags
      })
      .from(image_tags)
      .innerJoin(
        image_tag_mappings,
        and(
          eq(image_tags.id, image_tag_mappings.tag_id),
          eq(image_tag_mappings.image_id, imageId)
        )
      )
      .orderBy(asc(image_tags.name));
  }
}

export const storage = new DatabaseStorage();