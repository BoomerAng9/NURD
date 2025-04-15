import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { storage } from './storage';
import { eq } from 'drizzle-orm';
import { users } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const AUTH_CALLBACK_URL = process.env.AUTH_CALLBACK_URL || 'http://localhost:5000';

// Helper to generate a verification token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// JWT token generation helper
const generateJWT = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyJWT = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
};

// Authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const decoded = verifyJWT(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  // Add user ID to the request
  (req as any).userId = decoded.userId;
  next();
};

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${AUTH_CALLBACK_URL}/verify-email?token=${token}`;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'NURD Account - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF8A00;">Verify Your Email</h2>
          <p>Thank you for registering with NURD! Please verify your email address by clicking the link below:</p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #FF8A00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>The NURD Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${AUTH_CALLBACK_URL}/reset-password?token=${token}`;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'NURD Account - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF8A00;">Reset Your Password</h2>
          <p>We received a request to reset your password. If you requested this, please click the link below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #FF8A00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>The NURD Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Configure SSO strategies
export const setupSSOStrategies = () => {
  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${AUTH_CALLBACK_URL}/auth/google/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists
        let user = await storage.getUserByProvider('google', profile.id);
        
        if (!user) {
          // Create a new user if doesn't exist
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Email is required'), null);
          }
          
          // Check if user exists with the same email
          const existingUser = await storage.getUserByEmail(email);
          
          if (existingUser) {
            // Link this Google account to the existing user
            await storage.linkSocialProvider(existingUser.id, 'google', profile.id);
            user = existingUser;
          } else {
            // Create a new user
            user = await storage.createUserFromSocial({
              first_name: profile.name?.givenName || profile.displayName,
              age: 18, // Default age, will need to be updated later
              grade_level: 'Unknown', // Default, will need to be updated later
              user_type: 'student', // Default, will need to be updated later
              gender: 'prefer_not_to_say', // Default, will need to be updated later
              username: `user_${profile.id}`, // Generate a username
              password: crypto.randomBytes(16).toString('hex'), // Generate a random password
              email,
              google_id: profile.id,
              email_verified: true, // Email is verified by Google
            });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }
  
  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${AUTH_CALLBACK_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists
        let user = await storage.getUserByProvider('facebook', profile.id);
        
        if (!user) {
          // Create a new user if doesn't exist
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Email is required'), null);
          }
          
          // Check if user exists with the same email
          const existingUser = await storage.getUserByEmail(email);
          
          if (existingUser) {
            // Link this Facebook account to the existing user
            await storage.linkSocialProvider(existingUser.id, 'facebook', profile.id);
            user = existingUser;
          } else {
            // Create a new user
            user = await storage.createUserFromSocial({
              first_name: profile.name?.givenName || profile.displayName,
              age: 18, // Default age, will need to be updated later
              grade_level: 'Unknown', // Default, will need to be updated later
              user_type: 'student', // Default, will need to be updated later
              gender: 'prefer_not_to_say', // Default, will need to be updated later
              username: `user_${profile.id}`, // Generate a username
              password: crypto.randomBytes(16).toString('hex'), // Generate a random password
              email,
              facebook_id: profile.id,
              email_verified: true, // Email is verified by Facebook
            });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }
  
  // GitHub Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${AUTH_CALLBACK_URL}/auth/github/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists
        let user = await storage.getUserByProvider('github', profile.id);
        
        if (!user) {
          // Create a new user if doesn't exist
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Email is required'), null);
          }
          
          // Check if user exists with the same email
          const existingUser = await storage.getUserByEmail(email);
          
          if (existingUser) {
            // Link this GitHub account to the existing user
            await storage.linkSocialProvider(existingUser.id, 'github', profile.id);
            user = existingUser;
          } else {
            // Create a new user
            user = await storage.createUserFromSocial({
              first_name: profile.displayName || profile.username || '',
              age: 18, // Default age, will need to be updated later
              grade_level: 'Unknown', // Default, will need to be updated later
              user_type: 'student', // Default, will need to be updated later
              gender: 'prefer_not_to_say', // Default, will need to be updated later
              username: `user_${profile.id}`, // Generate a username
              password: crypto.randomBytes(16).toString('hex'), // Generate a random password
              email,
              github_id: profile.id,
              email_verified: true, // Email is verified by GitHub
            });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }
  
  // Microsoft Strategy
  if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(new MicrosoftStrategy({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: `${AUTH_CALLBACK_URL}/auth/microsoft/callback`,
      scope: ['user.read'],
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists
        let user = await storage.getUserByProvider('microsoft', profile.id);
        
        if (!user) {
          // Create a new user if doesn't exist
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Email is required'), null);
          }
          
          // Check if user exists with the same email
          const existingUser = await storage.getUserByEmail(email);
          
          if (existingUser) {
            // Link this Microsoft account to the existing user
            await storage.linkSocialProvider(existingUser.id, 'microsoft', profile.id);
            user = existingUser;
          } else {
            // Create a new user
            user = await storage.createUserFromSocial({
              first_name: profile.displayName || '',
              age: 18, // Default age, will need to be updated later
              grade_level: 'Unknown', // Default, will need to be updated later
              user_type: 'student', // Default, will need to be updated later
              gender: 'prefer_not_to_say', // Default, will need to be updated later
              username: `user_${profile.id}`, // Generate a username
              password: crypto.randomBytes(16).toString('hex'), // Generate a random password
              email,
              microsoft_id: profile.id,
              email_verified: true, // Email is verified by Microsoft
            });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }
};

// Export authentication-related functions
export default {
  generateToken,
  generateJWT,
  verifyJWT,
  authMiddleware,
  sendVerificationEmail,
  sendPasswordResetEmail,
  setupSSOStrategies,
};