/**
 * Authentication module for StudySphere.
 * Handles Internet Identity authentication using @dfinity/auth-client.
 */
import { AuthClient } from '@dfinity/auth-client';
import type { Principal } from '@dfinity/principal';

export interface AuthState {
  principal: Principal | null;
  isAuthenticated: boolean;
}

/**
 * Initialize authentication client and check if user is authenticated.
 * @returns {Promise<AuthState>} Authentication state.
 */
export const initAuth = async (): Promise<AuthState> => {
  try {
    const client = await AuthClient.create();
    const isAuthenticated = await client.isAuthenticated();
    if (!isAuthenticated) {
      return { principal: null, isAuthenticated: false };
    }
    const identity = client.getIdentity();
    if (!identity || typeof identity.getPrincipal !== 'function') {
      return { principal: null, isAuthenticated: false };
    }
    const principal: Principal = identity.getPrincipal();
    return { principal, isAuthenticated: true };
  } catch (err) {
    return { principal: null, isAuthenticated: false };
  }
};

/**
 * Log in using Internet Identity.
 * @returns {Promise<AuthState>} Update authentication state.
 */
export const login = async (): Promise<AuthState> => {
  try {
    const client = await AuthClient.create();
    return new Promise<AuthState>((resolve, reject) => {
      client.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          const identity = client.getIdentity();
          if (!identity || typeof identity.getPrincipal !== 'function') {
            reject(new Error('Invalid identity object'));
            return;
          }
          const principal: Principal = identity.getPrincipal();
          resolve({ principal, isAuthenticated: true });
        },
        onError: (err: any) => {
          reject(err);
        }
      });
    });
  } catch (err) {
    return { principal: null, isAuthenticated: false };
  }
};

/**
 * Log out the current user.
 */
export const logout = async (): Promise<void> => {
  try {
    const client = await AuthClient.create();
    await client.logout();
  } catch (err) {
    // Ignore errors on logout
  }
};
