import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase configuration - you can either:
// 1. Replace these values directly, or
// 2. Set environment variables (recommended for production)
const getEnvVar = (key: string, fallback: string) => {
  try {
    // Check if we're in a server environment with process.env
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    // Check if we're in a browser environment with import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    // Fallback to default value
    return fallback;
  } catch (error) {
    // If all else fails, return the fallback
    return fallback;
  }
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://your-project-id.supabase.co')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'your-anon-key-here')

// Check if we have real Supabase credentials
const hasRealCredentials = supabaseUrl !== 'https://your-project-id.supabase.co' && 
                          supabaseAnonKey !== 'your-anon-key-here' &&
                          supabaseUrl.includes('.supabase.co') &&
                          supabaseAnonKey.length > 20

// Create Supabase client (will use placeholder values if real ones aren't provided)
let supabase: SupabaseClient | null = null
try {
  if (hasRealCredentials) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Connected to Supabase:', supabaseUrl)
  } else {
    console.log('🔧 Running in mock mode - replace credentials to connect to Supabase')
  }
} catch (error) {
  console.log('🔧 Supabase client creation failed, using mock mode')
}

// Database table types
export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  user_type: 'teacher' | 'school'
  phone?: string
  profile_image?: string
  availability?: 'available' | 'not_available' | 'active'
  bio?: string
  experience?: string
  education?: string
  skills?: string[]
  location?: string
  school_name?: string
  school_logo?: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  school_id: string
  title: string
  description: string
  requirements: string[]
  location: string
  salary_range?: string
  employment_type: 'full-time' | 'part-time' | 'contract'
  subject?: string
  grade_level?: string
  posted_date: string
  application_deadline?: string
  status: 'open' | 'closed' | 'filled'
  created_at: string
  updated_at: string
  school?: Profile
}

export interface Application {
  id: string
  job_id: string
  teacher_id: string
  cover_letter: string
  additional_info?: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  submitted_at: string
  job?: Job
  teacher?: Profile
}

// Mock data for development/testing
const mockProfiles: Profile[] = [
  {
    id: 'demo-teacher-1',
    email: 'teacher@demo.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    user_type: 'teacher',
    phone: '+1 (555) 123-4567',
    profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    availability: 'available',
    bio: 'Passionate mathematics teacher with 8 years of experience in secondary education.',
    experience: '8 years teaching high school mathematics',
    education: 'Masters in Mathematics Education - Stanford University',
    skills: ['Mathematics', 'Algebra', 'Calculus', 'Statistics', 'Classroom Management'],
    location: 'San Francisco, CA',
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'demo-teacher-2',
    email: 'james.wilson@demo.com',
    first_name: 'James',
    last_name: 'Wilson',
    user_type: 'teacher',
    phone: '+1 (555) 234-5678',
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    availability: 'available',
    bio: 'Creative English teacher who loves inspiring students through literature.',
    experience: '5 years teaching middle school English',
    education: 'Bachelor of Arts in English Literature - UC Berkeley',
    skills: ['English Literature', 'Creative Writing', 'Reading Comprehension', 'Public Speaking'],
    location: 'Oakland, CA',
    created_at: '2024-02-01T09:30:00.000Z',
    updated_at: '2024-02-01T09:30:00.000Z'
  },
  {
    id: 'demo-school-1',
    email: 'school@demo.com',
    first_name: 'Green Valley',
    last_name: 'Admin',
    user_type: 'school',
    phone: '+1 (555) 987-6543',
    profile_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=150&fit=crop',
    availability: 'active',
    bio: 'Premier educational institution committed to excellence in learning.',
    school_name: 'Green Valley Elementary School',
    school_logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
    location: 'Palo Alto, CA',
    created_at: '2024-01-10T09:00:00.000Z',
    updated_at: '2024-01-10T09:00:00.000Z'
  },
  {
    id: 'demo-school-2',
    email: 'sunnybrook@demo.com',
    first_name: 'Sunnybrook',
    last_name: 'Admin',
    user_type: 'school',
    phone: '+1 (555) 876-5432',
    profile_image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop',
    availability: 'active',
    bio: 'Innovation-focused academy preparing students for the future.',
    school_name: 'Sunnybrook Academy',
    school_logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop',
    location: 'San Jose, CA',
    created_at: '2024-01-20T11:00:00.000Z',
    updated_at: '2024-01-20T11:00:00.000Z'
  }
]

