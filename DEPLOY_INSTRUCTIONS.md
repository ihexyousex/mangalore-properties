# Deployment Instructions

Since `git` is not available in the current terminal environment and Vercel CLI is not authenticated, I cannot perform the deployment automatically. Please follow these steps to deploy your application.

## 1. Push Code to GitHub

Open a terminal where `git` is installed (e.g., Git Bash, VS Code Terminal) and run:

```bash
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add your repository
git remote add origin https://github.com/ihexyousex/mangalore-properties

# Push to main branch
git push -u origin main
```

## 2. Deploy on Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/new).
2.  Import the repository: **ihexyousex/mangalore-properties**.
3.  **Configure Project**:
    *   Framework Preset: **Next.js**
    *   Root Directory: `./` (default)
4.  **Environment Variables**:
    Copy and paste these values into the "Environment Variables" section:

    | Key | Value |
    |-----|-------|
    | `NEXT_PUBLIC_SUPABASE_URL` | `https://pxtigoysynrruydefdic.supabase.co` |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Copy from your .env.local)* |
    | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | *(Copy from your .env.local)* |
    | `NEXT_PUBLIC_IMAGEKIT_URL` | `https://ik.imagekit.io/mangalore` |
    | `ORS_API_KEY` | `eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjA2ZTM4NmJjNTdkYjQ2MjFhZjFmNDJhODE0MzVmNjZkIiwiaCI6Im11cm11cjY0In0=` |
    | `GEMINI_API_KEY` | *(Copy from your .env.local)* |

5.  Click **Deploy**.

## 3. Post-Deployment
Once deployed, Vercel will give you a live URL (e.g., `https://mangalore-properties.vercel.app`).
Send this URL to your friend for testing.
