import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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
  avatar_url: text("avatar_url"),
  avatar_svg: text("avatar_svg"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
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
  mediaThumbnail: text('media_thumbnail'),
  documentTitle: text('document_title'),
  documentDescription: text('document_description'),
  actionUrl: text('action_url'),
  actionText: text('action_text'),
  displayOrder: integer('display_order').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export type InsertLandingContent = typeof landingContent.$inferInsert;
export type LandingContent = typeof landingContent.$inferSelect;


// Friendship system tables
export const friendships = pgTable('friendships', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  friend_id: integer('friend_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull().default('pending'), // pending, accepted, rejected
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const bridges = pgTable('bridges', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  total_bridges: integer('total_bridges').notNull().default(0),
  houses_built: integer('houses_built').notNull().default(0),
  level: integer('level').notNull().default(1),
  updated_at: timestamp('updated_at').defaultNow()
});

// Define relationships
export const userRelations = relations(users, ({ many }) => ({
  sentFriendships: many(friendships, { relationName: 'userSentFriendships' }),
  receivedFriendships: many(friendships, { relationName: 'userReceivedFriendships' }),
  bridges: many(bridges)
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.user_id],
    references: [users.id],
    relationName: 'userSentFriendships'
  }),
  friend: one(users, {
    fields: [friendships.friend_id],
    references: [users.id],
    relationName: 'userReceivedFriendships'
  })
}));

export const bridgesRelations = relations(bridges, ({ one }) => ({
  user: one(users, {
    fields: [bridges.user_id],
    references: [users.id]
  })
}));

// Insert Schemas
export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertBridgeSchema = createInsertSchema(bridges).omit({
  id: true,
  updated_at: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegistrationForm = z.infer<typeof registrationSchema>;

export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

export type InsertBridge = z.infer<typeof insertBridgeSchema>;
export type Bridge = typeof bridges.$inferSelect;