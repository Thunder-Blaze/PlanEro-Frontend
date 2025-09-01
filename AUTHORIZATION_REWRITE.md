# Authorization System Rewrite - Integration with External API

## Overview

The authorization system has been completely rewritten to integrate with the external API at `http://16.170.172.178:8080` instead of using hardcoded data. This document outlines all the changes made and how the new system works.

## Key Changes

### 1. New API Utility (`/lib/api.ts`)

Created a comprehensive API utility that handles all external API communication:

- **Authentication APIs**: `signup`, `login`, `getProfile`
- **Vendor APIs**: `getAllVendors`, `getVendorById`, `getVendorByEmail`, `updateVendor`
- **Error Handling**: Custom `ApiError` class for proper error management
- **Token Management**: Automatic Bearer token injection for authenticated requests

### 2. Configuration Management (`/lib/config.ts`)

- Centralized configuration for API endpoints and URLs
- Role mapping between internal system (HOST/VENDOR/ADMIN) and external API (USER/VENDOR)
- Environment variable support for API URL configuration

### 3. Updated NextAuth Configuration (`/app/api/auth/[...nextauth]/route.ts`)

- **Credentials Provider**: Now authenticates against external API
- **JWT Integration**: Stores external API token in JWT for subsequent API calls
- **Profile Sync**: Automatically syncs user profile data from external API
- **Session Management**: Enhanced session to include API token

### 4. Updated Authentication Routes

#### Registration (`/app/api/auth/register/route.ts`)
- Calls external API for user registration
- Stores user data locally for NextAuth compatibility
- Returns API token for immediate authentication

#### User Profile (`/app/api/users/profile/route.ts`)
- Fetches profile from external API when possible
- Falls back to local database if API is unavailable
- Automatically syncs profile data between systems

### 5. Enhanced Vendor Management (`/app/api/vendors/route.ts`)

- **GET**: Fetches vendors from external API with fallback to local database
- **POST**: Creates vendors in both external API and local database
- **Filtering**: Maintains existing search and pagination functionality
- **Error Handling**: Graceful fallback when external API is unavailable

### 6. Updated Authentication Hook (`/hooks/use-auth.ts`)

- Integration with external API for sign-in and sign-up
- Token management in localStorage
- Enhanced error handling and user feedback
- Automatic role-based redirects

### 7. New API Integration Hook (`/hooks/use-api.ts`)

- Provides easy access to API token from session or localStorage
- Simplified authenticated API calls
- Reusable functions for common API operations

### 8. Updated Type Definitions (`/types/next-auth.d.ts`)

- Added `apiToken` to session and JWT interfaces
- Enhanced user type with external API token support

## API Integration Details

### Authentication Flow

1. **Sign Up**:
   ```
   Frontend → External API (/auth/signup) → Local Database → NextAuth Session
   ```

2. **Sign In**:
   ```
   Frontend → External API (/auth/login) → NextAuth JWT → Session with API Token
   ```

3. **Profile Access**:
   ```
   Session API Token → External API (/auth/profile) → Updated Local Database
   ```

### Role Mapping

| Internal Role | External API Role | Description |
|---------------|-------------------|-------------|
| HOST          | USER              | Event planners/customers |
| VENDOR        | VENDOR            | Service providers |
| ADMIN         | USER              | Administrative users |

### Vendor Management

- **Create**: Vendors are created in both external API and local database
- **Read**: Data is fetched from external API with local fallback
- **Update**: Updates are sent to external API when authenticated
- **Sync**: Local database is kept in sync with external API data

## Error Handling and Fallbacks

The system is designed to be resilient:

1. **API Unavailable**: Falls back to local database operations
2. **Authentication Failure**: Clear error messages and token cleanup
3. **Network Issues**: Graceful degradation with user feedback
4. **Data Sync**: Automatic retry mechanisms for critical operations

## Environment Configuration

Add to your `.env.local` file:

```env
# External API Configuration
NEXT_PUBLIC_EXTERNAL_API_URL=http://16.170.172.178:8080

# Existing NextAuth configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth providers (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Usage Examples

### Making Authenticated API Calls

```typescript
import { useApiCalls } from '@/hooks/use-api'

function MyComponent() {
  const { getProfile, updateVendor } = useApiCalls()
  
  const handleGetProfile = async () => {
    try {
      const profile = await getProfile()
      console.log('User profile:', profile)
    } catch (error) {
      console.error('Failed to get profile:', error)
    }
  }
}
```

### Role-Based Redirects

The system automatically redirects users based on their role:
- **VENDOR**: `/vendor/dashboard` or `/vendor/onboarding`
- **HOST/USER**: `/` (home page)
- **OAuth Users**: `/auth/select-role` (if role not set)

## Testing the Integration

1. **Sign Up**: Test new user registration with external API
2. **Sign In**: Verify authentication against external API
3. **Profile Access**: Check profile data synchronization
4. **Vendor Operations**: Test vendor creation and listing
5. **Error Scenarios**: Test fallback behavior when API is unavailable

## Migration Notes

- Existing users in local database will continue to work
- New registrations will be synced with external API
- Vendor data will be gradually synced between systems
- OAuth users will need to select roles on first login

## Future Enhancements

1. **Real-time Sync**: Implement webhooks for real-time data synchronization
2. **Caching**: Add Redis caching for frequently accessed API data
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Monitoring**: Add API health checks and monitoring
5. **Batch Operations**: Implement batch sync for large data operations

This rewrite provides a robust foundation for integrating with the external API while maintaining backward compatibility and providing graceful fallbacks for reliability.
