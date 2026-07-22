import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const SUPABASE_URL = 'https://lgtqgcryodmbneykcwxz.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndHFnY3J5b2RtYm5leWtjd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODQwNzEsImV4cCI6MjEwMDI2MDA3MX0.LNskFKBmkW9T85cYsVSxEVMCfRRHZBUe0DGzf5SxDvw'

const isSSR = typeof window === 'undefined'

const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: isSSR ? noopStorage : AsyncStorage,
    autoRefreshToken: !isSSR,
    persistSession: !isSSR,
    detectSessionInUrl: !isSSR && Platform.OS === 'web',
  },
})
