/**
 * Analytics service for the NURD application
 * Provides data for dashboard displays and reporting
 */

import { Request, Response } from 'express';
import { db } from './db';
import { eq, count, sql, desc, and, gte, lte } from 'drizzle-orm';
import { 
  users, 
  skill_exchanges, 
  skill_offerings, 
  skill_requests,
  user_preferences
} from '@shared/schema';

// Define types for our chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface QueryResultRow {
  [key: string]: any;
}

/**
 * Get overall platform statistics
 * For admin dashboard overview
 */
export async function getPlatformStats(req: Request, res: Response) {
  try {
    // Count total users
    const totalUsersResult = await db.select({
      count: count()
    }).from(users);
    
    const totalUsers = totalUsersResult[0]?.count || 0;
    
    // Count active users (users who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersResult = await db.select({
      count: count()
    }).from(users)
    .where(gte(users.last_login, thirtyDaysAgo));
    
    const activeUsers = activeUsersResult[0]?.count || 0;
    
    // Count total skill exchanges
    const totalExchangesResult = await db.select({
      count: count()
    }).from(skill_exchanges);
    
    const totalExchanges = totalExchangesResult[0]?.count || 0;
    
    // Count completed skill exchanges
    const completedExchangesResult = await db.select({
      count: count()
    }).from(skill_exchanges)
    .where(eq(skill_exchanges.status, 'completed'));
    
    const completedExchanges = completedExchangesResult[0]?.count || 0;
    
    // Count active skill offerings and requests
    const activeOfferingsResult = await db.select({
      count: count()
    }).from(skill_offerings)
    .where(eq(skill_offerings.is_active, true));
    
    const activeOfferings = activeOfferingsResult[0]?.count || 0;
    
    const activeRequestsResult = await db.select({
      count: count()
    }).from(skill_requests)
    .where(eq(skill_requests.is_active, true));
    
    const activeRequests = activeRequestsResult[0]?.count || 0;
    
    // Calculate average completion rate
    const completionRate = totalExchanges > 0 
      ? Math.round((completedExchanges / totalExchanges) * 100) 
      : 0;
    
    // Return all stats
    return res.json({
      totalUsers,
      activeUsers,
      totalExchanges,
      completedExchanges,
      activeOfferings,
      activeRequests,
      completionRate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch platform statistics' 
    });
  }
}

/**
 * Get user registration trend over time
 * For admin dashboard charts
 */
export async function getUserGrowthStats(req: Request, res: Response) {
  try {
    // Get period from query params (default: 12 months)
    const period = req.query.period === 'week' ? 'week' : 
                  req.query.period === 'day' ? 'day' : 'month';
    const limit = parseInt(req.query.limit as string) || 12;
    
    let timeFormat: string;
    let periodLabel: string;
    
    switch(period) {
      case 'day':
        timeFormat = 'YYYY-MM-DD';
        periodLabel = 'day';
        break;
      case 'week':
        timeFormat = 'YYYY-WW';
        periodLabel = 'week';
        break;
      case 'month':
      default:
        timeFormat = 'YYYY-MM';
        periodLabel = 'month';
    }
    
    // Use SQL to get registrations grouped by time period
    const registrationData = await db.execute(sql`
      SELECT 
        TO_CHAR(created_at, ${timeFormat}) as period,
        COUNT(*) as new_users
      FROM users
      GROUP BY period
      ORDER BY period DESC
      LIMIT ${limit}
    `);
    
    // Transform the data for chart display
    const result = {
      labels: [],
      datasets: [{
        label: 'New Users',
        data: []
      }]
    };
    
    // Process the registration data
    if (Array.isArray(registrationData)) {
      registrationData.forEach((row: QueryResultRow) => {
        if (row && typeof row.period === 'string' && row.new_users !== undefined) {
          result.labels.unshift(row.period);
          result.datasets[0].data.unshift(parseInt(row.new_users));
        }
      });
    }
    
    return res.json({
      periodType: periodLabel,
      chartData: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user growth stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user growth statistics' 
    });
  }
}

/**
 * Get user activity data for a specific user
 * For user dashboard
 */
