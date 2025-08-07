# Supabase Setup Guide for WondasTeach

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard

## Configuration Steps

### 1. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql` into the editor
4. Click "Run" to execute the SQL commands

This will create:
- `profiles` table for user profiles
- `jobs` table for job postings
- `applications` table for job applications
- Storage buckets for profile images and school logos
- Row Level Security (RLS) policies for data protection

### 2. Authentication Setup
1. Go to Authentication → Settings in your Supabase dashboard
2. Under "Auth Settings", ensure:
   - Enable email confirmations (recommended for production)
   - Set redirect URLs if needed
3. Under "Email Templates", customize signup/reset emails if desired

### 3. Storage Setup
The storage buckets are automatically created by the schema script, but you can verify:
1. Go to Storage in your Supabase dashboard
2. You should see:
   - `profile-images` bucket (public)
   - `school-logos` bucket (public)

### 4. Environment Configuration
1. In your Supabase dashboard, go to Settings → API
2. Copy your project URL and anon key
3. Update `/utils/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'YOUR_PROJECT_URL_HERE'
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'
```

**Important**: Replace these placeholders with your actual Supabase credentials.

### 5. Testing the Setup
1. Try creating a user account through the app
2. Check the `auth.users` table in Supabase to see if users are being created
3. Check the `profiles` table to see if profiles are being created
4. Test uploading a profile image

## Common Issues and Solutions

### Issue: "relation does not exist" errors
**Solution**: Make sure you've run the schema.sql script in the SQL Editor

### Issue: Permission denied errors
**Solution**: Check that RLS policies are properly set up by re-running the schema script

### Issue: File upload failures
**Solution**: Verify storage buckets exist and have proper public policies

### Issue: Authentication failures
**Solution**: Check that your Supabase URL and anon key are correct in the code

## Database Schema Overview

### Profiles Table
- Stores user information for both teachers and schools
- Links to Supabase auth.users table
- Includes profile images, bio, skills, etc.

### Jobs Table
- Stores job postings created by schools
- Links to school profiles via foreign key
- Includes job details, requirements, status

### Applications Table
- Stores teacher applications to jobs
- Links teachers to specific job postings
- Tracks application status and details

## Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Schools can only manage their own jobs
- Teachers can only view open jobs and submit applications
- Secure file uploads with user-specific access