# Supabase Configuration

To connect your WondasTeach platform to Supabase, follow these steps:

## 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for your project to be set up (usually takes 2-3 minutes)

## 2. Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://your-project-id.supabase.co`)
3. Copy your **Anon Key** (a long string starting with `eyJ...`)

## 3. Update Your Configuration
1. Open `/utils/supabase.ts`
2. Replace the placeholder values on lines 4-5:

```typescript
const supabaseUrl = 'https://your-project-id.supabase.co'  // Replace this
const supabaseAnonKey = 'your-anon-key-here'               // Replace this
```

## 4. Set Up Your Database
1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `/supabase/schema.sql`
3. Paste it into the SQL Editor and click **Run**

This will create all the necessary tables, storage buckets, and security policies.

## 5. Restart the Application
After updating the configuration, refresh your browser to see WondasTeach connect to your Supabase database!

## What You Get
- Real user authentication and data persistence
- Secure file uploads for profile images and school logos
- Row-level security protecting user data
- Real-time features (coming soon)

## Troubleshooting
- **Connection fails**: Double-check your URL and key are correct
- **Database errors**: Make sure you've run the schema.sql script
- **Permission errors**: The schema includes all necessary security policies

Need help? The platform works perfectly in offline mode while you get Supabase set up!