import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xaddlctkbrdeigeqfswd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTYxMzgsImV4cCI6MjA2NDIzMjEzOH0.tgbrIR38y92c8tQAwvJeIbIORozOT4GtagJ2-0BNLPM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDemoCredentials() {
    console.log('🔑 Testing Demo Credentials...\n');
    
    const commonPasswords = [
        'demo123',
        'leafiq123', 
        'password123',
        'demo',
        'leafiq',
        'password',
        'admin123',
        'test123',
        '123456',
        'Demo123!',
        'LeafIQ123!',
        'demo1234',
        'leafiq1234'
    ];
    
    for (const password of commonPasswords) {
        console.log(`Trying: demo@leafiq.online / ${password}`);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'demo@leafiq.online',
                password: password
            });
            
            if (!error && data.user) {
                console.log('✅ SUCCESS! Found working credentials:');
                console.log(`   Email: demo@leafiq.online`);
                console.log(`   Password: ${password}`);
                console.log(`   User ID: ${data.user.id}`);
                
                await supabase.auth.signOut();
                return { email: 'demo@leafiq.online', password };
            }
            
        } catch (err) {
            console.log(`   ❌ Failed: ${err.message || 'Unknown error'}`);
        }
    }
    
    console.log('\n❌ No working password found. Creating new demo user...');
    
    // Create new demo user
    try {
        const { data, error } = await supabase.auth.signUp({
            email: 'demo@leafiq.online',
            password: 'demo123',
            options: {
                data: {
                    role: 'admin',
                    organization_name: 'Demo Dispensary'
                }
            }
        });
        
        if (error) {
            if (error.message.includes('already registered')) {
                console.log('✅ User exists, but password unknown. Manual reset needed.');
                return { email: 'demo@leafiq.online', password: 'demo123', note: 'Password reset needed' };
            } else {
                console.error('❌ Signup error:', error.message);
                return null;
            }
        }
        
        console.log('✅ New demo user created:');
        console.log('   Email: demo@leafiq.online');
        console.log('   Password: demo123');
        console.log('   User ID:', data.user?.id);
        
        return { email: 'demo@leafiq.online', password: 'demo123' };
        
    } catch (err) {
        console.error('❌ Error creating user:', err);
        return null;
    }
}

testDemoCredentials().then((result) => {
    if (result) {
        console.log('\n🎉 Demo credentials ready:');
        console.log(`   ${result.email} / ${result.password}`);
        if (result.note) {
            console.log(`   Note: ${result.note}`);
        }
    } else {
        console.log('\n❌ Could not establish demo credentials');
    }
    process.exit(0);
}).catch(console.error); 