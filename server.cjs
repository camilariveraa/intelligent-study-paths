const express = require('express');
const { WorkOS } = require('@workos-inc/node');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load environment variables
require('dotenv').config();

// Check for required environment variables
if (!process.env.WORKOS_API_KEY) {
  console.error('WORKOS_API_KEY environment variable is required');
  process.exit(1);
}
if (!process.env.WORKOS_CLIENT_ID) {
  console.error('WORKOS_CLIENT_ID environment variable is required');
  process.exit(1);
}
if (!process.env.WORKOS_REDIRECT_URI) {
  process.env.WORKOS_REDIRECT_URI = 'http://localhost:8087/auth/callback';
}
if (!process.env.NEXT_PUBLIC_APP_URL) {
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:8087';
}

const app = express();
const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Middleware
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8087',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Login endpoint - redirects to AuthKit
app.get('/login', async (req, res) => {
  try {
    const authUrl = workos.userManagement.getAuthorizationUrl({
      clientId: process.env.WORKOS_CLIENT_ID,
      redirectUri: process.env.WORKOS_REDIRECT_URI,
      provider: 'AuthKit',
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

// AuthKit callback endpoint - handles AuthKit callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?message=No authorization code`);
  }

  try {
    // Exchange code for user
    const { user } = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID,
      code: code,
    });

    // Create session cookie
    const sessionData = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.cookie('authkit-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (error) {
    console.error('Error exchanging code for user:', error);
    res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?message=Authentication failed`);
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  try {
    const sessionCookie = req.cookies['authkit-session'];
    
    if (!sessionCookie) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = JSON.parse(sessionCookie);
    res.json(user);
  } catch (error) {
    console.error('Error getting user session:', error);
    res.status(500).json({ error: 'Failed to get user session' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  try {
    res.clearCookie('authkit-session');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AuthKit server running on port ${PORT}`);
});
