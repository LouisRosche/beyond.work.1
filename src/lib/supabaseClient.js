import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch {
  throw new Error('VITE_SUPABASE_URL is not a valid URL')
}

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'mission-stl-dashboard'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to handle Supabase errors consistently
export function handleSupabaseError(error, context = '') {
  console.error(`Supabase error ${context}:`, error)

  // User-friendly error messages
  const errorMessages = {
    '23505': 'This record already exists',
    '23503': 'Cannot delete: this item is being used elsewhere',
    '42501': 'You do not have permission to perform this action',
    'PGRST116': 'No data found',
    'PGRST301': 'Database connection failed'
  }

  const code = error?.code || error?.message
  return errorMessages[code] || error?.message || 'An unexpected error occurred'
}

// Connection health check
export async function checkConnection() {
  try {
    const { error } = await supabase.from('sites').select('count', { count: 'exact', head: true })
    return !error
  } catch {
    return false
  }
}
