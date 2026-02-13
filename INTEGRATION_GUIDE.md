# Mentawai Land & Living - Integration Guide

## 🎯 Overview

This document explains how the frontend (React + Vite) is integrated with the backend (Laravel API).

## 📁 Project Structure

```
mentawai-shores-main/          # Frontend (React + Vite + TypeScript)
├── src/
│   ├── lib/
│   │   ├── api.ts            # API client with Axios
│   │   ├── types.ts          # TypeScript interfaces matching backend
│   │   ├── store.ts          # Zustand state management (Auth)
│   │   └── utils.ts          # Utility functions
│   ├── pages/
│   │   ├── Index.tsx         # Homepage
│   │   ├── PropertyDetail.tsx # Property detail page
│   │   ├── Login.tsx         # Login page
│   │   ├── Register.tsx      # Register page
│   │   └── NotFound.tsx      # 404 page
│   └── components/
│       ├── Navbar.tsx        # Navigation with auth state
│       ├── FeaturedProperties.tsx # Fetches from API
│       ├── ExploreIslands.tsx    # Fetches from API
│       └── ...
└── .env                      # Environment variables

mentawai-backend/              # Backend (Laravel 10)
├── app/
│   ├── Http/Controllers/Api/ # API Controllers
│   ├── Models/               # Eloquent Models
│   └── Services/             # Business Logic
├── routes/api.php            # API Routes
└── config/cors.php           # CORS Configuration
```

## 🔧 Setup Instructions

### 1. Backend Setup (Laravel)

```bash
cd mentawai-backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mentawai_land_living
DB_USERNAME=root
DB_PASSWORD=

# Configure frontend URL for CORS
FRONTEND_URL=http://localhost:8080

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start Laravel server
php artisan serve
# Server will run on http://localhost:8000
```

### 2. Frontend Setup (React + Vite)

```bash
cd mentawai-shores-main

# Install dependencies
npm install

# Environment is already configured in .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
# Server will run on http://localhost:8080
```

## 🔌 API Integration

### API Client (`src/lib/api.ts`)

The API client is built with Axios and includes:

- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Authentication**: Automatic Bearer token injection from localStorage
- **Error Handling**: 401 redirects to login page
- **Type Safety**: Full TypeScript support

```typescript
import { api } from '@/lib/api';

// Example: Fetch featured properties
const response = await api.getFeaturedProperties();
const properties = response.data;

// Example: Login
await api.login({ email, password });

// Example: Create lead
await api.createLead(propertyId, { name, email, phone, message });
```

### Available API Methods

#### Authentication
- `login(credentials)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `getProfile()` - Get current user profile
- `updateProfile(userData)` - Update user profile
- `changePassword(passwords)` - Change password

#### Properties
- `getProperties(filters?)` - Get paginated properties
- `getProperty(slug)` - Get single property by slug
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property
- `getFeaturedProperties()` - Get featured properties
- `getLatestProperties(params?)` - Get latest properties
- `getMyProperties()` - Get user's properties

#### Property Images
- `uploadPropertyImages(propertyId, images)` - Upload images
- `deletePropertyImage(propertyId, imageId)` - Delete image
- `setPrimaryImage(propertyId, imageId)` - Set primary image
- `reorderImages(propertyId, imageIds)` - Reorder images

#### Categories & Islands
- `getCategories()` - Get all categories
- `getCategory(slug)` - Get category by slug
- `getCategoryProperties(slug, filters?)` - Get properties by category
- `getIslands()` - Get all islands
- `getIsland(slug)` - Get island by slug
- `getIslandProperties(slug, filters?)` - Get properties by island

#### Favorites
- `getFavorites()` - Get user's favorites
- `addFavorite(propertyId)` - Add to favorites
- `removeFavorite(propertyId)` - Remove from favorites
- `toggleFavorite(propertyId)` - Toggle favorite status
- `checkFavorite(propertyId)` - Check if favorited

#### Leads
- `getLeads()` - Get user's leads
- `getLead(id)` - Get single lead
- `createLead(propertyId, data)` - Create new lead
- `updateLeadStatus(id, status)` - Update lead status
- `deleteLead(id)` - Delete lead
- `getLeadStats()` - Get lead statistics

#### Bookings
- `getBookings()` - Get user's bookings
- `getBooking(id)` - Get single booking
- `createBooking(propertyId, data)` - Create new booking
- `cancelBooking(id)` - Cancel booking
- `confirmBooking(id)` - Confirm booking (owner)
- `completeBooking(id)` - Complete booking (owner)
- `getBookingStats()` - Get booking statistics
- `checkAvailability(propertyId, params)` - Check availability
- `getPropertyBookings()` - Get property bookings (owner)

## 🔐 Authentication Flow

### 1. User Registration/Login

```typescript
import { useAuth } from '@/lib/store';

const { login, register, user, isAuthenticated } = useAuth();

