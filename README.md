# WondasTeach Platform

A modern teacher-school connection platform built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/wondasteach-platform)

## 🔧 Setup Instructions

### 1. Environment Variables

Set these environment variables in your Vercel dashboard or `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `/supabase/schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Settings → API

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Demo Accounts

Test the application with these demo accounts:

- **Teacher**: `teacher@demo.com` (password: `demo123`)
- **School**: `school@demo.com` (password: `demo123`)

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Backend**: Supabase (Auth + Database + Storage)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📖 Features

- ✅ User authentication (teachers and schools)
- ✅ Profile management with image uploads
- ✅ Job posting and application system
- ✅ Real-time dashboard
- ✅ Responsive design
- ✅ Mock data fallback for development

## 🔗 Important Links

- [Supabase Setup Guide](./supabase/setup-guide.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Setup Page](/?page=setup) - Access via `?page=setup` URL parameter

## 📄 License

This project is licensed under the MIT License.