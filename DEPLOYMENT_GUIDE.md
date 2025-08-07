# WondasTeach Deployment Guide

This guide will help you deploy your WondasTeach application to production and connect it to Supabase.

## Prerequisites

1. ✅ A Supabase project with the database schema set up
2. ✅ Your Supabase project URL and anon key
3. ✅ Your application code ready for deployment

## Quick Start

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to the SQL Editor and run the contents of `/supabase/schema.sql`
3. Go to Settings → API and copy your:
   - Project URL (looks like `https://xyz123.supabase.co`)
   - Anon public key (starts with `eyJ...`)

### 2. Configure Environment Variables

Set these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Deploy to Your Platform

Choose one of the deployment options below:

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is ideal for Next.js applications and offers seamless deployment.

1. **Connect your repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your GitHub repository

2. **Set environment variables:**
   - In the deployment settings, add your Supabase environment variables
   - Click "Deploy"

3. **Custom domain (optional):**
   - Add your custom domain in the Vercel dashboard
   - Update Supabase auth settings if needed

**Deploy with one click:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Option 2: Netlify

Netlify offers great static site hosting with serverless functions.

1. **Connect your repository:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git" and connect your repository

2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `out` (for static export) or `.next` (for serverless)

3. **Environment variables:**
   - Go to Site Settings → Environment Variables
   - Add your Supabase environment variables

**Deploy with one click:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Option 3: Railway

Railway provides easy deployment with built-in database options.

1. **Connect your repository:**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub" and select your repository

2. **Environment variables:**
   - In the project settings, add your Supabase environment variables

3. **Custom domain:**
   - Railway provides a free subdomain
   - Add custom domain in the project settings

**Deploy with one click:**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

### Option 4: Docker Deployment

For self-hosting or custom deployment platforms:

1. **Build the Docker image:**
   ```bash
   docker build -t wondasteach .
   ```

2. **Run with environment variables:**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your-url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     wondasteach
   ```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Your Supabase anon public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Post-Deployment Checklist

### 1. Test Core Functionality

- [ ] **Authentication:** Try signing up and logging in
- [ ] **Profiles:** Create and update teacher/school profiles
- [ ] **Job Listings:** Create and view job postings
- [ ] **Applications:** Submit and view applications
- [ ] **File Uploads:** Upload profile images and school logos

### 2. Configure Supabase Settings

- [ ] **Auth redirect URLs:** Add your domain to Supabase auth settings
- [ ] **Storage policies:** Verify file upload permissions work
- [ ] **Email templates:** Customize signup/reset email templates
- [ ] **Rate limiting:** Configure appropriate limits for your usage

### 3. Performance & Security

- [ ] **SSL certificate:** Ensure HTTPS is enabled
- [ ] **CDN:** Configure caching for static assets
- [ ] **Monitoring:** Set up error tracking (Sentry, etc.)
- [ ] **Analytics:** Add Google Analytics or similar

## Demo Accounts

Your deployed application includes these demo accounts for testing:

| Account Type | Email | Password | Name |
|-------------|--------|----------|------|
| Teacher | teacher@demo.com | demo123 | Sarah Johnson |
| Teacher | james.wilson@demo.com | demo123 | James Wilson |
| School | school@demo.com | demo123 | Green Valley Admin |
| School | sunnybrook@demo.com | demo123 | Sunnybrook Admin |

## Troubleshooting

### Common Issues

**"Invalid login credentials"**
- Check that your Supabase URL and anon key are correct
- Verify the schema.sql has been run in your Supabase project

**"relation does not exist" errors**
- Run the complete schema.sql file in your Supabase SQL editor
- Check that all tables were created successfully

**File upload failures**
- Verify storage buckets were created by the schema
- Check storage policies in Supabase dashboard

**Environment variables not loading**
- Make sure variable names start with `NEXT_PUBLIC_`
- Restart your deployment after adding variables
- Check the deployment logs for any errors

### Getting Help

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check your deployment platform's logs
3. Verify your Supabase project settings
4. Test the connection using the setup page at `/setup`

## Production Considerations

### Security

- [ ] Enable email confirmation in Supabase auth settings
- [ ] Set up proper CORS settings
- [ ] Consider enabling captcha for signup forms
- [ ] Review and audit RLS policies

### Scaling

- [ ] Monitor database performance in Supabase dashboard
- [ ] Set up database backups
- [ ] Consider upgrading Supabase plan for higher limits
- [ ] Implement caching strategies for better performance

### Monitoring

- [ ] Set up error tracking
- [ ] Monitor application performance
- [ ] Track user analytics
- [ ] Set up uptime monitoring

## Support

For additional help with deployment:
- Check the [Supabase documentation](https://supabase.com/docs)
- Review your deployment platform's documentation
- Check the application logs for specific error messages

---

**Ready to deploy?** Choose your preferred platform above and follow the setup steps!