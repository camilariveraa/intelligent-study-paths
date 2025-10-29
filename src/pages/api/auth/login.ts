import { workOSAuthService } from '@/lib/workos';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/login - Redirect to WorkOS SSO
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  
  try {
    const authUrl = workOSAuthService.getAuthorizationUrl(provider || undefined);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}
