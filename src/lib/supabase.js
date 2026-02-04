import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fxwszwhfhxeaorgmyfmj.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_OhLI4EKG_2sldJVHZDmT1Q__BOd9unl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Case helpers
export const saveCase = async (userId, taskType, formData, status = 'draft') => {
  const { data, error } = await supabase
    .from('cases')
    .insert([{ user_id: userId, task_type: taskType, form_data: formData, status }])
    .select();
  return { data, error };
};

export const getUserCases = async (userId) => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateCase = async (caseId, updates) => {
  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', caseId)
    .select();
  return { data, error };
};
