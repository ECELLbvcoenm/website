import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// You MUST have 'export' here so other files can see it
export const supabase = createClient(supabaseUrl, supabaseAnonKey)