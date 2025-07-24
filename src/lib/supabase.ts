import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ifhwovsxekbjahqwusix.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaHdvdnN4ZWtiamFocXd1c2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzU0MDUsImV4cCI6MjA2ODgxMTQwNX0.1o4SVPTPvQNvELQJWiz-MM9W8TPbluygwyZaewl3bhQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types - matching our app schema
export type Database = {
  app: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'user' | 'admin' | 'super_admin'
          organization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          plan: 'free' | 'pro' | 'enterprise'
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: 'free' | 'pro' | 'enterprise'
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: 'free' | 'pro' | 'enterprise'
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      facebook_tokens: {
        Row: {
          id: string
          user_id: string
          account_id: string
          account_name: string
          access_token: string
          refresh_token: string | null
          expires_at: string
          permissions: string[] | null
          currency: string | null
          timezone: string | null
          business_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          account_name: string
          access_token: string
          refresh_token?: string | null
          expires_at: string
          permissions?: string[] | null
          currency?: string | null
          timezone?: string | null
          business_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          account_name?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string
          permissions?: string[] | null
          currency?: string | null
          timezone?: string | null
          business_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Auth helper functions
export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, options?: { 
    data?: { 
      first_name?: string 
      last_name?: string 
    } 
  }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options
    })
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  // Sign out user
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Get current user
  getUser: async () => {
    return await supabase.auth.getUser()
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession()
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Get user profile from app.users
  getUserProfile: async (userId: string) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
  },

  // Create or update user profile
  upsertUserProfile: async (user: Database['app']['Tables']['users']['Insert']) => {
    return await supabase
      .from('users')
      .upsert(user)
  },

  // Get user's organization
  getUserOrganization: async (orgId: string) => {
    return await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single()
  }
}

export default supabase