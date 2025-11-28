# Mangalore Properties - Comprehensive Project Summary

## 1. Project Overview
**Name**: Mangalore Properties  
**Description**: A premium, full-stack real estate platform for discovering, buying, selling, and renting properties in Mangalore. Features a luxury design aesthetic, AI-powered search, advanced filtering, an admin CMS, and complete property lifecycle management.

**Target Audience**: Property buyers, sellers, renters, real estate agents, and builders in Mangalore.

---

## 2. Technology Stack

### Frontend
- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.0 (Custom design tokens with glassmorphism effects)
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.554.0
- **Utilities**: clsx 2.1.1, tailwind-merge 3.4.0

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (property-images bucket)
- **Client**: @supabase/supabase-js 2.84.0

### APIs & Integrations
- **AI Service**: Google Generative AI (Gemini) 0.24.1 - For natural language search and SEO generation
- **Maps & Location**: 
  - Google Maps API (`@react-google-maps/api` 2.20.7) - Location autocomplete in Admin Dashboard
  - OpenRouteService API - Distance/routing calculations for property details
- **External Services**: WhatsApp integration for lead generation

---

## 3. Project Structure

### `/app` - Next.js App Router Pages
```
/app
├── /actions
│   └── ai-service.ts          # Server action for AI (Gemini) operations
├── /admin                     # Protected Admin Dashboard
│   ├── /dashboard             # Analytics & overview
│   ├── /projects              # Manage properties (add/edit/delete)
│   ├── /leads                 # Lead management
│   ├── /seo                   # SEO optimization tools with AI
│   ├── /settings              # Admin settings
│   └── /login                 # Admin authentication
├── /api                       # Backend API routes
│   ├── /test-project          # Test endpoints
│   ├── /seed-builders         # Seed data endpoints
│   ├── /list-models           # AI model listing
│   └── /debug-builders        # Debug utilities
├── /projects                  # Public project listings
│   ├── page.tsx               # All projects grid with filters
│   └── /[id]                  # Individual project detail pages
├── /partners                  # Builder/Partner pages
│   ├── page.tsx               # Partners listing
│   └── /[slug]                # Individual builder profile
├── /rent                      # Rental properties
├── /resale                    # Resale properties
├── /commercial                # Commercial properties
├── /lands                     # Land/plot listings
├── /compare                   # Property comparison tool
├── /contact                   # Contact page
├── /profile                   # User profile
├── page.tsx                   # Homepage (unified property feed)
├── layout.tsx                 # Root layout with Navbar/Footer
├── globals.css                # Global styles
└── sitemap.ts                 # Dynamic sitemap generation
```

### `/components` - Reusable UI Components (28 files)
**Global Layout:**
- `Navbar.tsx` - Premium navigation with glassmorphism
- `Footer.tsx` - Footer with links and branding
- `MobileMenu.tsx` - Responsive mobile navigation

**Search & Discovery:**
- `GlobalSearch.tsx` - Keyword-based search with autocomplete
- `AiSearchBar.tsx` - Natural language AI search
- `HeroSearch.tsx` - Homepage hero search interface
- `AdvancedFilter.tsx` - Multi-criteria filtering

**Property Display:**
- `PropertyCard.tsx` - Reusable property card component
- `AmenitiesSection.tsx` - Display property amenities
- `FloorPlanSection.tsx` - Interactive floor plan viewer
- `DistanceDisplay.tsx` - Show distances to landmarks

**Interactive Features:**
- `FavoriteButton.tsx` - Add to favorites
- `CompareBar.tsx` - Floating comparison bar
- `EmiCalculator.tsx` - EMI calculation tool
- `LeadFormModal.tsx` - Lead capture form
- `LeadTrapModal.tsx` - Strategic lead capture popup
- `ProjectInquiryForm.tsx` - Project-specific inquiry
- `ProjectSelectorModal.tsx` - Multi-project selector

**Admin Components** (`/components/admin`):
- `AdminSidebar.tsx` - Admin dashboard navigation
- `ProjectForm.tsx` - Complex form for adding/editing properties (1182 lines)
- `ProjectActions.tsx` - Quick actions for projects

**Utilities:**
- `UserProvider.tsx` - User context provider
- `LoginModal.tsx` - User authentication modal
- `WhatsAppWidget.tsx` - Floating WhatsApp button
- `SeoFaq.tsx` - SEO-friendly FAQ component
- `JsonLd.tsx` - Structured data helper
- `AmenityModal.tsx` - Amenity details popup

### `/lib` - Utility Functions & Configuration
- `supabaseClient.ts` - Supabase initialization
- `ors.ts` - OpenRouteService integration (distance calculations)
- `data.ts` - Static/mock data
- Additional utilities (6 files total)

