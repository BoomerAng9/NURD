import { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { storage } from './storage';
import nodemailer from 'nodemailer';
import { User } from '@shared/schema';

// Configure transporter for email service
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

/**
 * Send a verification email to the user
 */
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"NURD Team" <noreply@nurd.app>',
      to: email,
      subject: 'Verify Your Email Address',
      text: `Thank you for registering with NURD. Please verify your email by clicking on the following link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF8A00;">Welcome to NURD!</h2>
          <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #FF8A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The NURD Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send a password reset email to the user
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"NURD Team" <noreply@nurd.app>',
      to: email,
      subject: 'Reset Your Password',
      text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF8A00;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF8A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
          <p>Best regards,<br>The NURD Team</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

/**
 * Configure and register Google OAuth authentication strategy
 */
function setupGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials missing. Google authentication disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await storage.getUserByProvider('google', profile.id);
          
          if (user) {
            // Update last login time
            return done(null, user);
          }
          
          // Check if user exists with the same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link Google account to existing user
              user = await storage.linkSocialProvider(user.id, 'google', profile.id);
              return done(null, user);
            }
          }
          
          // Create new user from Google profile
          if (email) {
            user = await storage.createUserFromSocial({
              first_name: profile.displayName || '',
              email: email,
              email_verified: true,
              google_id: profile.id,
              username: `google_${profile.id}`,
              avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
            });
            
            return done(null, user);
          }
          
          return done(null, false);
        } catch (error) {
          console.error('Error in Google auth strategy:', error);
          return done(error as Error);
        }
      }
    )
  );
}

/**
 * Configure and register Facebook OAuth authentication strategy
 */
function setupFacebookAuth() {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.warn('Facebook OAuth credentials missing. Facebook authentication disabled.');
    return;
  }

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.APP_URL}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Facebook ID
          let user = await storage.getUserByProvider('facebook', profile.id);
          
          if (user) {
            // Update last login time
            return done(null, user);
          }
          
          // Check if user exists with the same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link Facebook account to existing user
              user = await storage.linkSocialProvider(user.id, 'facebook', profile.id);
              return done(null, user);
            }
          }
          
          // Create new user from Facebook profile
          if (email) {
            user = await storage.createUserFromSocial({
              first_name: profile.displayName || '',
              email: email,
              email_verified: true,
              facebook_id: profile.id,
              username: `facebook_${profile.id}`,
              avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
            });
            
            return done(null, user);
          }
          
          return done(null, false);
        } catch (error) {
          console.error('Error in Facebook auth strategy:', error);
          return done(error as Error);
        }
      }
    )
  );
}

/**
 * Configure and register GitHub OAuth authentication strategy
 */
function setupGitHubAuth() {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.warn('GitHub OAuth credentials missing. GitHub authentication disabled.');
    return;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/auth/github/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this GitHub ID
          let user = await storage.getUserByProvider('github', profile.id);
          
          if (user) {
            // Update last login time
            return done(null, user);
          }
          
          // Check if user exists with the same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link GitHub account to existing user
              user = await storage.linkSocialProvider(user.id, 'github', profile.id);
              return done(null, user);
            }
          }
          
          // Create new user from GitHub profile
          if (email) {
            user = await storage.createUserFromSocial({
              first_name: profile.displayName || profile.username || '',
              email: email,
              email_verified: true,
              github_id: profile.id,
              username: `github_${profile.id}`,
              avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
            });
            
            return done(null, user);
          }
          
          return done(null, false);
        } catch (error) {
          console.error('Error in GitHub auth strategy:', error);
          return done(error as Error);
        }
      }
    )
  );
}

/**
 * Configure and register Microsoft OAuth authentication strategy
 */
function setupMicrosoftAuth() {
  if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
    console.warn('Microsoft OAuth credentials missing. Microsoft authentication disabled.');
    return;
  }

  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/auth/microsoft/callback`,
        scope: ['user.read']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Microsoft ID
          let user = await storage.getUserByProvider('microsoft', profile.id);
          
          if (user) {
            // Update last login time
            return done(null, user);
          }
          
          // Check if user exists with the same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link Microsoft account to existing user
              user = await storage.linkSocialProvider(user.id, 'microsoft', profile.id);
              return done(null, user);
            }
          }
          
          // Create new user from Microsoft profile
          if (email) {
            user = await storage.createUserFromSocial({
              first_name: profile.displayName || '',
              email: email,
              email_verified: true,
              microsoft_id: profile.id,
              username: `microsoft_${profile.id}`,
              avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
            });
            
            return done(null, user);
          }
          
          return done(null, false);
        } catch (error) {
          console.error('Error in Microsoft auth strategy:', error);
          return done(error as Error);
        }
      }
    )
  );
}

/**
 * Configure and initialize all SSO authentication strategies
 */
export function setupSSOAuth(app: Express) {
  // Configure authentication strategies
  setupGoogleAuth();
  setupFacebookAuth();
  setupGitHubAuth();
  setupMicrosoftAuth();

  // Auth routes for Google
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // Auth routes for Facebook
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  );
  
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // Auth routes for GitHub
  app.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );
  
  app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // Auth routes for Microsoft
  app.get(
    '/auth/microsoft',
    passport.authenticate('microsoft')
  );
  
  app.get(
    '/auth/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // Email verification endpoint
  app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid verification token' });
    }
    
    const verified = await storage.verifyEmail(token);
    
    if (verified) {
      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
  });

  // Password reset request endpoint
  app.post('/api/request-password-reset', async (req, res) => {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const sent = await storage.requestPasswordReset(email);
    
    // Always return success to prevent email enumeration attacks
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  });

  // Reset password endpoint
  app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }
    
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    const reset = await storage.resetPassword(token, newPassword);
    
    if (reset) {
      return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
  });
  
  // Middleware to check if a user is authenticated
  app.use('/api/protected', (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
  });
}