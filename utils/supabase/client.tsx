// This file has been deprecated and replaced by /utils/supabase.ts
// All imports should now use the new simplified Supabase integration

import { dbService } from '../supabase'

// Legacy compatibility exports (deprecated)
export const supabase = null
export const api = {
  // Redirect to new service
  ...dbService
}

// Show deprecation warning only once
if (!sessionStorage.getItem('client-deprecation-warning-shown')) {
  console.warn('⚠️  DEPRECATED: /utils/supabase/client.tsx has been replaced by /utils/supabase.ts')
  console.log('🔄 Please update your imports to use the new Supabase integration')
  sessionStorage.setItem('client-deprecation-warning-shown', 'true')
}