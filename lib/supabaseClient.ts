// Cliente Supabase para o Frontend
import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente - usar VITE_ para Vite/React
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis do Supabase não configuradas no frontend.');
  console.warn('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Netlify');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

