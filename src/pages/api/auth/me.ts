import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('workos-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json({ error: 'Failed to get user session' }, { status: 500 });
  }
}
