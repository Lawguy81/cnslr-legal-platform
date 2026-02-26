import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fxwszwhfhxeaorgmyfmj.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_OhLI4EKG_2sldJVHZDmT1Q__BOd9unl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
