const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://luixtkjdchxeesilbqsh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aXh0a2pkY2h4ZWVzaWxicXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NTQ3OTUsImV4cCI6MjA3ODUzMDc5NX0.GB4hCB3Oygp-UmLm8aY1eBkhfULrSeLaRoNLvMzrqOM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        // Try to fetch something public or just check if client initializes without error
        // Since we might not have tables yet, we'll just check if we can make a request.
        // Accessing a non-existent table usually returns a 404 or specific error, but proves connectivity.
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.log('Connection established (Error expected if tables missing):', error.message);
        } else {
            console.log('Connection successful!');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
