import React, { createContext, useState, useEffect } from 'react';
import API from '../../API/backend';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const res = await API.post(
                '/api/auth/login',
                {
                    username: username,
                    password: password
                },
                { withCredentials: true }
            );

            setUser(res.data.user);
            console.log(res.data.user)

            alert('Login successfully.');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const register = async (username, password) => {
        try {
            await API.post('/api/auth/register',
                {
                    username: username,
                    password: password
                });
            alert('Registration successful! Please log in.');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const logout = async () => {
        try {
            await API.post('/api/auth/logout', {}, { withCredentials: true });
            setUser(null);
            alert('Logged out successfully.');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        API.get('/api/auth/check', { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
