import { pgTable, text, serial, integer, timestamp, boolean, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// This is a simplified schema that contains only what's needed outside the progress tracking
// For complete progress tracking schema, see progress-schema.ts

// Session storage table for Replit Auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
}, (table) => {
  return {
    expireIdx: index("IDX_session_expire").on(table.expire),
  };
});

export const users = pgTable("users", {
  // Changed back to serial integer ID after removing Replit Auth
  id: serial("id").primaryKey(),
  username: varchar("username").unique().notNull(),
  email: text("email").unique(),
  
  // Original fields from the current schema
  age: integer("age"),
  grade_level: text("grade_level"),
  user_type: text("user_type"),
  gender: text("gender"),
  path_choice: text("path_choice"),
  password: text("password"),
  avatar_url: text("avatar_url"),
  avatar_svg: text("avatar_svg"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  is_admin: boolean("is_admin").default(false),
  is_freelancer: boolean("is_freelancer").default(false),
  subscriptionTier: text("subscription_tier").default("free"), // Options: free, standard, premium
  color_scheme: text("color_scheme").default("default"), // Options: default, ocean, forest, sunset, space
  theme_mode: text("theme_mode").default("system"), // Options: system, light, dark
  accent_color: text("accent_color").default("#3B82F6"), // Primary accent color
  google_id: text("google_id").unique(),
  facebook_id: text("facebook_id").unique(),
  github_id: text("github_id").unique(),
  microsoft_id: text("microsoft_id").unique(),
  apple_id: text("apple_id").unique(),
  email_verified: boolean("email_verified").default(false),
  verification_token: text("verification_token"),
  reset_password_token: text("reset_password_token"),
  reset_password_expires: timestamp("reset_password_expires"),
  last_login: timestamp("last_login"),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// New table for user accessibility preferences
export const user_preferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  font_size: text("font_size").default("medium").notNull(), // small, medium, large
  high_contrast: boolean("high_contrast").default(false).notNull(),
  reduced_motion: boolean("reduced_motion").default(false).notNull(),
  language: text("language").default("en"), // en, es, fr
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  age: true,
  grade_level: true,
  user_type: true,
  gender: true,
  path_choice: true,
  username: true,
  password: true,
  email: true,
  subscriptionTier: true,
  color_scheme: true,
  theme_mode: true,
  accent_color: true,
  google_id: true,
  facebook_id: true, 
  github_id: true,
  microsoft_id: true,
  apple_id: true,
  email_verified: true,
  verification_token: true,
  reset_password_token: true,
  reset_password_expires: true,
  stripe_customer_id: true,
  stripe_subscription_id: true,
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
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ssoLoginSchema = z.object({
  provider: z.enum(["google", "facebook", "github", "microsoft", "apple"], {
    required_error: "Please select a valid login provider"
  }),
  token: z.string(),
  redirectUrl: z.string().optional(),
});

export const themePreferencesSchema = z.object({
  color_scheme: z.enum(["default", "ocean", "forest", "sunset", "space"], {
    required_error: "Please select a valid color scheme"
  }),
  theme_mode: z.enum(["system", "light", "dark"], {
    required_error: "Please select a valid theme mode"
  }),
  accent_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Accent color must be a valid hex color code"
  })
});

export const userPreferencesSchema = z.object({
  fontSize: z.enum(["small", "medium", "large"], {
    required_error: "Please select a valid font size"
  }),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  // Optional language preference - can be expanded in future
  language: z.enum(["en", "es", "fr"]).optional()
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
export const userRelations = relations(users, ({ many, one }) => ({
  sentFriendships: many(friendships, { relationName: 'userSentFriendships' }),
  receivedFriendships: many(friendships, { relationName: 'userReceivedFriendships' }),
  bridges: many(bridges),
  preferences: one(user_preferences),
  skillOfferings: many(skill_offerings),
  skillRequests: many(skill_requests),
  skillExchangesAsOfferer: many(skill_exchanges, { relationName: 'userOfferedExchanges' }),
  skillExchangesAsRequester: many(skill_exchanges, { relationName: 'userRequestedExchanges' })
}));

export const userPreferencesRelations = relations(user_preferences, ({ one }) => ({
  user: one(users, {
    fields: [user_preferences.user_id],
    references: [users.id]
  })
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
export type SSOLoginForm = z.infer<typeof ssoLoginSchema>;

// After removing Replit Auth
export type UpsertUser = {
  id: number;
  username: string;
  email?: string;
};
export type ThemePreferences = z.infer<typeof themePreferencesSchema>;

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

// User preferences schema and types
export const insertUserPreferencesSchema = createInsertSchema(user_preferences).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof user_preferences.$inferSelect;
export type UserPreferencesSettings = z.infer<typeof userPreferencesSchema>;

// Image Locker System

// Image Categories 
export const image_categories = pgTable('image_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Application Pages (for associating images with specific pages)
export const app_pages = pgTable('app_pages', {
  id: serial('id').primaryKey(), 
  name: text('name').notNull().unique(),
  route: text('route').notNull(),
  description: text('description')
});

// Main Images table
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  original_filename: text('original_filename'),
  path: text('path').notNull(),
  size: integer('size'),
  mimetype: text('mimetype'),
  width: integer('width'),
  height: integer('height'),
  alt_text: text('alt_text'),
  title: text('title'),
  category_id: integer('category_id').references(() => image_categories.id),
  uploaded_by: integer('uploaded_by').references(() => users.id),
  uploaded_at: timestamp('uploaded_at').defaultNow().notNull(),
  is_active: boolean('is_active').default(true),
  usage_count: integer('usage_count').default(0)
});

// Image-Page association (many-to-many)
export const image_page_mappings = pgTable('image_page_mappings', {
  id: serial('id').primaryKey(),
  image_id: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  page_id: integer('page_id').notNull().references(() => app_pages.id, { onDelete: 'cascade' }),
  usage_type: text('usage_type'), // e.g., 'hero', 'background', 'gallery', 'section'
  position: integer('position'), // For ordering images on a page
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Image-Tag association for better searchability
export const image_tags = pgTable('image_tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique()
});

export const image_tag_mappings = pgTable('image_tag_mappings', {
  image_id: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  tag_id: integer('tag_id').notNull().references(() => image_tags.id, { onDelete: 'cascade' })
});

// Relations
export const imageCategoriesRelations = relations(image_categories, ({ many }) => ({
  images: many(images)
}));

export const imagesRelations = relations(images, ({ one, many }) => ({
  category: one(image_categories, {
    fields: [images.category_id],
    references: [image_categories.id]
  }),
  uploader: one(users, {
    fields: [images.uploaded_by],
    references: [users.id]
  }),
  pageMappings: many(image_page_mappings),
  tagMappings: many(image_tag_mappings)
}));

export const appPagesRelations = relations(app_pages, ({ many }) => ({
  imageMappings: many(image_page_mappings)
}));

export const imagePageMappingsRelations = relations(image_page_mappings, ({ one }) => ({
  image: one(images, {
    fields: [image_page_mappings.image_id],
    references: [images.id]
  }),
  page: one(app_pages, {
    fields: [image_page_mappings.page_id],
    references: [app_pages.id]
  })
}));

export const imageTagsRelations = relations(image_tags, ({ many }) => ({
  imageMappings: many(image_tag_mappings)
}));

export const imageTagMappingsRelations = relations(image_tag_mappings, ({ one }) => ({
  image: one(images, {
    fields: [image_tag_mappings.image_id],
    references: [images.id]
  }),
  tag: one(image_tags, {
    fields: [image_tag_mappings.tag_id],
    references: [image_tags.id]
  })
}));

// Insert schemas
export const insertImageCategorySchema = createInsertSchema(image_categories).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertAppPageSchema = createInsertSchema(app_pages).omit({
  id: true
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  uploaded_at: true,
  usage_count: true
});

export const insertImagePageMappingSchema = createInsertSchema(image_page_mappings).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertImageTagSchema = createInsertSchema(image_tags).omit({
  id: true
});

export const insertImageTagMappingSchema = createInsertSchema(image_tag_mappings);

// Types
export type ImageCategory = typeof image_categories.$inferSelect;
export type InsertImageCategory = z.infer<typeof insertImageCategorySchema>;

export type AppPage = typeof app_pages.$inferSelect;
export type InsertAppPage = z.infer<typeof insertAppPageSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;

export type ImagePageMapping = typeof image_page_mappings.$inferSelect;
export type InsertImagePageMapping = z.infer<typeof insertImagePageMappingSchema>;

export type ImageTag = typeof image_tags.$inferSelect;
export type InsertImageTag = z.infer<typeof insertImageTagSchema>;

export type ImageTagMapping = typeof image_tag_mappings.$inferSelect;
export type InsertImageTagMapping = z.infer<typeof insertImageTagMappingSchema>;