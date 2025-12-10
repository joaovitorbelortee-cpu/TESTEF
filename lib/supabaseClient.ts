// Cliente Supabase para o Frontend
import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente - usar VITE_ para Vite/React
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log para debug (apenas em produção para verificar se variáveis estão sendo lidas)
if (typeof window !== 'undefined' && !import.meta.env.DEV) {
  console.log('🔧 Supabase URL configurada:', supabaseUrl ? 'Sim' : 'Não');
  console.log('🔧 Supabase Key configurada:', supabaseAnonKey ? 'Sim' : 'Não');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não configuradas no frontend.');
  console.error('Configure no Netlify:');
  console.error('  VITE_SUPABASE_URL = https://cpzxslaufhomqxksyrwt.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY = sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

