import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://[tpxsdsplkathmiaoercg].supabase.co'
const supabaseAnonKey = '[eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweHNkc3Bsa2F0aG1pYW9lcmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTExMDgsImV4cCI6MjA2ODYyNzEwOH0.xo6dAej3SgBG2Md0pMhmZ2MiZySqNgtlTXgIR9fAPkY]'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
