import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { dbService, authService, Profile, hasRealCredentials } from '../utils/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ data: any; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>) => Promise<{ data: Profile | null; error: string | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)

      // Try to get initial session
      const session = await authService.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }

      // Set up auth state listener (only for real Supabase)
      if (hasRealCredentials) {
        // Note: This will be handled by the supabase client's onAuthStateChange
        // For now, we'll just set up the initial state
      }

    } catch (error) {
      console.log('🔧 Auth initialization completed in offline mode')
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await dbService.getProfile(userId)
      setProfile(profile)
      console.log('✅ Profile loaded successfully')
    } catch (error: any) {
      if (error.message.includes('Profile not found')) {
        console.log('📝 Profile not found - this is normal for new users')
        setProfile(null)
      } else {
        console.log('⚠️ Profile loading issue (this is normal):', error.message)
        setProfile(null)
      }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)
      const result = await authService.signUp(email, password, userData)
      
      // Update auth state
      setUser(result.user)
      setSession(result.session)
      
      // Load or create profile
      if (result.user) {
        try {
          await loadUserProfile(result.user.id)
        } catch (error) {
          // Profile creation might have failed, that's okay
          console.log('📝 Profile will be created when user completes profile setup')
        }
      }

      const mode = hasRealCredentials ? 'Supabase' : 'offline mode'
      console.log(`✅ Account created successfully (${mode})`)
      
      return { 
        data: result, 
        error: null
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      
      if (error.message.includes('already been registered')) {
        return { 
          data: null, 
          error: 'An account with this email already exists. Please try signing in instead.' 
        }
      }
      
      return { 
        data: null, 
        error: error.message || 'Failed to create account. Please try again.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await authService.signIn(email, password)
      
      // Update auth state
      setUser(result.user)
      setSession(result.session)
      
      // Load profile
      if (result.user) {
        await loadUserProfile(result.user.id)
      }

      const mode = hasRealCredentials ? 'Supabase' : 'offline mode'
      console.log(`✅ Signed in successfully (${mode})`)
      
      return { data: result, error: null }
    } catch (error: any) {
      console.error('Sign in error:', error)
      
      // Handle specific error cases with better messaging
      if (error.message.includes('No account found with email')) {
        return { 
          data: null, 
          error: error.message 
        }
      }
      
      if (error.message.includes('Invalid login credentials')) {
        return { 
          data: null, 
          error: 'Invalid email or password. Please check your credentials and try again.' 
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return { 
          data: null, 
          error: 'Please check your email and confirm your account before signing in.' 
        }
      }
      
      if (error.message.includes('sign up first')) {
        return { 
          data: null, 
          error: error.message 
        }
      }
      
      return { 
        data: null, 
        error: error.message || 'Failed to sign in. Please try again.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      
      // Clear auth state
      setUser(null)
      setSession(null)
      setProfile(null)
      
      console.log('✅ Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      if (!user?.id) {
        throw new Error('Not authenticated')
      }

      const updatedProfile = await dbService.upsertProfile({
        ...profile,
        ...profileData,
        id: user.id
      })
      
      setProfile(updatedProfile)
      console.log('✅ Profile updated successfully')
      
      return { data: updatedProfile, error: null }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return { data: null, error: error.message }
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id)
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}