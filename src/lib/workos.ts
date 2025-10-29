import { WorkOS } from '@workos-inc/node';

// Initialize WorkOS client
const workos = new WorkOS(process.env.WORKOS_API_KEY);

export interface WorkOSUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOSSession {
  id: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  createdAt: string;
  expiresAt: string;
}

class WorkOSAuthService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.WORKOS_CLIENT_ID!;
    this.redirectUri = process.env.WORKOS_REDIRECT_URI!;
  }

  /**
   * Generate authorization URL for SSO
   */
  getAuthorizationUrl(provider?: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });

    if (provider) {
      params.append('provider', provider);
    }

    if (state) {
      params.append('state', state);
    }

    return `https://api.workos.com/sso/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for user info
   */
  async exchangeCodeForUser(code: string): Promise<WorkOSUser> {
    try {
      const { user } = await workos.sso.getProfileAndToken({
        code,
        clientId: this.clientId,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error exchanging code for user:', error);
      throw new Error('Failed to authenticate user');
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<WorkOSUser | null> {
    try {
      const user = await workos.userManagement.getUser(userId);
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Create a magic link for passwordless authentication
   */
  async createMagicLink(email: string, redirectUri?: string): Promise<string> {
    try {
      const magicLink = await workos.passwordless.createSession({
        email,
        type: 'MagicLink',
        redirectUri: redirectUri || this.redirectUri,
      });

      return magicLink.link;
    } catch (error) {
      console.error('Error creating magic link:', error);
      throw new Error('Failed to create magic link');
    }
  }

  /**
   * Verify magic link token
   */
  async verifyMagicLinkToken(token: string): Promise<WorkOSUser> {
    try {
      const session = await workos.passwordless.verifySession({
        token,
        type: 'MagicLink',
      });

      return {
        id: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        profilePictureUrl: session.profilePictureUrl,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    } catch (error) {
      console.error('Error verifying magic link:', error);
      throw new Error('Failed to verify magic link');
    }
  }

  /**
   * Get available SSO providers
   */
  async getSSOProviders(): Promise<any[]> {
    try {
      const providers = await workos.sso.listConnections({
        domain: 'example.com', // You might want to make this configurable
      });

      return providers.data;
    } catch (error) {
      console.error('Error getting SSO providers:', error);
      return [];
    }
  }
}

export const workOSAuthService = new WorkOSAuthService();
