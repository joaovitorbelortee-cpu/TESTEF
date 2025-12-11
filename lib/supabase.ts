import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco
export type Account = {
    id: string;
    email: string;
    password: string;
    plan: 'ultimate' | 'pc' | 'console';
    status: 'available' | 'sold' | 'pending-renewal' | 'expired';
    purchase_date: string;
    renewal_date?: string;
    sold_date?: string;
    price: number;
    client_id?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
};

export type Client = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    tag?: string;
    cpf?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
};
