import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { googleLoginApi, getMeApi } from '../services/api';
import { showSuccess, showError } from '../components/common/Toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sibling_vault_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('sibling_vault_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Verify stored session on initial mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('sibling_vault_token');
      if (savedToken) {
        try {
          const { data } = await getMeApi();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('sibling_vault_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid. Resetting auth state.');
          localStorage.removeItem('sibling_vault_token');
          localStorage.removeItem('sibling_vault_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const loginWithGoogle = useCallback(async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        showError('Google sign in failed. No credential received.');
        return false;
      }

      const { data } = await googleLoginApi(credentialResponse.credential);
      const { token: jwtToken, user: authUser } = data;

      setToken(jwtToken);
      setUser(authUser);

      localStorage.setItem('sibling_vault_token', jwtToken);
      localStorage.setItem('sibling_vault_user', JSON.stringify(authUser));

      showSuccess(`👋 Welcome back, ${authUser.name.split(' ')[0]}!`);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      showError(err.response?.data?.error || 'Google Sign-In failed. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sibling_vault_token');
    localStorage.removeItem('sibling_vault_user');
    setUser(null);
    setToken(null);
    showSuccess('Signed out successfully.');
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};

export default AuthContext;