export async function getUserActivityStats(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Verify user exists
    const userExists = await db.select({
      id: users.id
    }).from(users)
    .where(eq(users.id, userId))
    .limit(1);
    
    if (userExists.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's skill exchanges
    const exchangesQuery = await db.select({
      id: skill_exchanges.id,
      status: skill_exchanges.status,
      created_at: skill_exchanges.created_at,
      completed_at: skill_exchanges.completed_at
    }).from(skill_exchanges)
    .where(
      sql`(${skill_exchanges.offerer_id} = ${userId} OR ${skill_exchanges.requester_id} = ${userId})`
    )
    .orderBy(desc(skill_exchanges.created_at));
    
    // Get user's skill offerings
    const offeringsQuery = await db.select({
      id: skill_offerings.id,
      title: skill_offerings.title,
      is_active: skill_offerings.is_active,
      created_at: skill_offerings.created_at
    }).from(skill_offerings)
    .where(eq(skill_offerings.user_id, userId))
    .orderBy(desc(skill_offerings.created_at));
    
    // Get user's skill requests
    const requestsQuery = await db.select({
      id: skill_requests.id,
      title: skill_requests.title,
      is_active: skill_requests.is_active,
      created_at: skill_requests.created_at
    }).from(skill_requests)
    .where(eq(skill_requests.user_id, userId))
    .orderBy(desc(skill_requests.created_at));
    
    // Return all user activity data
    return res.json({
      exchanges: exchangesQuery,
      offerings: offeringsQuery,
      requests: requestsQuery,
      summary: {
        totalExchanges: exchangesQuery.length,
        completedExchanges: exchangesQuery.filter(ex => ex.status === 'completed').length,
        activeOfferings: offeringsQuery.filter(off => off.is_active).length,
        activeRequests: requestsQuery.filter(req => req.is_active).length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user activity stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user activity statistics' 
    });
  }
}

/**
 * Get skill marketplace analytics
 * For admin dashboard
 */
export async function getSkillMarketplaceStats(req: Request, res: Response) {
  try {
    // Get top skill categories by offering count
    const topCategoriesQuery = await db.execute(sql`
      SELECT 
        sc.id,
        sc.name,
        COUNT(so.id) as offering_count
      FROM skill_categories sc
      LEFT JOIN skill_offerings so ON sc.id = so.category_id
      GROUP BY sc.id, sc.name
      ORDER BY offering_count DESC
      LIMIT 5
    `);
    
    // Get skill exchange success rate
    const exchangeStatsQuery = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) as total
      FROM skill_exchanges
    `);
    
    // Calculate success and cancellation rates
    const exchangeStats = exchangeStatsQuery[0];
    const totalExchanges = parseInt(exchangeStats.total) || 0;
    
    const successRate = totalExchanges > 0 
      ? Math.round((parseInt(exchangeStats.completed) / totalExchanges) * 100) 
      : 0;
      
    const cancellationRate = totalExchanges > 0 
      ? Math.round((parseInt(exchangeStats.cancelled) / totalExchanges) * 100) 
      : 0;
    
    // Return marketplace analytics
    return res.json({
      topCategories: topCategoriesQuery,
      exchangeStats: {
        completed: parseInt(exchangeStats.completed) || 0,
        cancelled: parseInt(exchangeStats.cancelled) || 0,
        pending: parseInt(exchangeStats.pending) || 0,
        accepted: parseInt(exchangeStats.accepted) || 0,
        total: totalExchanges,
        successRate,
        cancellationRate
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching skill marketplace stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch skill marketplace statistics' 
    });
  }
}

/**
 * Get user preference analytics
 * For admin dashboard
 */
export async function getUserPreferenceStats(req: Request, res: Response) {
  try {
    // Count theme preferences
    const themeStatsQuery = await db.execute(sql`
      SELECT
        theme_mode,
        COUNT(*) as count
      FROM users
      GROUP BY theme_mode
    `);
    
    // Count color scheme preferences
    const colorSchemeStatsQuery = await db.execute(sql`
      SELECT
        color_scheme,
        COUNT(*) as count
      FROM users
      GROUP BY color_scheme
    `);
    
    // Count accessibility preferences
    const accessibilityStatsQuery = await db.execute(sql`
      SELECT
        SUM(CASE WHEN high_contrast = true THEN 1 ELSE 0 END) as high_contrast_count,
        SUM(CASE WHEN reduced_motion = true THEN 1 ELSE 0 END) as reduced_motion_count,
        COUNT(*) as total
      FROM user_preferences
    `);
    
    // Format data for charts
    const themeData = {
      labels: themeStatsQuery.map((row: any) => row.theme_mode || 'Not Set'),
      values: themeStatsQuery.map((row: any) => parseInt(row.count))
    };
    
    const colorSchemeData = {
      labels: colorSchemeStatsQuery.map((row: any) => row.color_scheme || 'Not Set'),
      values: colorSchemeStatsQuery.map((row: any) => parseInt(row.count))
    };
    
    // Return preference analytics
    return res.json({
      themePreferences: themeData,
      colorSchemePreferences: colorSchemeData,
      accessibilityPreferences: accessibilityStatsQuery[0] ? {
        highContrastUsers: parseInt(accessibilityStatsQuery[0].high_contrast_count) || 0,
        reducedMotionUsers: parseInt(accessibilityStatsQuery[0].reduced_motion_count) || 0,
        totalUsers: parseInt(accessibilityStatsQuery[0].total) || 0
      } : {
        highContrastUsers: 0,
        reducedMotionUsers: 0,
        totalUsers: 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user preference stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user preference statistics' 
    });
  }
}

/**
 * Get all users for admin dashboard
 */
export async function getAllUsers(req: Request, res: Response) {
  try {
    // Get query params for pagination
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    
    // Get users with pagination
    const usersQuery = await db.select({
      id: users.id,
      first_name: users.first_name,
      username: users.username,
      email: users.email,
      user_type: users.user_type,
      is_admin: users.is_admin,
      is_freelancer: users.is_freelancer,
      created_at: users.created_at,
      last_login: users.last_login
    }).from(users)
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(users.created_at));
    
    // Count total users for pagination
    const totalUsersResult = await db.select({
      count: count()
    }).from(users);
    
    const totalUsers = totalUsersResult[0]?.count || 0;
    const totalPages = Math.ceil(totalUsers / pageSize);
    
    return res.json({
      users: usersQuery,
      pagination: {
        currentPage: page,
        pageSize,
        totalUsers,
        totalPages
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch users' 
    });
  }
}