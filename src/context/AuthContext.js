import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return { user: action.payload, loading: false, isAuthenticated: true };
    case 'AUTH_FAIL':
      return { user: null, loading: false, isAuthenticated: false };
    case 'LOGOUT':
      return { user: null, loading: false, isAuthenticated: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from token on app start
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch({ type: 'AUTH_FAIL' });
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      dispatch({ type: 'AUTH_FAIL' });
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
    toast.success(`Welcome back, ${data.user.firstName}!`);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
    toast.success('Account created! Please verify your email.');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...stored, ...userData }));
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUser,
      loadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
