# HireHub Frontend

A modern job recruitment platform built with React, TypeScript, and Vite. HireHub connects job seekers with recruiters and provides a comprehensive platform for job search, application management, and professional networking.

## 🚀 Features

### User Features
- **Authentication & Authorization**
  - Email/Password registration and login
  - Google OAuth integration
  - Email verification and account activation
  - Password reset functionality
  - JWT-based authentication

- **Job Search & Management**
  - Browse and search job listings
  - Filter jobs by skills, location, type, and level
  - Save favorite jobs
  - Apply for jobs with cover letter and resume
  - Track application status
  - AI-powered job recommendations

- **Profile Management**
  - Complete professional profile with avatar
  - Skills, experience, and education management
  - Language proficiency tracking
  - Resume upload and management
  - GitHub integration

- **Company Discovery**
  - Browse company profiles
  - View company job listings
  - Follow companies

- **Networking**
  - User directory and search
  - Connect with other professionals
  - View user profiles and credentials

- **Real-time Chat**
  - Direct messaging with recruiters and other users
  - WebSocket-based real-time communication
  - Message history and conversation management
  - AI chatbot assistant for job-related queries
  - File and media sharing

- **Notifications**
  - Real-time push notifications via Firebase
  - In-app notification center
  - Application status updates
  - Message notifications

### Recruiter Features
- **Dashboard**
  - Analytics and insights
  - Application tracking
  - Hiring pipeline visualization

- **Job Management**
  - Create and publish job postings
  - Edit and update job listings
  - Manage job status (draft, active, closed)
  - Rich text editor for job descriptions

- **Candidate Management**
  - View and filter applications
  - Review candidate profiles and resumes
  - Manage application status
  - Communicate with candidates

- **Company Profile**
  - Manage company information
  - Upload company logo and media
  - Showcase company culture

### Admin Features
- **User Management**
  - View and manage all users
  - User verification and moderation
  - Account status management

- **Job Management**
  - Review and approve job postings
  - Remove inappropriate content
  - Monitor job posting quality

- **Content Moderation**
  - Review reported content
  - Manage violations
  - Handle user reports

- **System Configuration**
  - Manage job types and levels
  - Configure company domains
  - System-wide settings

- **Analytics Dashboard**
  - User statistics
  - Job posting metrics
  - Platform usage analytics

## 🛠 Tech Stack

### Core Framework
- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Fast build tool and dev server

### Routing & State Management
- **React Router v7** - Client-side routing
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management
- **Redux Toolkit** - Complex state management

### Styling & UI
- **TailwindCSS 4.1.14** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Material UI** - Component library

### Form Management
- **React Hook Form** - Performant form handling
- **Yup** - Schema validation
- **@hookform/resolvers** - Validation resolver

### Rich Text & Content
- **TipTap** - Headless rich text editor
- **React Markdown** - Markdown renderer
- **Emoji Picker React** - Emoji selection

### Real-time Communication
- **@stomp/stompjs** - WebSocket STOMP client
- **SockJS Client** - WebSocket fallback
- **Firebase** - Push notifications and cloud messaging

### Data Fetching & API
- **Axios** - HTTP client
- **TanStack Query** - Data synchronization

### UI Components & Utilities
- **date-fns** - Date manipulation
- **Recharts** - Chart and data visualization
- **Embla Carousel** - Carousel component
- **Sonner** - Toast notifications
- **cmdk** - Command menu

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - React Fast Refresh

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**
- Backend API running (see backend README)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd hirehub-combined/hirehub-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5005/api
VITE_WS_URL=http://localhost:5005

# Firebase Configuration (for push notifications)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_VAPID_KEY=your_firebase_vapid_key

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

### Preview production build

```bash
npm run preview
```

## 🧪 Development

### Project Structure

```
hirehub-fe/
├── public/                      # Static assets
│   ├── firebase-messaging-sw.js # Firebase service worker
│   └── vite.svg
├── src/
│   ├── api/                     # API utility functions
│   ├── apis/                    # API endpoint definitions
│   │   ├── auth.api.ts
│   │   ├── job.api.ts
│   │   ├── user.api.ts
│   │   └── ...
│   ├── assets/                  # Images, icons, illustrations
│   ├── components/              # Reusable components
│   │   ├── layout/             # Layout components
│   │   │   ├── Admin/
│   │   │   ├── Recruiter/
│   │   │   └── User/
│   │   └── ui/                 # UI components (shadcn/ui)
│   ├── config/                  # Configuration files
│   │   └── firebase.ts
│   ├── constants/               # App constants
│   ├── helper/                  # Helper utilities
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useJob.ts
│   │   ├── useChat.ts
│   │   └── ...
│   ├── lib/                     # Library configurations
│   │   ├── axios.ts
│   │   └── utils.ts
│   ├── mock/                    # Mock data for development
│   ├── pages/                   # Page components
│   │   ├── Admin/
│   │   ├── Recruiter/
│   │   └── User/
│   ├── stores/                  # State management
│   │   └── useAuthStore.ts
│   ├── types/                   # TypeScript type definitions
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Key Directories Explained

- **`/apis`**: Contains all API endpoint functions organized by feature
- **`/hooks`**: Custom React hooks for data fetching and state management
- **`/types`**: TypeScript interfaces and types for type safety
- **`/pages`**: Route-level components organized by user role
- **`/components/ui`**: Reusable UI components (buttons, inputs, dialogs, etc.)
- **`/components/layout`**: Layout wrappers for different user roles

### Code Style

The project follows these conventions:
- **TypeScript** for type safety
- **Functional components** with hooks
- **Custom hooks** for business logic
- **TanStack Query** for server state
- **Zustand** for client state
- **Path aliases** using `@/` for imports

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔑 Authentication Flow

1. User registers with email/password or Google OAuth
2. Email verification link sent to user
3. User activates account via verification link
4. JWT tokens stored in localStorage
5. Axios interceptor adds token to all requests
6. Auto-refresh token on expiration

## 🔌 WebSocket Integration

Real-time features use STOMP over WebSocket:
- Chat messages
- Notifications
- Online status
- Typing indicators

Connection established via `useStomp` hook:
```typescript
const { client, connected } = useStomp();
```

## 🔔 Firebase Push Notifications

- Service worker registered for background notifications
- FCM token synced with backend
- Handles foreground and background notifications
- Integrated with in-app notification system

## 🎨 UI Components

Built on **shadcn/ui** with Radix UI primitives:
- Fully accessible (ARIA compliant)
- Keyboard navigation
- Theme support (light/dark mode ready)
- Customizable with TailwindCSS

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## 🔒 Security Features

- JWT token-based authentication
- HTTP-only cookie support
- XSS protection
- CSRF token handling
- Secure API communication
- Input validation and sanitization

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_WS_URL` | WebSocket server URL | Yes |
| `VITE_FIREBASE_*` | Firebase configuration | Yes (for notifications) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Rebuild TypeScript
npm run build
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [React Router Documentation](https://reactrouter.com/)

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Build the project: `npm run build`
5. Submit a pull request

## 📝 License

[Add your license information here]

## 🤝 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the HireHub Team**
