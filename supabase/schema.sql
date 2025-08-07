-- Enable Row Level Security (RLS)
alter table if exists public.profiles enable row level security;
alter table if exists public.jobs enable row level security;
alter table if exists public.applications enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  first_name text not null,
  last_name text not null,
  user_type text not null check (user_type in ('teacher', 'school')),
  phone text,
  profile_image text,
  availability text check (availability in ('available', 'not_available', 'active')),
  bio text,
  experience text,
  education text,
  skills text[],
  location text,
  school_name text,
  school_logo text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create jobs table
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  requirements text[] not null default '{}',
  location text not null,
  salary_range text,
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'contract')),
  subject text,
  grade_level text,
  posted_date date default current_date,
  application_deadline date,
  status text not null default 'open' check (status in ('open', 'closed', 'filled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create applications table
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  cover_letter text not null,
  additional_info text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  submitted_at timestamp with time zone default now(),
  unique(job_id, teacher_id)
);

-- Create storage buckets
insert into storage.buckets (id, name, public) 
values 
  ('profile-images', 'profile-images', true),
  ('school-logos', 'school-logos', true)
on conflict (id) do nothing;

-- Set up Row Level Security (RLS) policies

-- Profiles policies
create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Jobs policies
create policy "Anyone can view open jobs" on public.jobs
  for select using (status = 'open');

create policy "Schools can manage their own jobs" on public.jobs
  for all using (
    auth.uid() in (
      select id from public.profiles 
      where id = auth.uid() and user_type = 'school'
    ) and school_id = auth.uid()
  );

create policy "Schools can insert jobs" on public.jobs
  for insert with check (
    auth.uid() in (
      select id from public.profiles 
      where id = auth.uid() and user_type = 'school'
    ) and school_id = auth.uid()
  );

-- Applications policies
create policy "Teachers can view their own applications" on public.applications
  for select using (teacher_id = auth.uid());

create policy "Schools can view applications to their jobs" on public.applications
  for select using (
    job_id in (
      select id from public.jobs where school_id = auth.uid()
    )
  );

create policy "Teachers can submit applications" on public.applications
  for insert with check (
    teacher_id = auth.uid() and
    auth.uid() in (
      select id from public.profiles 
      where id = auth.uid() and user_type = 'teacher'
    )
  );

create policy "Schools can update application status" on public.applications
  for update using (
    job_id in (
      select id from public.jobs where school_id = auth.uid()
    )
  );

-- Storage policies
create policy "Anyone can view profile images" on storage.objects
  for select using (bucket_id = 'profile-images');

create policy "Users can upload their own profile image" on storage.objects
  for insert with check (
    bucket_id = 'profile-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own profile image" on storage.objects
  for update using (
    bucket_id = 'profile-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view school logos" on storage.objects
  for select using (bucket_id = 'school-logos');

create policy "Schools can upload their own logo" on storage.objects
  for insert with check (
    bucket_id = 'school-logos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Schools can update their own logo" on storage.objects
  for update using (
    bucket_id = 'school-logos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create functions and triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_jobs_updated_at
  before update on public.jobs
  for each row execute function update_updated_at_column();