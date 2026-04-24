import { createClient } from '@supabase/supabase-js';

// 1. Hardcode your public keys safely to bypass Windows/OneDrive file locks
const SUPABASE_URL = 'https://cbpaqkhntdpmwlzlemgp.supabase.co'; // <--- Paste URL here
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicGFxa2hudGRwbXdsemxlbWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTgyMDQsImV4cCI6MjA5MjQzNDIwNH0.Q8b-SUJ02cQ15C7bQupyBNGYtkChhnfSojkaI_QO50A';   // <--- Paste Key here

// 2. Keep the proxy logic for the client side to outsmart ISP blocks
const supabaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/supabase-proxy`
  : SUPABASE_URL;

// 3. Initialize the client
export const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY);