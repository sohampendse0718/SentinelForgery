import { createClient } from '@supabase/supabase-js'

// 1. Determine the environment to outsmart the DNS block
const supabaseUrl = typeof window !== 'undefined' 
  ? `${window.location.origin}/supabase-proxy` // Client-side browser uses the proxy
  : process.env.NEXT_PUBLIC_SUPABASE_URL!;     // Server-side (Vercel) goes direct

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. Initialize the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)