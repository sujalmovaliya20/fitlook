import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Check if user has a shop profile
      const adminSupabase = createAdminClient();
      const { data: shop } = await adminSupabase
        .from('shops')
        .select('id')
        .eq('id', session.user.id)
        .single();
        
      if (!shop) {
        // Create an empty shop profile for OAuth user
        await adminSupabase.from('shops').insert({
          id: session.user.id,
          shop_name: session.user.user_metadata?.full_name ? `${session.user.user_metadata.full_name}'s Atelier` : 'My Atelier',
          owner_name: session.user.user_metadata?.full_name || 'Tailor',
          email: session.user.email || '',
        });
        
        // Redirect them to profile to fill in missing details like city
        return NextResponse.redirect(`${origin}/dashboard/profile`);
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
}
