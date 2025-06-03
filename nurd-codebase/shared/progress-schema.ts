import { pgTable, text, serial, integer, boolean, timestamp, primaryKey, foreignKey, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users Table - minimally modified from existing schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  age: integer("age").notNull(),
  grade_level: text("grade_level").notNull(),
  user_type: text("user_type").notNull(),
  gender: text("gender").notNull(),
  path_choice: text("path_choice"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  xp_points: integer("xp_points").default(0),
  level: integer("level").default(1),
  avatar_svg: text("avatar_svg"),
  avatar_data: jsonb("avatar_data"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Course Difficulty Enum
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced']);

// Courses/Modules Table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image_url: text("image_url"),
  category: text("category").notNull(),
  level: difficultyEnum("level").notNull(),
  duration: text("duration").notNull(),
  total_lessons: integer("total_lessons").notNull(),
  total_xp: integer("total_xp").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  is_featured: boolean("is_featured").default(false),
  is_published: boolean("is_published").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Lessons Table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  course_id: integer("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  order_index: integer("order_index").notNull(),
  duration_minutes: integer("duration_minutes").default(15),
  xp_reward: integer("xp_reward").default(10),
  has_quiz: boolean("has_quiz").default(false),
  resources: jsonb("resources").$type<{ title: string, url: string, type: string }[]>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User Progress Table (for courses)
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  course_id: integer("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  progress_percentage: integer("progress_percentage").default(0),
  completed_lessons: integer("completed_lessons").default(0),
  start_date: timestamp("start_date").defaultNow(),
  last_accessed: timestamp("last_accessed").defaultNow(),
  completion_date: timestamp("completion_date"),
  is_completed: boolean("is_completed").default(false),
  earned_xp: integer("earned_xp").default(0),
});

// Lesson Progress Table (for individual lessons)
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lesson_id: integer("lesson_id").references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  is_completed: boolean("is_completed").default(false),
  quiz_score: integer("quiz_score"),
  time_spent_minutes: integer("time_spent_minutes").default(0),
  last_accessed: timestamp("last_accessed").defaultNow(),
  completion_date: timestamp("completion_date"),
  notes: text("notes"),
});

// Achievement Types Enum
export const achievementTypeEnum = pgEnum('achievement_type', ['completion', 'streak', 'milestone', 'special']);

// Achievements Table (defines available achievements)
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: achievementTypeEnum("type").notNull(),
  image_url: text("image_url").notNull(),
  xp_reward: integer("xp_reward").default(50),
  requirement: text("requirement").notNull(),
  requirement_value: integer("requirement_value"),
  is_hidden: boolean("is_hidden").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// User Achievements Table (tracks earned achievements)
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  achievement_id: integer("achievement_id").references(() => achievements.id, { onDelete: 'cascade' }).notNull(),
  earned_at: timestamp("earned_at").defaultNow(),
  is_viewed: boolean("is_viewed").default(false),
});

// Streaks Table (for tracking consecutive activity)
export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  current_streak: integer("current_streak").default(0),
  max_streak: integer("max_streak").default(0),
  last_activity_date: timestamp("last_activity_date").defaultNow(),
});

// Landing Content Table
export const landingContent = pgTable("landing_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Activity Logs (for detailed tracking)
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  activity_type: text("activity_type").notNull(),
  activity_detail: text("activity_detail"),
  xp_earned: integer("xp_earned").default(0),
  created_at: timestamp("created_at").defaultNow(),
  related_id: integer("related_id"), // Could be course_id, lesson_id, etc.
  related_type: text("related_type"), // 'course', 'lesson', etc.
});

// Define relationships for Users
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  lessonProgress: many(lessonProgress),
  achievements: many(userAchievements),
  streaks: many(streaks),
  activityLogs: many(activityLogs),
}));

// Define relationships for Courses
export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  userProgress: many(userProgress),
}));

// Define relationships for Lessons
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.course_id],
    references: [courses.id],
  }),
  progress: many(lessonProgress),
}));

// Define relationships for User Progress
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.user_id],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userProgress.course_id],
    references: [courses.id],
  }),
}));

// Define relationships for Lesson Progress
export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.user_id],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lesson_id],
    references: [lessons.id],
  }),
}));

// Define relationships for Achievements
export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

// Define relationships for User Achievements
export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.user_id],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievement_id],
    references: [achievements.id],
  }),
}));

// Define relationships for Streaks
export const streaksRelations = relations(streaks, ({ one }) => ({
  user: one(users, {
    fields: [streaks.user_id],
    references: [users.id],
  }),
}));

// Define relationships for Activity Logs
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.user_id],
    references: [users.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  first_name: true,
  age: true,
  grade_level: true,
  user_type: true,
  gender: true,
  path_choice: true,
  username: true,
  password: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  start_date: true,
  last_accessed: true,
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({
  id: true,
  last_accessed: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  created_at: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earned_at: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;