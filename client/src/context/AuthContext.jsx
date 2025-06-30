import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, authToken) => {
    console.log('AuthContext login:', { userData, authToken });
    setUser(userData); // Ensure userData is a stable object
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    console.log('AuthContext logout');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;