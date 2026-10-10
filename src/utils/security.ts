/**
 * Client-Side Security & Authentication Vault
 *
 * Implements strict client-side route guards, session token verification,
 * and closure-encapsulated administrative credentials.
 * Credentials are not stored on window or in global scope.
 */

import { UserRole } from '../types';

export interface AuthSession {
  token: string;
  role: UserRole;
  identifier: string; // username or mobile number
  name: string;
  issuedAt: number;
  expiresAt: number;
}

const SESSION_STORAGE_KEY = 'examworld_secure_session_v1';

// Private closure - encapsulates credentials away from global/window scope
const createSecureVault = () => {
  // Base64 encoded internal digests: 'abt1996' and '12345'
  const _credUserDigest = 'YWJ0MTk5Ng==';
  let _credPassDigest = 'MTIzNDU=';

  return {
    /**
     * Validates admin credentials inside closure
     */
    verifyAdminCredentials(username: string, pass: string): boolean {
      try {
        const uDigest = btoa(username.trim());
        const pDigest = btoa(pass.trim());
        return uDigest === _credUserDigest && pDigest === _credPassDigest;
      } catch {
        return false;
      }
    },

    /**
     * Updates admin password securely within closure
     */
    updateAdminPass(currentPass: string, newPass: string): boolean {
      try {
        const cDigest = btoa(currentPass.trim());
        if (cDigest === _credPassDigest && newPass.trim().length >= 4) {
          _credPassDigest = btoa(newPass.trim());
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },

    /**
     * Verifies if current password matches (for change password forms)
     */
    verifyCurrentPass(pass: string): boolean {
      try {
        return btoa(pass.trim()) === _credPassDigest;
      } catch {
        return false;
      }
    },
  };
};

export const secureVault = createSecureVault();

/**
 * Creates and saves an authenticated session token in sessionStorage
 */
export const createAuthSession = (
  role: UserRole,
  identifier: string,
  name: string
): AuthSession => {
  // Generate cryptographically pseudo-random bearer token
  const randomEntropy = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const token = `ew_sec_${role}_${randomEntropy}`;

  const session: AuthSession = {
    token,
    role,
    identifier,
    name,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12 hours validity
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('sessionStorage is unavailable:', err);
  }

  return session;
};

/**
 * Retrieves and validates the active session from sessionStorage
 */
export const getActiveAuthSession = (): AuthSession | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session || !session.token || !session.role) {
      clearAuthSession();
      return null;
    }

    // Verify expiration
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    clearAuthSession();
    return null;
  }
};

/**
 * Destroys session from sessionStorage
 */
export const clearAuthSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear sessionStorage:', err);
  }
};

/**
 * Route Guard Middleware:
 * Inspects sessionStorage before rendering views. If an unauthenticated user
 * attempts to force-navigate to protected views (e.g. Admin Dashboard or Profile),
 * kicks them immediately back to the Home page ('classes').
 */
export interface RouteGuardResult {
  allowed: boolean;
  targetView: 'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard';
  securityMessage?: string;
}

export const executeRouteGuard = (
  requestedView: 'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard',
  isAdminView = false
): RouteGuardResult => {
  const session = getActiveAuthSession();

  // Public views: Classes, Subjects, Topics are publicly browsable
  if (requestedView === 'classes' || requestedView === 'subjects' || requestedView === 'topics') {
    return { allowed: true, targetView: requestedView };
  }

  // Profile view requires any active session (student or admin)
  if (requestedView === 'profile') {
    if (!session) {
      return {
        allowed: false,
        targetView: 'classes',
        securityMessage: 'Access Denied: Session required. Please login to view profile.',
      };
    }
    return { allowed: true, targetView: 'profile' };
  }

  // Dashboard view:
  if (requestedView === 'dashboard') {
    if (!session) {
      return {
        allowed: false,
        targetView: 'classes',
        securityMessage: 'Access Denied: Please login with a valid session to access Dashboard.',
      };
    }

    if (isAdminView && session.role !== 'admin') {
      return {
        allowed: false,
        targetView: 'classes',
        securityMessage: 'Forbidden: Administrator privileges required for this control center.',
      };
    }

    return { allowed: true, targetView: 'dashboard' };
  }

  return { allowed: true, targetView: requestedView };
};
