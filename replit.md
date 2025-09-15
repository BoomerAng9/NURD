# NURD by ACHIEVEMOR

## Overview

NURD by ACHIEVEMOR is a comprehensive educational platform designed for the NURD Summer Initiative. The platform serves as an immersive learning environment for youth, combining AI-powered coding tools, real-time collaboration features, and structured learning paths. At its core is the V.I.B.E. (Vibrant Imagination Build Environment), an AI-powered coding environment that helps bridge beginners into AI tools and coding practices. The platform supports multiple learning tracks including Vibe Coding Foundations, World Builder Lab, Prompt Mastery, and Collaboration Studio, all designed to empower young learners through technology education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based architecture built with TypeScript and Vite for optimal development and build performance. The frontend employs Wouter for lightweight routing, Tailwind CSS for utility-first styling, and Shadcn UI components for consistent design patterns. Framer Motion provides smooth animations and interactive UI enhancements. State management is handled through React Query (Tanstack Query) for server state and standard React state for local component state. The design system supports adaptive color schemes and includes specialized mobile optimizations with responsive breakpoints.

### Backend Architecture
The server is built on Express.js with TypeScript, providing a robust REST API foundation. Authentication is handled through Passport.js with session-based auth stored in PostgreSQL. The application includes WebSocket support for real-time collaboration features and file upload capabilities via Multer. The server architecture is designed to handle multiple AI service integrations and includes specialized routers for different feature sets like image management, payment processing, and analytics.

### Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes comprehensive user management, skill exchange systems, learning progress tracking, and subscription management. Key entities include users, skill offerings/requests, user preferences, and learning analytics. The database supports both transactional operations and analytical queries for dashboard reporting.

### AI Integration Layer
The platform integrates multiple AI services for different purposes:
- OpenAI GPT-4 for code generation, explanations, and educational content
- GROQ for accessing multiple LLM models (Llama, Mistral) with fast inference
- Anthropic Claude for advanced course generation and content analysis
- Custom AI services for accessibility features like content simplification and text-to-speech

### Authentication & Security
The system implements session-based authentication with secure password hashing using scrypt. Security headers are applied globally, and the application includes CORS configuration for cross-origin requests. User sessions are stored in PostgreSQL with automatic cleanup, and the system supports role-based access control for different user types (students, trainers, admins).

### Real-time Features
WebSocket integration enables real-time collaboration features including live code sharing, chat functionality, and presence indicators. The system supports multiple concurrent collaboration sessions and includes conflict resolution for simultaneous editing scenarios.

### Content Management
The platform includes an image locker system for admin-controlled asset management, course generation capabilities, and user-generated content handling. File uploads are processed through Multer with security filtering and size limits.

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment processing solution for subscription management and one-time payments
- **PayPal**: Additional payment option through PayPal Server SDK

### AI & ML Services
- **OpenAI API**: GPT-4 integration for code generation, explanations, and educational content
- **GROQ API**: Fast LLM inference for multiple models (Llama, Mistral)
- **Anthropic API**: Claude integration for advanced content generation and analysis
- **Modal**: Distributed computing platform for advanced AI functionality and model deployment

### Communication Services
- **SendGrid**: Email delivery service for transactional emails, confirmations, and notifications
- **Microsoft Graph API**: Teams integration for trainer authentication and meeting management

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Supabase**: Backup authentication and real-time features (legacy integration)

### Development & Deployment
- **Replit**: Primary development and deployment platform with built-in collaboration tools
- **Vite**: Modern build tool with hot module replacement and optimized bundling

### UI & Design Systems
- **Radix UI**: Comprehensive component library for accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn UI**: Pre-built component system built on Radix UI and Tailwind CSS
- **Framer Motion**: Animation library for smooth, interactive UI transitions

### Development Tools
- **TypeScript**: Type safety across the entire application stack
- **Drizzle ORM**: Type-safe database operations and migrations
- **React Query**: Server state management and caching
- **Passport.js**: Authentication middleware with multiple strategy support