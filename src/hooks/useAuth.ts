/**
 * SSO-001: Auth Hook with Cookie Validation
 *
 * React hook for Aadharcha.in wallet-based SSO:
 * - Manages user state from SSO session
 * - Fetches user from /api/auth/me with credentials: include
 * - login() redirects to aadharcha.in/login
 * - logout() calls aadharcha.in/api/auth/logout
 * - isAuthenticated boolean flag
 *
 * Usage:
 * ```tsx
 * const { user, isAuthenticated, loading, login, logout } = useAuth();
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import type { SSOUser } from '../lib/api';
import {
  validateSession,
  getCurrentUser,
  logout as apiLogout,
  redirectToLogin,
  isAuthenticated as checkIsAuthenticated,
  getCurrentWalletAddress,
  recordAppAccess,
} from '../lib/api';

export interface UseAuthResult {
  /** Current authenticated user (null if not logged in) */
  user: SSOUser | null;
  /** Is authentication state loading */
  loading: boolean;
  /** Is user currently authenticated */
  isAuthenticated: boolean;
  /** Redirect to SSO login page */
  login: (returnPath?: string) => void;
  /** Logout from SSO and redirect to home */
  logout: () => void;
  /** Refresh user session from SSO */
  refresh: () => Promise<void>;
  /** Get current wallet address */
  walletAddress: string | null;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<SSOUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth state on mount
   * Validates existing SSO session cookie
   */
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      // First try non-blocking validation
      const session = await validateSession();

      if (session.valid && session.user) {
        setUser(session.user);

        // Record app access for SSO analytics
        await recordAppAccess('ondc_buyer');
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Redirect to SSO login page
   * @param returnPath - Optional path to return to after login
   */
  const login = useCallback((returnPath?: string) => {
    redirectToLogin(returnPath);
  }, []);

  /**
   * Logout from SSO
   * Calls /api/auth/logout and redirects to home
   */
  const logout = useCallback(() => {
    setUser(null);
    void apiLogout();
  }, []);

  /**
   * Refresh user session from SSO
   * Useful after actions that might change user state
   */
  const refresh = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Session invalid or expired
      setUser(null);
    }
  }, []);

  const isAuthenticated = checkIsAuthenticated();
  const walletAddress = getCurrentWalletAddress();

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refresh,
    walletAddress,
  };
}

/**
 * Hook that redirects to login if not authenticated
 * Use this for pages that require authentication
 */
export function useRequireAuth(): UseAuthResult {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Not authenticated, redirect to login
      auth.login();
    }
  }, [auth.loading, auth.isAuthenticated, auth]);

  return auth;
}
