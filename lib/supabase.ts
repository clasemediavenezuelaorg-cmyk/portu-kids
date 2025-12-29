
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const saveProgress = async (stars: number, completedLessons: string[]) => {
  if (!supabase) return;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id, 
      stars, 
      completed_lessons: completedLessons,
      updated_at: new Date().toISOString()
    });

  if (error) console.error('Error saving progress:', error);
};

export const loadProgress = async () => {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('stars, completed_lessons')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error loading progress:', error);
    return null;
  }
  return data;
};
