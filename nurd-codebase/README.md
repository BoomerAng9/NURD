# NURD by ACHIEVEMOR

A dynamic web application for the NURD Summer Initiative, designed to create an immersive and personalized learning platform for tech enthusiasts. The platform leverages advanced AI, interactive technologies, and adaptive user interfaces to transform technical education into an engaging, user-centric experience.

## 🌟 Features

### Core Platform
- **V.I.B.E. (Vibrant Imagination Build Environment)** - AI-powered coding environment
- **ACHIEVERS Program** - Structured learning paths for youth
- **Multi-AI Model Support** - Integration with OpenAI, GROQ, and other AI services
- **Real-time Collaboration** - WebSocket-powered interactive features
- **Subscription Management** - Stripe-powered payment processing
- **User Analytics Dashboard** - Material-style UI for data visualization

### Learning Tracks
- **Vibe Coding Foundations** - Programming fundamentals
- **World Builder Lab** - Creative project development
- **Prompt Mastery** - AI interaction skills
- **Collaboration Studio** - Team-based learning

### Technical Features
- **Passwordless Authentication** - Simplified user access
- **Adaptive Color Schemes** - User preference-based theming
- **Magic Cursor Effects** - Interactive UI enhancements
- **Mobile-Optimized** - Responsive design for all devices
- **Image Locker System** - Admin-controlled asset management

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Wouter** for routing
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Framer Motion** for animations
- **React Query** for state management

### Backend
- **Express.js** server
- **PostgreSQL** database with Drizzle ORM
- **WebSocket** for real-time features
- **Passport.js** for authentication
- **Multer** for file uploads

### AI & External Services
- **OpenAI GPT-4** for code generation and explanations
- **GROQ** for multiple LLM access (Llama, Mistral)
- **Modal** for distributed computing
- **Stripe** for payment processing

## 🛠️ Installation

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database
- Required API keys (see Environment Variables section)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/your-username/nurd-by-achievemor.git
cd nurd-by-achievemor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see `.env.example`):
```bash
cp .env.example .env
```

4. Configure your database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:password@localhost:5432/nurd_db
SESSION_SECRET=your-session-secret
```

### AI Services
```env
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
MODAL_API_KEY=...
```

### Payment Processing
```env
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

### Optional OAuth Providers
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## 📱 Application Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
├── server/                # Backend Express server
│   ├── routes.ts          # API route definitions
│   ├── auth.ts            # Authentication logic
│   ├── storage.ts         # Database operations
│   └── middleware/        # Express middleware
├── shared/                # Shared types and schemas
└── uploads/               # File upload directory
```

## 🎯 Key Pages

- **Home** (`/`) - Main landing page with hero section
- **About Us** (`/about`) - Information about ACHIEVEMOR and NURD
- **ACHIEVERS** (`/achievers`) - Student program registration
- **V.I.B.E.** (`/access-ai`) - AI-powered coding environment
- **NURD Initiative** (`/summer-initiative`) - Program details and impact
- **Subscription Plans** (`/subscription-plans`) - Pricing and features

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Current user info

### AI Services
- `POST /api/ai/generate-code` - Code generation
- `POST /api/ai/explain-code` - Code explanation
- `POST /api/groq/models` - Available GROQ models

### Payments
- `POST /api/create-payment-intent` - Stripe payment processing
- `POST /api/get-or-create-subscription` - Subscription management

### Image Management
- `GET /api/images` - List images (admin only)
- `POST /api/images` - Upload image (admin only)
- `DELETE /api/images/:id` - Delete image (admin only)

## 🎨 Customization

### Theming
The application supports dynamic theming through `theme.json`:
```json
{
  "primary": "#3b82f6",
  "variant": "professional",
  "appearance": "system",
  "radius": 8
}
```

### Geographic Branding
Footer displays "Made in Pooler, GA" with local geographical elements including palm trees and regional styling.

## 🔒 Security Features

- **CORS Configuration** - Proper cross-origin request handling
- **Content Security Policy** - XSS protection
- **Input Validation** - Zod schema validation
- **Rate Limiting** - API endpoint protection
- **Session Management** - Secure user sessions

## 📊 Analytics & Monitoring

The application includes comprehensive analytics:
- User registration trends
- Platform usage statistics
- Skill marketplace metrics
- User preference analytics
- Real-time activity tracking

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
Ensure all required environment variables are set in production:
- Database connection
- API keys for external services
- Stripe configuration for payments
- Session secrets for security

### Health Checks
The application provides health check endpoints:
- `GET /` - Basic health check
- `GET /api/health` - Detailed system status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About ACHIEVEMOR

ACHIEVEMOR is a global consulting organization with multiple portals:
- **The STARGATE** - Innovation gateway
- **The Boost|Bridge** - Connection platform
- **OpenKlass AI** - Educational AI tools
- **NURD Initiative** - Youth technology education

## 📞 Support

For support and questions:
- Email: support@achievemor.com
- Discord: [NURD Community](https://discord.gg/nurd)
- Documentation: [docs.achievemor.com](https://docs.achievemor.com)

---

**Made in Pooler, GA** 🌴 with passion for empowering youth through technology education.