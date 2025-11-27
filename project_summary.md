# Mangalore Properties - Project Summary

## 1. Project Overview
**Name**: Mangalore Properties
**Description**: A premium real estate platform for buying, selling, and renting properties in Mangalore. It features a modern, luxury design with advanced search capabilities, an admin dashboard, and integration with various services.

## 2. Technology Stack
- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.0
- **Database & Auth**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (Gemini)
- **Maps/Routing**: OpenRouteService API, @react-google-maps/api

## 3. Project Structure
### Core Directories
- **/app**: Next.js App Router pages and layouts.
  - `/admin`: Protected admin dashboard (Login, Dashboard, Projects, Leads, SEO).
  - `/projects`: Public project listings and individual project details (`[id]`).
  - `/api`: Backend API routes.
- **/components**: Reusable UI components.
  - `Navbar.tsx`, `Footer.tsx`: Global layout elements.
  - `PropertyCard.tsx`: Reusable card for displaying properties.
  - `GlobalSearch.tsx`, `AiSearchBar.tsx`: Search functionality.
  - `LeadFormModal.tsx`: User lead capture.
- **/lib**: Utility functions and configurations.
  - `supabaseClient.ts`: Supabase client initialization.
  - `ors.ts`: OpenRouteService integration for calculating distances.
  - `data.ts`: Static/Mock data.
- **/public**: Static assets (images, icons).

## 4. Database Schema (Supabase)
### Tables
1. **`builders`**
   - `id`: Primary Key
   - `name`, `slug`, `description`, `logo_url`, `year_est`
   - RLS enabled: Public read, Admin write.

2. **`projects`**
   - `id`: Primary Key
   - `title`, `slug`
   - `builder_id`: Foreign Key to `builders`
   - `location`, `price_text`, `status`, `category`
   - `cover_image_url`, `gallery_images` (Array), `amenities` (Array)
   - `video_url`, `featured`
   - RLS enabled: Public read, Admin write.

3. **`leads`** (Inferred)
   - Captures user inquiries.

4. **`admins`** (Inferred)
   - Manages admin access.

### Storage
- **Bucket**: `property-images`
- **Policies**: Public read access, Authenticated (Admin) upload/delete access.

## 5. Key Features
- **Luxury UI**: Glassmorphism effects, premium typography, and smooth animations.
- **Advanced Search**:
  - **Global Search**: Search by keyword.
  - **AI Search**: Natural language search powered by Google Gemini.
  - **Smart Filters**: Filter by status (Ongoing, Ready, Upcoming).
- **Project Details**:
  - Image Gallery & Video.
  - Amenities list.
  - Floor Plans.
  - **Distance Calculator**: Automatically calculates driving distance/time to key landmarks (Airport, Mall, Bus Stand) using OpenRouteService.
  - EMI Calculator.
- **Admin Dashboard**:
  - Secure login.
  - Manage Projects (Add/Edit/Delete).
  - View and manage Leads.
- **User Engagement**:
  - Favorites system.
  - Compare properties.
  - WhatsApp integration.

## 6. Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public API key.
- `ORS_API_KEY`: OpenRouteService API key for distance calculations.
- `GEMINI_API_KEY`: Google Gemini API key for AI features.

## 7. Recent Updates
- Integrated **OpenRouteService** for real-time distance calculation from landmarks.
- Updated `lib/ors.ts` to fetch driving distances.
- Configured `.env.local` with necessary API keys.
