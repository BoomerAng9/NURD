import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// This is a simplified schema that contains only what's needed outside the progress tracking
// For complete progress tracking schema, see progress-schema.ts

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
});

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

export const registrationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  age: z.number().min(8, "Age must be at least 8").max(18, "Age must be at most 18"),
  grade_level: z.string().min(1, "Grade level is required"),
  user_type: z.enum(["student", "parent"], { 
    required_error: "Please select student or parent" 
  }),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], { 
    required_error: "Please select a gender" 
  }),
  path_choice: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const landingContent = pgTable('landing_content', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),
  mediaType: text('media_type'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export type InsertLandingContent = typeof landingContent.$inferInsert;
export type LandingContent = typeof landingContent.$inferSelect;


export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegistrationForm = z.infer<typeof registrationSchema>;
export type LandingContent = typeof landingContent.$inferSelect;