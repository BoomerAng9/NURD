import { Request, Response } from 'express';
import { db } from './db';
import { users, user_preferences, insertUserPreferencesSchema, userPreferencesSchema } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { Session } from 'express-session';

// Extend Request to include typed session
interface RequestWithUser extends Request {
  session: Session & {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean;
      [key: string]: any;
    }
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(req: RequestWithUser, res: Response) {
  try {
    // Get user ID from session
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Fetch user preferences
    const preferences = await db.query.user_preferences.findFirst({
      where: eq(user_preferences.user_id, userId)
    });

    if (!preferences) {
      // Create default preferences if not exist
      const defaultPrefs = {
        user_id: userId,
        font_size: 'medium',
        high_contrast: false,
        reduced_motion: false,
        language: 'en'
      };
      
      const newPrefs = await db.insert(user_preferences).values(defaultPrefs).returning();
      return res.json({
        success: true,
        preferences: {
          id: newPrefs[0].id,
          userId: newPrefs[0].user_id,
          fontSize: newPrefs[0].font_size,
          highContrast: newPrefs[0].high_contrast,
          reducedMotion: newPrefs[0].reduced_motion,
          language: newPrefs[0].language
        }
      });
    }

    // Format response with camelCase keys for frontend
    return res.json({
      success: true,
      preferences: {
        id: preferences.id,
        userId: preferences.user_id,
        fontSize: preferences.font_size,
        highContrast: preferences.high_contrast,
        reducedMotion: preferences.reduced_motion,
        language: preferences.language
      }
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(req: RequestWithUser, res: Response) {
  try {
    // Get user ID from session
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate request body
    const updateSchema = z.object({
      fontSize: z.enum(['small', 'medium', 'large']).optional(),
      highContrast: z.boolean().optional(),
      reducedMotion: z.boolean().optional(),
      language: z.enum(['en', 'es', 'fr']).optional()
    });

    const validatedData = updateSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: 'Invalid preferences data',
        details: validatedData.error.format()
      });
    }

    const updates: Record<string, any> = {};
    const data = validatedData.data;

    // Map camelCase frontend keys to snake_case database keys
    if (data.fontSize !== undefined) updates.font_size = data.fontSize;
    if (data.highContrast !== undefined) updates.high_contrast = data.highContrast;
    if (data.reducedMotion !== undefined) updates.reduced_motion = data.reducedMotion;
    if (data.language !== undefined) updates.language = data.language;

    // Check if preferences exist for the user
    const existingPrefs = await db.query.user_preferences.findFirst({
      where: eq(user_preferences.user_id, userId)
    });

    if (!existingPrefs) {
      // Create new preferences record
      const newPrefs = {
        user_id: userId,
        ...updates
      };
      
      const inserted = await db.insert(user_preferences).values(newPrefs).returning();
      return res.json({
        success: true,
        preferences: {
          id: inserted[0].id,
          userId: inserted[0].user_id,
          fontSize: inserted[0].font_size,
          highContrast: inserted[0].high_contrast,
          reducedMotion: inserted[0].reduced_motion,
          language: inserted[0].language
        }
      });
    }

    // Update existing preferences
    const updated = await db.update(user_preferences)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(user_preferences.user_id, userId))
      .returning();

    return res.json({
      success: true,
      preferences: {
        id: updated[0].id,
        userId: updated[0].user_id,
        fontSize: updated[0].font_size,
        highContrast: updated[0].high_contrast,
        reducedMotion: updated[0].reduced_motion,
        language: updated[0].language
      }
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Failed to update user preferences' });
  }
}

/**
 * Reset user preferences to defaults
 */
export async function resetUserPreferences(req: RequestWithUser, res: Response) {
  try {
    // Get user ID from session
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const defaultPrefs = {
      font_size: 'medium',
      high_contrast: false,
      reduced_motion: false,
      language: 'en'
    };

    // Update with default preferences
    const updated = await db.update(user_preferences)
      .set({ ...defaultPrefs, updated_at: new Date() })
      .where(eq(user_preferences.user_id, userId))
      .returning();

    if (updated.length === 0) {
      // Create default preferences if not exist
      const newPrefs = {
        user_id: userId,
        ...defaultPrefs
      };
      
      const inserted = await db.insert(user_preferences).values(newPrefs).returning();
      return res.json({
        success: true,
        preferences: {
          id: inserted[0].id,
          userId: inserted[0].user_id,
          fontSize: inserted[0].font_size,
          highContrast: inserted[0].high_contrast,
          reducedMotion: inserted[0].reduced_motion,
          language: inserted[0].language
        }
      });
    }

    return res.json({
      success: true,
      preferences: {
        id: updated[0].id,
        userId: updated[0].user_id,
        fontSize: updated[0].font_size,
        highContrast: updated[0].high_contrast,
        reducedMotion: updated[0].reduced_motion,
        language: updated[0].language
      }
    });
  } catch (error) {
    console.error('Error resetting user preferences:', error);
    return res.status(500).json({ error: 'Failed to reset user preferences' });
  }
}

/**
 * Auto-detect user preferences based on system settings (handled client-side)
 * This API receives the detected preferences and saves them
 */
export async function autoDetectUserPreferences(req: RequestWithUser, res: Response) {
  try {
    // Get user ID from session
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate request body
    const detectionSchema = z.object({
      highContrast: z.boolean().optional(),
      reducedMotion: z.boolean().optional()
    });

    const validatedData = detectionSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: 'Invalid preferences data',
        details: validatedData.error.format()
      });
    }

    const data = validatedData.data;
    const updates: Record<string, any> = {};
    
    if (data.highContrast !== undefined) updates.high_contrast = data.highContrast;
    if (data.reducedMotion !== undefined) updates.reduced_motion = data.reducedMotion;

    // Check if preferences exist for the user
    const existingPrefs = await db.query.user_preferences.findFirst({
      where: eq(user_preferences.user_id, userId)
    });

    if (!existingPrefs) {
      // Create new preferences with detected settings
      const newPrefs = {
        user_id: userId,
        font_size: 'medium', // Default
        language: 'en', // Default
        ...updates
      };
      
      const inserted = await db.insert(user_preferences).values(newPrefs).returning();
      return res.json({
        success: true,
        preferences: {
          id: inserted[0].id,
          userId: inserted[0].user_id,
          fontSize: inserted[0].font_size,
          highContrast: inserted[0].high_contrast,
          reducedMotion: inserted[0].reduced_motion,
          language: inserted[0].language
        }
      });
    }

    // Update existing preferences with detected settings
    const updated = await db.update(user_preferences)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(user_preferences.user_id, userId))
      .returning();

    return res.json({
      success: true,
      preferences: {
        id: updated[0].id,
        userId: updated[0].user_id,
        fontSize: updated[0].font_size,
        highContrast: updated[0].high_contrast,
        reducedMotion: updated[0].reduced_motion,
        language: updated[0].language
      }
    });
  } catch (error) {
    console.error('Error updating auto-detected preferences:', error);
    return res.status(500).json({ error: 'Failed to auto-detect user preferences' });
  }
}