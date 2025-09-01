# Authentication System Rewrite - Integration with External API

## Overview
This document outlines the complete rewrite of the PlaneEro Frontend authentication system to integrate with the external backend API at `http://16.170.172.178:8080` based on the OpenAPI specification provided.

## Changes Made

### 1. API Utility Library (`lib/api.ts`)
- **Created comprehensive API client** for external backend integration
- **Implemented proper TypeScript interfaces** based on OpenAPI specification:
  - `SignupRequest`, `LoginRequest`, `AuthResponse`
  - `Vendor`, `Profile` interfaces
- **Added error handling** with custom `ApiError` class
- **Configured API endpoints** for authentication and vendor management
- **Implemented token-based authentication** with Bearer tokens

### 2. Configuration Management (`lib/config.ts`)
- **Centralized API configuration** with environment variable support
- **Configurable base URL** through `NEXT_PUBLIC_EXTERNAL_API_URL`
- **Endpoint management** for better maintainability
- **Development/production environment handling**

### 3. NextAuth Integration Updates (`app/api/auth/[...nextauth]/route.ts`)
- **Enhanced credentials provider** to use external API for authentication
- **Token storage** in JWT sessions for API calls
- **Profile synchronization** between external API and local database
- **Improved error handling** for authentication failures
- **Maintained OAuth provider support** (Google, GitHub) with role selection

### 4. Registration API (`app/api/auth/register/route.ts`)
- **Complete rewrite** to use external API for user registration
- **Role mapping** between internal roles (HOST, VENDOR, ADMIN) and external roles (USER, VENDOR)
- **Dual database approach** - external API primary, local database for NextAuth compatibility
- **Enhanced error handling** with proper API error propagation

### 5. User Profile API (`app/api/users/profile/route.ts`)
- **Real-time profile fetching** from external API
- **Automatic profile synchronization** between external and local databases
- **Fallback mechanism** to local database if external API is unavailable
- **Enhanced profile data** including vendor information

### 6. Vendor Management API (`app/api/vendors/route.ts`)
- **External API integration** for vendor operations
- **Dual-source vendor listing** - external API primary, local fallback
- **Enhanced vendor creation** with external API synchronization
- **Improved search and filtering** capabilities

### 7. Authentication Hook (`hooks/use-auth.ts`)
- **Updated to support external API** authentication flow
- **Token management** in localStorage and session
- **Enhanced error handling** for API failures
- **Improved user experience** with proper role-based redirects

### 8. Frontend Forms Updates
- **Signin page** (`app/auth/signin/page.tsx`) - Enhanced with role-based redirects
- **Signup page** (`app/auth/signup/page.tsx`) - Updated to use new registration flow
- **Better error handling** and user feedback

### 9. Type Definitions (`types/next-auth.d.ts`)
- **Extended NextAuth types** to include API tokens
- **Enhanced session interface** for external API integration
- **Improved type safety** throughout the application

### 10. Environment Configuration
- **Created `.env.example`** with all required environment variables
- **Documented configuration options** for different environments
- **Secure token management** guidelines

## API Endpoints Integrated

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/profile` - Get user profile

### Vendor Endpoints
- `GET /vendors` - List all vendors
- `GET /vendors/{id}` - Get vendor by ID
- `GET /vendors/email/{email}` - Get vendor by email
- `PUT /vendors/{id}` - Update vendor information

## Key Features

### 1. Dual Database Architecture
- **External API as primary source** for user data and authentication
- **Local database maintained** for NextAuth compatibility and caching
- **Automatic synchronization** between both systems

### 2. Enhanced Security
- **JWT token-based authentication** with the external API
- **Secure token storage** in HTTP-only sessions
- **Proper error handling** without exposing sensitive information

### 3. Improved User Experience
- **Role-based redirects** after authentication
- **Real-time profile updates** from external API
- **Fallback mechanisms** for better reliability

### 4. Developer Experience
- **Comprehensive TypeScript support** with proper typing
- **Centralized configuration** management
- **Detailed error logging** for debugging
- **Maintainable code structure**

## Environment Variables Required

```bash
# External API Configuration
NEXT_PUBLIC_EXTERNAL_API_URL=http://16.170.172.178:8080

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL="mysql://username:password@localhost:3306/planero"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Installation and Setup

1. **Install dependencies with Bun:**
   ```bash
   bun install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Run the development server:**
   ```bash
   bun dev
   ```

## Benefits of the New System

1. **Real-time data synchronization** with external backend
2. **Improved scalability** through API-based architecture
3. **Better security** with proper token management
4. **Enhanced user experience** with role-based features
5. **Maintainable codebase** with proper TypeScript typing
6. **Fallback mechanisms** for better reliability
7. **Future-proof architecture** ready for additional API integrations

## Migration Notes

- **Existing users** will need to re-authenticate to sync with external API
- **Vendor data** will be gradually synchronized between systems
- **OAuth users** will go through role selection process on first login
- **Local database** remains as backup and for NextAuth compatibility

## Testing

The system has been successfully built and tested with:
- ✅ TypeScript compilation
- ✅ Next.js build process
- ✅ API integration structure
- ✅ Authentication flow design
- ✅ Error handling mechanisms

All changes maintain backward compatibility while providing a robust foundation for future enhancements.