// Demo users for easy testing (password is always "demo123" in mock mode)
const mockUsers = [
  {
    id: 'demo-teacher-1',
    email: 'teacher@demo.com',
    user_metadata: {
      first_name: 'Sarah',
      last_name: 'Johnson',
      user_type: 'teacher'
    },
    created_at: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'demo-teacher-2',
    email: 'james.wilson@demo.com',
    user_metadata: {
      first_name: 'James',
      last_name: 'Wilson',
      user_type: 'teacher'
    },
    created_at: '2024-02-01T09:30:00.000Z'
  },
  {
    id: 'demo-school-1',
    email: 'school@demo.com',
    user_metadata: {
      first_name: 'Green Valley',
      last_name: 'Admin',
      user_type: 'school'
    },
    created_at: '2024-01-10T09:00:00.000Z'
  },
  {
    id: 'demo-school-2',
    email: 'sunnybrook@demo.com',
    user_metadata: {
      first_name: 'Sunnybrook',
      last_name: 'Admin',
      user_type: 'school'
    },
    created_at: '2024-01-20T11:00:00.000Z'
  }
]

const mockJobs: Job[] = [
  {
    id: 'demo-job-1',
    school_id: 'demo-school-1',
    title: 'Elementary Math Teacher',
    description: 'We are seeking a dedicated Elementary Math Teacher to join our team and inspire young minds in mathematics.',
    requirements: ['Bachelor\'s degree in Mathematics or Education', 'Valid teaching credential', '2+ years classroom experience', 'Strong communication skills'],
    location: 'Palo Alto, CA',
    salary_range: '$55,000 - $75,000',
    employment_type: 'full-time',
    subject: 'Mathematics',
    grade_level: 'Elementary (K-5)',
    posted_date: '2024-08-01',
    application_deadline: '2024-08-15',
    status: 'open',
    created_at: '2024-08-01T10:00:00.000Z',
    updated_at: '2024-08-01T10:00:00.000Z',
    school: mockProfiles[2] as Profile
  },
  {
    id: 'demo-job-2',
    school_id: 'demo-school-2',
    title: 'Middle School English Teacher',
    description: 'Join our dynamic team as a Middle School English Teacher and help students develop their love for literature and writing.',
    requirements: ['Bachelor\'s degree in English or Education', 'Teaching credential', 'Experience with middle school students', 'Creative teaching methods'],
    location: 'San Jose, CA',
    salary_range: '$58,000 - $78,000',
    employment_type: 'full-time',
    subject: 'English',
    grade_level: 'Middle School (6-8)',
    posted_date: '2024-08-03',
    application_deadline: '2024-08-20',
    status: 'open',
    created_at: '2024-08-03T14:30:00.000Z',
    updated_at: '2024-08-03T14:30:00.000Z',
    school: mockProfiles[3] as Profile
  }
]

const mockApplications: Application[] = []

// Mock storage with pre-populated demo users
const mockStorage = {
  profiles: new Map(mockProfiles.map(p => [p.id, p])),
  jobs: new Map(mockJobs.map(j => [j.id, j])),
  applications: new Map<string, Application>(),
  users: new Map(mockUsers.map(u => [u.id, u])) // Pre-populate with demo users
}

// Helper to generate IDs
const generateId = () => 'user-' + Math.random().toString(36).substr(2, 9)

