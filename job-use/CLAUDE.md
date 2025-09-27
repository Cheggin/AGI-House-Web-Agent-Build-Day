# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Run both frontend (Vite) and backend (Convex) development servers in parallel
- `npm run dev:frontend` - Run Vite frontend development server only
- `npm run dev:backend` - Run Convex backend development server only

### Build & Lint
- `npm run build` - Type-check and build production bundle
- `npm run lint` - Type-check and run ESLint with max warnings of 0

### Testing
No test commands are configured. Consider adding test infrastructure if needed.

## Architecture

This is a Convex + React (Vite) application with real-time backend capabilities.

### Tech Stack
- **Frontend**: React 19 with TypeScript, Vite bundler, Tailwind CSS for styling
- **Backend**: Convex (serverless backend with real-time database)
- **Path Aliases**: `@/` maps to `./src` directory

### Project Structure
- `/src` - React frontend application
  - `App.tsx` - Main application component demonstrating Convex integration
  - `main.tsx` - Application entry point
- `/convex` - Convex backend functions and schema
  - `myFunctions.ts` - Example queries, mutations, and actions
  - `schema.ts` - Database schema definition (currently has `numbers` table)
  - `_generated/` - Auto-generated Convex API and types (do not edit)

### Key Convex Patterns

The application demonstrates core Convex patterns:
- **Queries**: `listNumbers` - Fetches data from database
- **Mutations**: `addNumber` - Writes data to database
- **Actions**: `myAction` - Handles third-party API calls and complex operations
- **Real-time updates**: Data automatically syncs across all connected clients

### Frontend-Backend Integration
- Import API from `convex/_generated/api` for function references
- Use `useQuery` hook for reactive data fetching
- Use `useMutation` hook for data mutations
- Authentication context available via `ctx.auth.getUserIdentity()`

### Development Guidelines from Cursor Rules

Follow the comprehensive Convex guidelines in `.cursor/rules/convex_rules.mdc`:
- Always use new function syntax with explicit args and returns validators
- Use `v.null()` for functions that don't return values
- Prefer indexes over `.filter()` for queries
- Use `internalQuery/Mutation/Action` for private functions
- Include `"use node"` directive for actions using Node.js modules
- Define meaningful index names including all indexed fields