### `/public` - Static Assets
- Images, icons, and other static files (5 files)

---

## 4. Database Schema (Supabase PostgreSQL)

### Core Tables

#### **`builders`** (Property Developers/Builders)
```sql
- id: BIGINT PRIMARY KEY
- name: TEXT NOT NULL
- slug: TEXT UNIQUE NOT NULL
- description: TEXT
- logo_url: TEXT (Supabase Storage URL)
- year_est: TEXT (Year established)
- created_at: TIMESTAMP
```
**RLS**: Public read, Authenticated write

#### **`projects`** (Properties/Listings)
```sql
- id: BIGINT PRIMARY KEY
- name: TEXT NOT NULL (mapped from 'title' in form)
- slug: TEXT UNIQUE NOT NULL
- builder: BIGINT REFERENCES builders(id) (nullable for rentals)
- location: TEXT
- price: TEXT (e.g., "85 Lakhs")
- status: TEXT (New Launch, Under Construction, Ready to Move)
- type: TEXT (Residential, Commercial, Plots, Resale, Rent)
- sub_category: TEXT (House, Apartment, Villa, etc. - for Rent)
- description: TEXT
- image: TEXT (cover image URL)
- gallery_images: TEXT[] (array of image URLs)
- amenities: TEXT[] (array of amenities)
- floor_plans: JSONB[] (array of {name, image})
- video_url: TEXT
- featured: BOOLEAN
- completion_percentage: INTEGER
- map_url: TEXT (Google Maps embed URL)
- ai_local_insight: TEXT (AI-generated local insights)
- created_at: TIMESTAMP

-- New/Under Construction Fields
- total_units: INTEGER
- project_size: TEXT (e.g., "2 Acres")
- launch_date: DATE
- possession_date: DATE
- rera_id: TEXT

-- Resale/Rent Fields
- carpet_area: TEXT (sqft)
- floor_number: TEXT
- total_floors: INTEGER
- furnished_status: TEXT (Unfurnished, Semi-Furnished, Fully Furnished)
- bathrooms: INTEGER
- parking_count: TEXT
- maintenance_charges: TEXT
- security_deposit: TEXT (Rent only)
- preferred_tenants: TEXT (Rent only)

-- Enhanced Property Details
- lifts_count: INTEGER
- balconies_count: INTEGER
- facing: TEXT (North, South, East, West)
- price_per_sqft: DECIMAL
- additional_rooms: TEXT[] (Study, Pooja Room, etc.)
```
**RLS**: Public read, Authenticated write

#### **`leads`** (User Inquiries)
```sql
- id: UUID PRIMARY KEY
- created_at: TIMESTAMP
- name: TEXT NOT NULL
- phone: TEXT NOT NULL
- email: TEXT
- project: TEXT (project name or "General Inquiry")
- message: TEXT
```
**RLS**: Admin-only access

#### **`admins`** (Admin Users)
```sql
- id: BIGINT PRIMARY KEY
- email: TEXT UNIQUE NOT NULL
- password_hash: TEXT (or uses Supabase Auth)
- name: TEXT
- created_at: TIMESTAMP
```
**Auth**: Managed via Supabase Auth + localStorage session

#### **`favorites`** (User Saved Properties)
```sql
- id: BIGINT PRIMARY KEY
- user_id: UUID REFERENCES auth.users(id)
- project_id: BIGINT REFERENCES projects(id)
- created_at: TIMESTAMP
```

### Storage
**Bucket**: `property-images`
- **Public Read Access**: All images publicly accessible
- **Authenticated Write**: Admin users can upload/delete
- **Usage**: Cover images, gallery images, floor plans, builder logos

---

## 5. Key Features

### 🏠 Property Discovery
- **Unified Homepage Feed**: Displays all property types (Residential, Commercial, Rent, Resale, Plots) in a single responsive grid
- **Category Pages**: Dedicated pages for `/projects`, `/rent`, `/resale`, `/commercial`, `/lands`
- **Smart Filtering**: 
  - Filter by status (Ongoing, Ready, Upcoming)
  - Filter by type (Residential, Commercial, etc.)
  - Price range filtering
  - Location-based filtering
- **Advanced Search**:
  - **Global Search**: Keyword search with autocomplete
  - **AI Search**: Natural language queries powered by Google Gemini (e.g., "3BHK near beach under 1 crore")

### 📋 Property Details Page
- **Rich Media**:
  - Image gallery (swipeable carousel)
  - Video tours (YouTube/Vimeo embeds)
  - Floor plan viewer with multiple plan options
- **Comprehensive Information**:
  - Amenities list with icons
  - Specifications (carpet area, bathrooms, parking, etc.)
  - RERA ID and project timeline
