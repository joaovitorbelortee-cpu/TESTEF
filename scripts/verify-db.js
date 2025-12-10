
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv to read from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Ensure .env.local exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
    console.log('🔍 Verifying Supabase Tables...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    const tables = ['accounts', 'clients', 'sales'];
    let allExist = true;

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });

        if (error) {
            console.error(`❌ Table '${table}' check failed:`, error.message);
            if (error.code === '42P01') {
                console.error(`   -> The table '${table}' does not exist.`);
            }
            allExist = false;
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }

    if (allExist) {
        console.log('\n✨ All required tables exist! The database appears compatible.');
    } else {
        console.error('\n⚠️ Some tables are missing. Please run the SETUP_DB.sql script in your Supabase SQL Editor.');
        console.log('   File location: ./SETUP_DB.sql');
    }
}

verifyTables();