// Database service functions
export const dbService = {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        return data
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    const profile = mockStorage.profiles.get(userId)
    if (!profile) {
      throw new Error('Profile not found')
    }
    return profile
  },

  async upsertProfile(profile: Partial<Profile>): Promise<Profile> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            ...profile,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    const updatedProfile = {
      ...profile,
      updated_at: new Date().toISOString()
    } as Profile
    
    mockStorage.profiles.set(updatedProfile.id, updatedProfile)
    return updatedProfile
  },

  async getTeachers(limit = 20): Promise<Profile[]> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'teacher')
          .limit(limit)
        
        if (error) throw error
        return data || []
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    return Array.from(mockStorage.profiles.values())
      .filter(p => p.user_type === 'teacher')
      .slice(0, limit)
  },

  async getSchools(limit = 20): Promise<Profile[]> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'school')
          .limit(limit)
        
        if (error) throw error
        return data || []
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    return Array.from(mockStorage.profiles.values())
      .filter(p => p.user_type === 'school')
      .slice(0, limit)
  },

  // Job operations
  async getJobs(limit = 20): Promise<Job[]> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            school:profiles!jobs_school_id_fkey(*)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        return data || []
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    return Array.from(mockStorage.jobs.values())
      .filter(j => j.status === 'open')
      .slice(0, limit)
  },

  async createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .insert({
            ...jobData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select(`
            *,
            school:profiles!jobs_school_id_fkey(*)
          `)
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    const newJob: Job = {
      ...jobData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      school: mockStorage.profiles.get(jobData.school_id)
    }
    
    mockStorage.jobs.set(newJob.id, newJob)
    return newJob
  },

  async getSchoolJobs(schoolId: string): Promise<Job[]> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            school:profiles!jobs_school_id_fkey(*)
          `)
          .eq('school_id', schoolId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return data || []
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    return Array.from(mockStorage.jobs.values())
      .filter(j => j.school_id === schoolId)
  },

  // Application operations
  async submitApplication(applicationData: Omit<Application, 'id' | 'submitted_at'>): Promise<Application> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .insert({
            ...applicationData,
            submitted_at: new Date().toISOString()
          })
          .select(`
            *,
            job:jobs(*),
            teacher:profiles!applications_teacher_id_fkey(*)
          `)
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    const newApplication: Application = {
      ...applicationData,
      id: generateId(),
      submitted_at: new Date().toISOString(),
      job: mockStorage.jobs.get(applicationData.job_id),
      teacher: mockStorage.profiles.get(applicationData.teacher_id)
    }
    
    mockStorage.applications.set(newApplication.id, newApplication)
    return newApplication
  },

  async getUserApplications(userId: string): Promise<Application[]> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            job:jobs(*),
            teacher:profiles!applications_teacher_id_fkey(*)
          `)
          .eq('teacher_id', userId)
          .order('submitted_at', { ascending: false })
        
        if (error) throw error
        return data || []
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    return Array.from(mockStorage.applications.values())
      .filter(a => a.teacher_id === userId)
  },

  async getSchoolApplications(schoolId: string): Promise<Application[]> {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            job:jobs!inner(*),
            teacher:profiles!applications_teacher_id_fkey(*)
          `)
          .eq('job.school_id', schoolId)
          .order('submitted_at', { ascending: false })
        
        if (error) throw error
        return data || []
      } catch (error) {
        console.log('🔧 Supabase query failed, using mock data:', error)
      }
    }
    
    // Mock implementation
    return Array.from(mockStorage.applications.values())
      .filter(a => {
        const job = mockStorage.jobs.get(a.job_id)
        return job?.school_id === schoolId
      })
  },

  // File upload
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    if (supabase && hasRealCredentials) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}.${fileExt}`
        const filePath = `profile-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath)

        return data.publicUrl
      } catch (error) {
        console.log('🔧 Supabase storage failed, using mock URL:', error)
      }
    }
    
    // Mock implementation - return a placeholder image URL
    return `https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&t=${Date.now()}`
  },

  async uploadSchoolLogo(schoolId: string, file: File): Promise<string> {
    if (supabase && hasRealCredentials) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${schoolId}.${fileExt}`
        const filePath = `school-logos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('school-logos')
          .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('school-logos')
          .getPublicUrl(filePath)

        return data.publicUrl
      } catch (error) {
        console.log('🔧 Supabase storage failed, using mock URL:', error)
      }
    }
    
    // Mock implementation - return a placeholder logo URL
    return `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop&t=${Date.now()}`
  }
}

// Auth helper functions
export const authService = {
  async signUp(email: string, password: string, userData: any) {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: userData.firstName,
              last_name: userData.lastName,
              user_type: userData.userType
            }
          }
        })

        if (error) throw error

        // Create profile after successful signup
        if (data.user) {
          await dbService.upsertProfile({
            id: data.user.id,
            email: data.user.email!,
            first_name: userData.firstName,
            last_name: userData.lastName,
            user_type: userData.userType,
            phone: userData.phone || null,
            school_name: userData.schoolName || null,
            availability: userData.userType === 'teacher' ? 'available' : 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }

        return data
      } catch (error) {
        console.log('🔧 Supabase auth failed, using mock auth:', error)
        throw error // Re-throw in production mode so errors are visible
      }
    }
    
    // Mock implementation
    const userId = generateId()
    const user = {
      id: userId,
      email,
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_type: userData.userType
      },
      created_at: new Date().toISOString()
    }
    
    // Store mock user
    mockStorage.users.set(userId, user)
    
    // Create profile
    const profile: Profile = {
      id: userId,
      email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_type: userData.userType,
      phone: userData.phone || null,
      school_name: userData.schoolName || null,
      availability: userData.userType === 'teacher' ? 'available' : 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockStorage.profiles.set(userId, profile)
    
    return {
      user,
      session: {
        access_token: `mock-token-${userId}`,
        refresh_token: 'mock-refresh-token',
        user
      }
    }
  },

  async signIn(email: string, password: string) {
    if (supabase && hasRealCredentials) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error
        return data
      } catch (error) {
        console.log('🔧 Supabase auth failed, using mock auth:', error)
        throw error // Re-throw in production mode so errors are visible
      }
    }
    
    // Mock implementation - find user by email
    const user = Array.from(mockStorage.users.values()).find(u => u.email === email)
    if (!user) {
      // Check if this is a new email that should be guided to signup
      throw new Error(`No account found with email "${email}". Please sign up first or try a demo account.`)
    }
    
    // In mock mode, any password works for demo accounts
    console.log(`✅ Demo login successful for ${email}`)
    
    return {
      user,
      session: {
        access_token: `mock-token-${user.id}`,
        refresh_token: 'mock-refresh-token',
        user
      }
    }
  },

  async signOut() {
    if (supabase && hasRealCredentials) {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return
      } catch (error) {
        console.log('🔧 Supabase signout failed, clearing mock session:', error)
      }
    }
    
    // Mock implementation - nothing to do for mock signout
    console.log('✅ Mock signout successful')
  },

  async getCurrentUser() {
    if (supabase && hasRealCredentials) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        return user
      } catch (error) {
        console.log('🔧 Supabase auth failed, no current user:', error)
      }
    }
    
    // Mock implementation - no persistent session in mock mode
    return null
  },

  async getSession() {
    if (supabase && hasRealCredentials) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        return session
      } catch (error) {
        console.log('🔧 Supabase auth failed, no session:', error)
      }
    }
    
    // Mock implementation - no persistent session in mock mode
    return null
  }
}

// Export the actual Supabase client for advanced usage (will be null if not configured)
export { supabase, hasRealCredentials }

// Connection status helper
export const getConnectionStatus = () => {
  return {
    hasRealCredentials,
    isConnected: supabase !== null,
    mode: hasRealCredentials ? 'supabase' : 'mock',
    url: hasRealCredentials ? supabaseUrl : 'mock-mode'
  }
}

// Get demo accounts for easy access
export const getDemoAccounts = () => {
  return mockUsers.map(user => ({
    email: user.email,
    userType: user.user_metadata.user_type,
    name: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
  }))
}

// Setup instructions
export const showSetupInstructions = () => {
  console.group('🔧 WondasTeach Supabase Setup')
  console.log('Currently running in mock mode. To connect to Supabase:')
  console.log('')
  console.log('OPTION 1: Direct replacement in /utils/supabase.ts')
  console.log('  Replace these lines:')
  console.log('  const supabaseUrl = "https://your-project-id.supabase.co"')
  console.log('  const supabaseAnonKey = "your-anon-key-here"')
  console.log('')
  console.log('OPTION 2: Environment variables (recommended)')
  console.log('  Set these environment variables:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  console.log('')
  console.log('STEPS:')
  console.log('1. Create a Supabase project at https://supabase.com')
  console.log('2. Get your project URL and anon key from Settings > API')
  console.log('3. Run the SQL schema from /supabase/schema.sql')
  console.log('4. Update credentials using one of the options above')
  console.log('5. Restart the application')
  console.log('')
  console.log('📝 Demo Accounts (password: any text in mock mode):')
  getDemoAccounts().forEach(account => {
    console.log(`   ${account.userType.toUpperCase()}: ${account.email} (${account.name})`)
  })
  console.groupEnd()
}

// Initialize and show status
if (!hasRealCredentials) {
  showSetupInstructions()
}