- **Interactive Tools**:
  - **EMI Calculator**: Calculate monthly EMI based on loan amount, interest rate, tenure
  - **Distance Calculator**: Automatic driving distance/time to key landmarks (Airport, Mall, Bus Stand) using OpenRouteService API
  - **Map Preview**: Embedded Google Map
- **Lead Generation**:
  - Inquiry form (name, phone, message)
  - WhatsApp integration (direct chat with sales)
  - Lead trap modal (strategic popup after browsing time)

### 🎨 Luxury UI/UX
- **Design System**:
  - Glassmorphism effects (`.glass-panel` utility)
  - Premium typography (Custom fonts via `next/font`)
  - Gold accents (#DAA520) and dark theme
  - Smooth animations with Framer Motion
- **Responsive**: Mobile-first design, optimized for all screen sizes
- **Performance**: Next.js 16 App Router with server components, image optimization

### 👤 User Features
- **Favorites**: Save properties (requires login)
- **Compare**: Side-by-side comparison of up to 3 properties
- **User Profile**: Manage saved properties and inquiries
- **Authentication**: Login/signup modal (Supabase Auth)

### 🏢 Builder/Partner Ecosystem
- **Partners Page** (`/partners`): Grid of partnered builders with logos and descriptions
- **Builder Profile** (`/partners/[slug]`): Individual builder pages with all their projects
- **Builder Management**: Admin can add/edit/delete builders

### 🔐 Admin Dashboard (`/admin`)
**Authentication**: Custom auth with localStorage session (admin_auth flag)

**Dashboard** (`/dashboard`):
- **Analytics**: Total properties, active leads, page views, SEO health score
- **Recent Leads**: Table of latest inquiries with quick actions
- **Property Distribution**: Visual breakdown by category (Residential, Commercial, Rent, Land)
- **Quick Actions**: Buttons for adding properties, managing builders

**Projects Management** (`/admin/projects`):
- **Add/Edit Properties**: Comprehensive form with:
  - Basic info (title, builder, location, price, status, category)
  - Google Maps autocomplete for location (generates map embed URL)
  - Cover image + gallery images upload (Supabase Storage)
  - Floor plans (name + image for each)
  - Amenities (tag-based input)
  - Conditional fields based on category:
    - New Launch: total units, project size, launch date, possession date, RERA ID
    - Resale/Rent: carpet area, floor number, furnished status, bathrooms, parking
    - Rent-specific: security deposit, preferred tenants
  - Enhanced fields: lifts, balconies, facing direction, price per sqft
- **Delete Projects**: Remove listings from database
- **Image Management**: Upload to Supabase Storage, auto-generate public URLs

**Leads Management** (`/admin/leads`):
- View all inquiries in a table (name, phone, project, date)
- Export leads (future feature)

**SEO Tools** (`/admin/seo`):
- **SEO Health Score**: Calculates score based on:
  - Title length (20 points)
  - Description length (30 points)
  - Cover image presence (30 points)
  - AI local insight (20 points)
- **AI SEO Optimization**: "Fix with AI" button generates meta descriptions using Google Gemini
- **Issue Detection**: Highlights missing/short descriptions, missing images, etc.

**Settings** (`/admin/settings`): Admin profile, password change, system settings

### 🤖 AI Features (Google Gemini)
- **Natural Language Search**: 
  - User query → Gemini analyzes intent → Converts to structured filters → Returns relevant properties
  - Example: "affordable 2BHK apartments near Kadri" → Filters by location, price range, bedroom count
- **SEO Meta Description Generation**:
  - Admin clicks "Fix with AI" → Gemini generates SEO-optimized description from project title and category
  - Automatically updates database
- **Local Insights** (Future): AI-generated neighborhood insights, investment potential analysis

### 📍 Map & Location Features
- **Google Maps API** (Admin only):
  - Autocomplete for location input in ProjectForm
  - Auto-generates Google Maps embed URL
  - Live map preview in form
- **OpenRouteService API** (Public):
  - Calculates driving distance and time from property to 5 landmarks:
    1. Mangalore International Airport
    2. Forum Fiza Mall
    3. Ladyhill
    4. KSRTC Bus Stand
    5. Pumpwell Circle
  - Displayed on property detail page (`DistanceDisplay.tsx`)

### 📊 SEO & Performance
- **Dynamic Sitemap** (`sitemap.ts`): Auto-generates sitemap for all projects and pages
- **Structured Data**: JSON-LD schema for rich snippets (via `JsonLd.tsx`)
- **SEO FAQ Component**: Schema-friendly FAQ sections
- **SSR & ISR**: Server-side rendering with incremental static regeneration (`revalidate: 0`)
- **Image Optimization**: Next.js `<Image>` component with automatic WebP conversion

---

## 6. Environment Variables

```env
# Supabase (Database & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Google Maps (Location Autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

# OpenRouteService (Distance Calculations)
ORS_API_KEY=5b3ce3597851110001cf...

# Google Gemini AI (Search & SEO)
GEMINI_API_KEY=AIza...
```

---

## 7. Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Create .env.local and add all environment variables

# Run development server
npm run dev
```

### Database Setup
1. Create Supabase project
2. Run SQL scripts in this order:
   - `setup_cms.sql` - Core tables and RLS policies
   - `create_leads_table.sql` - Leads table
   - `create_admins_table.sql` - Admin users
   - `create_favorites_table.sql` - User favorites
   - `seed_builders_data.sql` - Sample builders
3. Create `property-images` bucket in Supabase Storage
4. Enable RLS policies as defined in SQL files

### Admin Account
- Create admin user in Supabase Auth or `admins` table
- Use email/password to login at `/admin/login`
- Session stored in `localStorage` (admin_auth flag)

### Adding Properties
1. Login to admin dashboard
2. Navigate to "Projects" → "Add New"
3. Fill in form with property details
4. Upload images (stored in Supabase Storage)
5. Submit → Auto-generates slug, uploads images, inserts to DB

---

## 8. API Routes & Utilities

### Server Actions (`/app/actions`)
- `ai-service.ts`: 
  - `runAI(type, input)`: Calls Google Gemini for AI search or SEO generation
  - Types: "search" (property search), "seo" (meta description generation)

### Utility Scripts (Root Directory)
**Database Management:**
- `add_dummy_projects.js` - Seed projects
- `check_db_projects.js` - Verify project data
- `clear_projects.js` - Delete all projects
- `list_projects.js` - List all projects
- `verify_project.js` - Check specific project

**Schema Migrations:**
- `run_migration.js` - Execute schema changes
- `fix_projects_schema.sql` - Schema compatibility fixes
- `add_property_details.sql` - Add new property fields
- `upgrade_projects_schema.sql` - Schema upgrades

**Debugging:**
- `test_db_connection.js` - Test Supabase connection
- `test_ai_search.js` - Test AI search functionality
- `debug_projects_page.js` - Debug project listing issues

---

## 9. Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on each push

**Instructions**: See `DEPLOY_INSTRUCTIONS.md`

### Environment Configuration
- Production: Set all 4 environment variables
- Ensure Supabase URL and keys match production project
- Update Google Maps API restrictions to production domain
- Configure OpenRouteService API rate limits

---

## 10. Recent Updates & Known Issues

### Latest Changes
- Integrated OpenRouteService for real-time distance calculations
- Added AI-powered SEO tools in admin dashboard
- Implemented unified homepage feed (all property types)
- Created Partners/Builder ecosystem pages
- Enhanced property form with conditional fields based on category
- Fixed dashboard merge conflicts and import errors
- Relaxed image validation (optional images for some categories)

### Known Issues
- Git executable not found (deployment blocker) - User needs to configure Git path
- Some console warnings for React 19 compatibility
- Mock data for page views and trends in dashboard (needs analytics integration)

### Future Enhancements
- User review/rating system for properties
- Virtual property tours (360° images)
- Mortgage calculator with bank rate comparisons
- Email notifications for new leads
- Multi-language support (Kannada, Hindi)
- Dark/Light mode toggle
- Advanced analytics dashboard (Google Analytics integration)
- Lead scoring and CRM integration

---

## 11. File Statistics
- **Total Directories**: 9 subdirectories in `/app`, 1 in `/components`
- **Total Files**: 70+ files (including SQL, JS scripts)
- **Components**: 28 reusable components
- **Admin Pages**: 6 admin routes (dashboard, projects, leads, seo, settings, login)
- **Public Pages**: 9+ public routes (home, projects, rent, resale, commercial, lands, partners, compare, contact)

---

## 12. Dependencies Summary

### Production Dependencies (11)
- Next.js, React, React DOM (Core framework)
- Supabase client (Database & Auth)
- Google Generative AI (AI features)
- Google Maps API (Location services)
- Framer Motion (Animations)
- Lucide React (Icons)
- clsx, tailwind-merge (Utility classes)
- dotenv (Environment variables)
- pg (PostgreSQL driver)

### Dev Dependencies (7)
- TypeScript, ESLint (Code quality)
- Tailwind CSS + PostCSS (Styling)
- Type definitions for Node, React

---

**Last Updated**: November 28, 2025  
**Version**: 0.1.0  
**Maintainer**: Admin Team
