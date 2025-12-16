// Configuração do Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://cpzxslaufhomqxksyrwt.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwenhzbGF1ZmhvbXF4a3N5cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzQwNTUsImV4cCI6MjA4MDkxMDA1NX0.TDFb2CTXl6rocaRUbCNplaQ1d_zRrMmqhfQ1ncAiYmk';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Variáveis do Supabase não configuradas. Usando banco JSON local.');
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;