// Register
await register({
  name: "John Doe",
  email: "john@example.com",
  phone: "+62812345678",
  password: "password123",
  password_confirmation: "password123",
  role: "user" // or "owner", "agent"
});

// Login
await login({
  email: "john@example.com",
  password: "password123",
  remember: true
});
```

### 2. Token Management

- Token is automatically stored in `localStorage` after login
- Token is automatically included in all API requests via Axios interceptor
- Token is cleared on logout or 401 error

### 3. Protected Routes

```typescript
// Check authentication status
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  // Redirect to login
  navigate('/login');
}

// Check user role
if (user?.role === 'owner') {
  // Show owner-specific features
}
```

## 📊 State Management

### Zustand Store (`src/lib/store.ts`)

```typescript
import { useAuth } from '@/lib/store';

const {
  user,              // Current user object
  token,             // Auth token
  isAuthenticated,   // Boolean auth status
  isLoading,         // Loading state
  error,             // Error message
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  fetchProfile,      // Fetch user profile
  updateProfile,     // Update user profile
  clearError,        // Clear error message
} = useAuth();
```

### React Query

Used for data fetching with automatic caching and refetching:

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const { data, isLoading, error } = useQuery({
  queryKey: ['featured-properties'],
  queryFn: async () => {
    const response = await api.getFeaturedProperties();
    return response.data;
  },
});
```

## 🎨 Component Integration Examples

### 1. Featured Properties Component

```typescript
// src/components/FeaturedProperties.tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const FeaturedProperties = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const response = await api.getFeaturedProperties();
      return response.data || [];
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      {data.map(property => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
};
```

### 2. Property Detail Page

```typescript
// src/pages/PropertyDetail.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const PropertyDetail = () => {
  const { id } = useParams();
  
  const { data: property } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.getProperty(id);
      return response.data;
    },
  });

  // Handle lead submission
  const handleSubmit = async (formData) => {
    await api.createLead(property.id, formData);
  };

  return <div>{/* Property details */}</div>;
};
```

### 3. Navbar with Auth

```typescript
// src/components/Navbar.tsx
import { useAuth } from "@/lib/store";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </>
      )}
    </nav>
  );
};
```

## 🔍 TypeScript Types

All backend response types are defined in `src/lib/types.ts`:

```typescript
import type { Property, User, Category, Island } from '@/lib/types';

// Property type matches backend exactly
interface Property {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  price_type: 'sale' | 'rent_daily' | 'rent_monthly' | 'rent_yearly';
  land_area: number | null;
  building_area: number | null;
  // ... more fields
  category?: Category;
  island?: Island;
  user?: User;
  images?: PropertyImage[];
}
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend**:
   ```bash
   cd mentawai-backend
   php artisan serve
   ```
   Backend runs on: http://localhost:8000

2. **Start Frontend**:
   ```bash
   cd mentawai-shores-main
   npm run dev
   ```
   Frontend runs on: http://localhost:8080

3. **Access Application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000/api
   - API Documentation: Check POSTMAN_COLLECTION.json

### Production Build

```bash
# Frontend
cd mentawai-shores-main
npm run build
# Output in dist/ folder

# Backend
cd mentawai-backend
php artisan optimize
php artisan config:cache
php artisan route:cache
```

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check `mentawai-backend/config/cors.php`
2. Ensure `FRONTEND_URL` in `.env` matches your frontend URL
3. Clear Laravel config cache: `php artisan config:clear`

### 401 Unauthorized

If API returns 401:
1. Check if token is stored in localStorage
2. Verify token is valid (not expired)
3. Check if backend is running
4. Clear browser cache and localStorage

### API Connection Failed

If frontend can't connect to backend:
1. Verify backend is running on http://localhost:8000
2. Check `VITE_API_URL` in frontend `.env`
3. Check network tab in browser DevTools
4. Verify no firewall blocking the connection

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Mentawai Land & Living
VITE_APP_URL=http://localhost:8080
```

### Backend (.env)
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mentawai_land_living
DB_USERNAME=root
DB_PASSWORD=

# Cloudinary (for image uploads)
CLOUDINARY_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## ✅ Integration Checklist

- [x] API client configured with Axios
- [x] TypeScript types matching backend models
- [x] Authentication with Zustand store
- [x] Token management (localStorage)
- [x] CORS configuration
- [x] React Query for data fetching
- [x] Login & Register pages
- [x] Property listing from API
- [x] Property detail from API
- [x] Islands listing from API
- [x] Lead submission form
- [x] Navbar with auth state
- [x] Error handling
- [x] Loading states

## 🎉 Success!

Your frontend is now fully integrated with the Laravel backend. All API endpoints are accessible through the `api` client, and authentication is handled automatically.

For more details, check:
- Backend API: `mentawai-backend/routes/api.php`
- Frontend API Client: `mentawai-shores-main/src/lib/api.ts`
- Type Definitions: `mentawai-shores-main/src/lib/types.ts`
