import { 
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
  type InsertSkillExchange
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, or } from "drizzle-orm";

// Skill marketplace methods - Categories
export async function getSkillCategories(): Promise<SkillCategory[]> {
  return db.select().from(skill_categories).orderBy(asc(skill_categories.name));
}

export async function getSkillCategoryById(id: number): Promise<SkillCategory | undefined> {
  const [category] = await db.select().from(skill_categories).where(eq(skill_categories.id, id));
  return category || undefined;
}

export async function createSkillCategory(category: InsertSkillCategory): Promise<SkillCategory> {
  const [newCategory] = await db.insert(skill_categories).values(category).returning();
  return newCategory;
}

// Skill marketplace methods - Offerings
export async function getSkillOfferings(categoryId?: number, userId?: number, activeOnly: boolean = false): Promise<SkillOffering[]> {
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

export async function getSkillOfferingById(id: number): Promise<SkillOffering | undefined> {
  const [offering] = await db.select().from(skill_offerings).where(eq(skill_offerings.id, id));
  return offering || undefined;
}

export async function createSkillOffering(offering: InsertSkillOffering): Promise<SkillOffering> {
  const [newOffering] = await db.insert(skill_offerings).values(offering).returning();
  return newOffering;
}

export async function toggleSkillOfferingStatus(id: number): Promise<SkillOffering | undefined> {
  // Get current offering
  const offering = await getSkillOfferingById(id);
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
export async function getSkillRequests(categoryId?: number, userId?: number, activeOnly: boolean = false): Promise<SkillRequest[]> {
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

export async function getSkillRequestById(id: number): Promise<SkillRequest | undefined> {
  const [request] = await db.select().from(skill_requests).where(eq(skill_requests.id, id));
  return request || undefined;
}

export async function createSkillRequest(request: InsertSkillRequest): Promise<SkillRequest> {
  const [newRequest] = await db.insert(skill_requests).values(request).returning();
  return newRequest;
}

export async function toggleSkillRequestStatus(id: number): Promise<SkillRequest | undefined> {
  // Get current request
  const request = await getSkillRequestById(id);
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
export async function getSkillExchanges(userId?: number, status?: string): Promise<SkillExchange[]> {
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

export async function getSkillExchangeById(id: number): Promise<SkillExchange | undefined> {
  const [exchange] = await db.select().from(skill_exchanges).where(eq(skill_exchanges.id, id));
  return exchange || undefined;
}

export async function createSkillExchange(exchange: InsertSkillExchange): Promise<SkillExchange> {
  const [newExchange] = await db.insert(skill_exchanges).values(exchange).returning();
  return newExchange;
}

export async function updateSkillExchangeStatus(id: number, status: string): Promise<SkillExchange | undefined> {
  // Get current exchange
  const exchange = await getSkillExchangeById(id);
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
  
  return updatedExchange;
}