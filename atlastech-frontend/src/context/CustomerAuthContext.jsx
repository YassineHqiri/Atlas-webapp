import { createContext, useContext, useState, useEffect } from 'react';
import { customerApi, publicApi } from '../services/api';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const saved = localStorage.getItem('customer_user');
    if (token && saved) {
      setCustomer(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password, password_confirmation) => {
    const { data } = await publicApi.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    const { user, token } = data.data;
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_user', JSON.stringify(user));
    setCustomer(user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await publicApi.post('/auth/login', { email, password });
    const { user, token } = data.data;
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_user', JSON.stringify(user));
    setCustomer(user);
    return data;
  };

  const logout = async () => {
    try {
      await customerApi.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_user');
      setCustomer(null);
    }
  };

  const updateCustomer = (data) => {
    const updated = { ...customer, ...data };
    setCustomer(updated);
    localStorage.setItem('customer_user', JSON.stringify(updated));
  };

  const value = {
    customer,
    loading,
    register,
    login,
    logout,
    updateCustomer,
    isCustomer: !!customer,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
};
