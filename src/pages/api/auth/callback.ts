import { workOSAuthService } from '@/lib/workos';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/callback - Handle WorkOS callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('WorkOS auth error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error?message=No authorization code', request.url));
  }

  try {
    const user = await workOSAuthService.exchangeCodeForUser(code);
    
    // Create session cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Set session cookie (in production, use secure cookies)
    response.cookies.set('workos-session', JSON.stringify({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error exchanging code for user:', error);
    return NextResponse.redirect(new URL('/auth/error?message=Authentication failed', request.url));
  }
}
