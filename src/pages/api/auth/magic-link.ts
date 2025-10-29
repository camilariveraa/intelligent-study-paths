import { workOSAuthService } from '@/lib/workos';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/magic-link - Send magic link
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const magicLink = await workOSAuthService.createMagicLink(email);
    
    // In a real application, you would send this link via email
    // For now, we'll just return it (remove this in production)
    console.log('Magic link for', email, ':', magicLink);
    
    return NextResponse.json({ 
      message: 'Magic link sent to your email',
      // Remove this in production - only for development
      magicLink: process.env.NODE_ENV === 'development' ? magicLink : undefined
    });
  } catch (error) {
    console.error('Error creating magic link:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}
