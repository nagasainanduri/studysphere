/**
 * Authentication module for StudySphere.
 * Handles Internet Identity authentication using @dfinity/auth-client.
 */
import { AuthClient } from '@dfinity/auth-client';

/**
 * Initialize authentication client and check if user is authenticated.
 * @returns {Promise<{principal: Principal|null, isAuthenticated: boolean}>} Authentication state.
 */
export const initAuth = async () => {
  try {
    console.log('Initializing AuthClient');
    const client = await AuthClient.create();
    const isAuthenticated = await client.isAuthenticated();
    console.log('isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('No authenticated user found');
      return { principal: null, isAuthenticated: false };
    }
    const identity = client.getIdentity();
    if (!identity || typeof identity.getPrincipal !== 'function') {
      console.log('Invalid identity object');
      return { principal: null, isAuthenticated: false };
    }
    const principal = identity.getPrincipal();
    console.log('Principal found:', principal.toString());
    return { principal, isAuthenticated: true };
  } catch (err) {
    console.error('Auth initialization error:', err.message, err.stack);
    return { principal: null, isAuthenticated: false };
  }
};

/**
 * Log in using Internet Identity.
 * @returns {Promise<{principal: Principal|null, isAuthenticated: boolean}>} Updated authentication state.
 */
export const login = async () => {
  try {
    console.log('Creating AuthClient for login');
    const client = await AuthClient.create();
    return new Promise((resolve, reject) => {
      client.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          console.log('Login successful');
          const identity = client.getIdentity();
          if (!identity || typeof identity.getPrincipal !== 'function') {
            console.error('Invalid identity object after login');
            reject(new Error('Invalid identity object'));
            return;
          }
          const principal = identity.getPrincipal();
          console.log('Principal after login:', principal.toString());
          resolve({ principal, isAuthenticated: true });
        },
        onError: (err) => {
          console.error('Login error:', err.message, err.stack);
          reject(err);
        }
      });
    });
  } catch (err) {
    console.error('Login attempt error:', err.message, err.stack);
    return { principal: null, isAuthenticated: false };
  }
};

/**
 * Log out the current user.
 */
export const logout = async () => {
  try {
    console.log('Logging out');
    const client = await AuthClient.create();
    await client.logout();
    console.log('Logout successful');
  } catch (err) {
    console.error('Logout error:', err.message, err.stack);
  }
};