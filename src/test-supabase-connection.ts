// Test Supabase Connection
import { supabase } from './lib/supabase';

export async function testSupabaseConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase
      .from('organizations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check auth service
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth service error:', authError);
      return false;
    }
    
    console.log('✅ Auth service working, current session:', session ? 'Active' : 'None');
    
    // Test 3: Test real-time capabilities
    const channel = supabase
      .channel('test-connection')
      .on('postgres_changes', 
        { event: '*', schema: 'app', table: 'users' }, 
        (payload) => console.log('🔄 Real-time update:', payload)
      )
      .subscribe((status) => {
        console.log('📡 Real-time status:', status);
      });
    
    // Clean up after 2 seconds
    setTimeout(() => {
      supabase.removeChannel(channel);
      console.log('✅ Real-time test completed');
    }, 2000);
    
    return true;
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Run test if in development
if (import.meta.env.DEV) {
  testSupabaseConnection();
}