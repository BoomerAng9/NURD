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

// Skill marketplace tables
export const skill_categories = pgTable('skill_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  created_at: timestamp('created_at').defaultNow()
});

export const skill_offerings = pgTable('skill_offerings', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  category_id: integer('category_id').references(() => skill_categories.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  skill_level: text('skill_level').notNull(), // beginner, intermediate, advanced
  time_commitment: text('time_commitment').notNull(),
  xp_reward: integer('xp_reward').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const skill_requests = pgTable('skill_requests', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  category_id: integer('category_id').references(() => skill_categories.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  desired_skill_level: text('desired_skill_level').notNull(), // beginner, intermediate, advanced
  time_availability: text('time_availability').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const skill_exchanges = pgTable('skill_exchanges', {
  id: serial('id').primaryKey(),
  offering_id: integer('offering_id').references(() => skill_offerings.id, { onDelete: 'cascade' }),
  request_id: integer('request_id').references(() => skill_requests.id, { onDelete: 'cascade' }),
  offerer_id: integer('offerer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  requester_id: integer('requester_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull().default('pending'), // pending, accepted, completed, cancelled
  offerer_rating: integer('offerer_rating'),
  requester_rating: integer('requester_rating'),
  offerer_feedback: text('offerer_feedback'),
  requester_feedback: text('requester_feedback'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  completed_at: timestamp('completed_at')
});

// Define relationships
export const userRelations = relations(users, ({ many }) => ({
  sentFriendships: many(friendships, { relationName: 'userSentFriendships' }),
  receivedFriendships: many(friendships, { relationName: 'userReceivedFriendships' }),
  bridges: many(bridges),
  skillOfferings: many(skill_offerings),
  skillRequests: many(skill_requests),
  skillExchangesAsOfferer: many(skill_exchanges, { relationName: 'userOfferedExchanges' }),
  skillExchangesAsRequester: many(skill_exchanges, { relationName: 'userRequestedExchanges' })
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

// Skill marketplace relations
export const skillCategoriesRelations = relations(skill_categories, ({ many }) => ({
  offerings: many(skill_offerings),
  requests: many(skill_requests)
}));

export const skillOfferingsRelations = relations(skill_offerings, ({ one, many }) => ({
  user: one(users, {
    fields: [skill_offerings.user_id],
    references: [users.id]
  }),
  category: one(skill_categories, {
    fields: [skill_offerings.category_id],
    references: [skill_categories.id]
  }),
  exchanges: many(skill_exchanges, { relationName: 'offeringExchanges' })
}));

export const skillRequestsRelations = relations(skill_requests, ({ one, many }) => ({
  user: one(users, {
    fields: [skill_requests.user_id],
    references: [users.id]
  }),
  category: one(skill_categories, {
    fields: [skill_requests.category_id],
    references: [skill_categories.id]
  }),
  exchanges: many(skill_exchanges, { relationName: 'requestExchanges' })
}));

export const skillExchangesRelations = relations(skill_exchanges, ({ one }) => ({
  offering: one(skill_offerings, {
    fields: [skill_exchanges.offering_id],
    references: [skill_offerings.id],
    relationName: 'offeringExchanges'
  }),
  request: one(skill_requests, {
    fields: [skill_exchanges.request_id],
    references: [skill_requests.id],
    relationName: 'requestExchanges'
  }),
  offerer: one(users, {
    fields: [skill_exchanges.offerer_id],
    references: [users.id],
    relationName: 'userOfferedExchanges'
  }),
  requester: one(users, {
    fields: [skill_exchanges.requester_id],
    references: [users.id],
    relationName: 'userRequestedExchanges'
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

// Skill marketplace schemas
export const insertSkillCategorySchema = createInsertSchema(skill_categories).omit({
  id: true,
  created_at: true
});

export const insertSkillOfferingSchema = createInsertSchema(skill_offerings).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertSkillRequestSchema = createInsertSchema(skill_requests).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertSkillExchangeSchema = createInsertSchema(skill_exchanges).omit({
  id: true,
  created_at: true,
  updated_at: true,
  completed_at: true
});

// Skill marketplace types
export type InsertSkillCategory = z.infer<typeof insertSkillCategorySchema>;
export type SkillCategory = typeof skill_categories.$inferSelect;

export type InsertSkillOffering = z.infer<typeof insertSkillOfferingSchema>;
export type SkillOffering = typeof skill_offerings.$inferSelect;

export type InsertSkillRequest = z.infer<typeof insertSkillRequestSchema>;
export type SkillRequest = typeof skill_requests.$inferSelect;

export type InsertSkillExchange = z.infer<typeof insertSkillExchangeSchema>;
export type SkillExchange = typeof skill_exchanges.$inferSelect;