import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - Logout user
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear session cookie
    response.cookies.set('workos-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
