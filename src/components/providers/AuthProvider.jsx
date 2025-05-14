// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext'; // import the context
import { axiosInstance } from '../../config/globals'; // import the axios instance

export default function AuthProvider({ children }) {             // sole export is a component :contentReference[oaicite:7]{index=7}
  const [user, setUser] = useState(null);
  const fetchUser = () => {
    axiosInstance.get('/api/auth-check/')
      .then(res => {
        if (res.data.isAuthenticated) {
          return axiosInstance.get('/api/profile/');
        } else {
          localStorage.removeItem('access_token'); Cookies.remove('sessionid');
          throw new Error('Not authenticated');

        }
      })
      .then(r => { setUser(r.data) }) // set the user data in the context
      .catch(() => { setUser(null); localStorage.removeItem('access_token'); Cookies.remove('sessionid') });
  }
  useEffect(() => {
    fetchUser(); // Fetch user data when the component mounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
