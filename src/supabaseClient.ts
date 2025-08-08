// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgnpkgvbemknittbbfzd.supabase.co' // Paste your URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbnBrZ3ZiZW1rbml0dGJiZnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTUwMTcsImV4cCI6MjA3MDIzMTAxN30.6JDvc5c2n-1crUVG5CDdLNh7y2-5DeBKhHQ9fCShBj8' // Paste your anon key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey)