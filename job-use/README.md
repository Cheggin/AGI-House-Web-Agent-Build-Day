# Job Use Frontend

Hey guys! This is Reagan. Welcome to the beautiful word of applying to j*bs. Below are some guiding tips that I thought may help you in editing this project.

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

## Running the Project

```bash
# Install dependencies
npm install

# Set up Convex (first time only)
npx convex dev

# Run development server (frontend + Convex)
npm run dev 
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

## Environment Variables

Convex should set this up for you. If not, create a `.env.local` file for local development:

```bash
# Convex
VITE_CONVEX_URL=your_convex_deployment_url

# Backend API (if using)
VITE_BACKEND_API_URL=http://localhost:8000
```

## License

See the main project LICENSE file.