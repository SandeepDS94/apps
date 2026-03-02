
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        const { data, error } = await supabase.from('quizzes').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Connection error:', error);
        } else {
            console.log('Connection successful!');
        }
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}

testConnection();
