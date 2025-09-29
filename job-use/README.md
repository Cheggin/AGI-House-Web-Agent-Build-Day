# Job Use - Frontend & Database Configuration Guide

This guide helps contributors customize the Job Use frontend and database for their own use cases.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Frontend Customization](#frontend-customization)
- [Running the Project](#running-the-project)
- [Common Customizations](#common-customizations)

## Project Overview

Job Use is an AI-powered job application platform that automates the application process. The frontend is built with React + Vite + TypeScript, and uses Convex as the backend database.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS v4
- **Routing**: React Router v7
- **Database**: Convex
- **Linting**: ESLint with TypeScript support

## Database Schema

The database schema is defined in [`convex/schema.ts`](convex/schema.ts). Here are the main tables:

### Candidates Table
Stores user profile information:
```typescript
{
  email: string
  password: string
  profileType: string
  cvUploaded: boolean
  firstName: string
  lastName: string
  eligibilityToWork: boolean
  age: number
  postCode: string
  birthdate: string
  phone: string
  country: string
  county: string
  salary: string
  profileSummary: string
  currentJobTitle: string
  currentCompany: string
  experience: number
}
```

### Jobs Table
Stores job postings:
```typescript
{
  title: string
  company: string
  location: string
  salary: string
  description: string
  requirements: string[]
  postedDate: string
  status: "active" | "closed"
}
```

### Applications Table
Tracks job applications with AI agent data:
```typescript
{
  candidateId: Id<"candidates">
  jobId: Id<"jobs">
  appliedDate: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  coverLetter?: string
  agentSummary?: string
  questionsDetected?: Array<{question, answer, fieldType}>
  agentTraces?: Array<{timestamp, action, element, value, success}>
}
```

### Job Experiences Table
Stores work history:
```typescript
{
  candidateId: Id<"candidates">
  company: string
  title: string
  currentJob: boolean
  startDate: string
  endDate: string
  scope: string
}
```

### Questions Table
Stores answers to application questions:
```typescript
{
  candidateId: Id<"candidates">
  questionId: string
  name: string
  answer: string
  intent: string
  answered: boolean
  questionType: string
  options?: string[]
}
```

## Frontend Customization

### Modifying the Theme

The application uses TailwindCSS with a dark theme. To customize colors:

1. **Primary Brand Color**: Currently using emerald (`emerald-500`, `emerald-400`)
   - Find and replace `emerald-` with your preferred color (e.g., `blue-`, `purple-`)
   - Main files to update: all component files in [`src/components/`](src/components/) and [`src/pages/`](src/pages/)

2. **Background Colors**: Uses `bg-black` and `bg-gray-950`
   - Update in [`src/App.tsx`](src/App.tsx) line 20 and throughout component files

### Adding New Pages

1. Create a new component in [`src/pages/`](src/pages/)
2. Add the route in [`src/App.tsx`](src/App.tsx):
   ```typescript
   <Route path="/your-path" element={<YourPage />} />
   ```
3. Add navigation link in [`src/components/Navigation.tsx`](src/components/Navigation.tsx)

### Modifying Application Flow

The main application flow is in [`src/components/JobCard.tsx`](src/components/JobCard.tsx):

- **Backend Integration**: Line 37-59 handles the API call to the Python backend
- **Mock Data**: Line 61-63 provides fallback for non-integrated jobs
- **Application Creation**: Line 66-71 saves to Convex database

To add your own backend:
```typescript
const response = await fetch('YOUR_BACKEND_URL', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ jobId: job._id, candidateId: user._id }),
});
```

### Customizing Research Data

AI-powered deep research is in [`convex/research.ts`](convex/research.ts):

1. Add company-specific research in the `getDeepResearch` query (line 24-42)
2. Modify the generic research template (line 36-42)
3. Update return schema if you want different fields

## Running the Project

### Prerequisites
- Node.js 18+
- npm or yarn
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

```bash
# Install dependencies
npm install

# Set up Convex (first time only)
npx convex dev

# Run development server (frontend + Convex)
npm run dev

# Run only frontend
npm run dev:frontend

# Run only Convex backend
npm run dev:backend
```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Common Customizations

### 1. Adding Custom Profile Fields

**Database**: Update [`convex/schema.ts`](convex/schema.ts) line 5-24
```typescript
candidates: defineTable({
  // ... existing fields
  yourCustomField: v.string(),
})
```

**Types**: Update [`src/types/index.ts`](src/types/index.ts) line 3-23
```typescript
export interface Candidate {
  // ... existing fields
  yourCustomField: string;
}
```

**Frontend**: Update [`src/pages/UploadProfile.tsx`](src/pages/UploadProfile.tsx) to include new form fields

### 2. Modifying Job Listings

Edit [`convex/jobs.ts`](convex/jobs.ts) to change how jobs are created, filtered, or displayed.

Key functions:
- `createJob` - Add new jobs
- `getAllJobs` - Fetch all active jobs
- `getJobById` - Get specific job details
- `updateJobStatus` - Change job status

### 3. Customizing Application Status Flow

The application workflow can be modified in [`convex/applications.ts`](convex/applications.ts):

- Add new status types in schema (line 62-67)
- Create custom status update functions
- Add application filtering logic

### 4. Changing Authentication

Currently uses email/password stored in Convex. To integrate OAuth or other auth:

1. Update [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx)
2. Modify login/signup functions in [`convex/candidates.ts`](convex/candidates.ts)
3. Consider using Convex Auth or your preferred auth provider

### 5. Adding File Upload

To enable CV/resume uploads:

1. Use Convex file storage: [Convex File Storage Docs](https://docs.convex.dev/file-storage)
2. Update [`src/components/FileUploader.tsx`](src/components/FileUploader.tsx)
3. Add file storage ID to candidates schema

### 6. Customizing Toast Notifications

Toast messages are managed in [`src/contexts/ToastContext.tsx`](src/contexts/ToastContext.tsx):

- Modify toast duration (default varies by type)
- Change toast positioning
- Add custom toast types beyond `success`, `error`, `info`, `warning`

## Environment Variables

Create a `.env.local` file for local development:

```bash
# Convex
VITE_CONVEX_URL=your_convex_deployment_url

# Backend API (if using)
VITE_BACKEND_API_URL=http://localhost:8000
```

## Project Structure

```
job-use/
├── convex/              # Convex backend functions
│   ├── schema.ts        # Database schema
│   ├── applications.ts  # Application CRUD operations
│   ├── candidates.ts    # User profile operations
│   ├── jobs.ts          # Job listing operations
│   ├── research.ts      # AI research functionality
│   └── ...
├── src/
│   ├── components/      # Reusable React components
│   │   ├── JobCard.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── contexts/        # React contexts (Auth, Toast)
│   ├── pages/           # Page components
│   │   ├── LandingPage.tsx
│   │   ├── JobsDashboard.tsx
│   │   ├── ApplicationPage.tsx
│   │   └── ...
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component with routing
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── eslint.config.js     # ESLint configuration
```

## Contributing

When making changes:

1. Run `npm run lint` to check for errors
2. Test locally with `npm run dev`
3. Ensure all TypeScript types are properly defined
4. Update this README if you add new features

## Need Help?

- Convex Docs: https://docs.convex.dev
- React Router Docs: https://reactrouter.com
- TailwindCSS Docs: https://tailwindcss.com
- Vite Docs: https://vitejs.dev

## License

See the main project LICENSE file.