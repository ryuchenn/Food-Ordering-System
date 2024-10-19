import React, { createContext, useState, useEffect } from 'react';
import API from '../../API/backend';
import { useTranslation } from "react-i18next";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { t } = useTranslation();

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
            alert(t('Login successfully.'));
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const QRCode_Login = async (TableName) => {
        try {
            const res = await API.post(`/api/auth/login/QRCode/${TableName}`, {}, { withCredentials: true });

            setUser(res.data.user);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const register = async (username, DisplayName, password) => {
        try {
            await API.post('/api/auth/register',
                {
                    username: username,
                    DisplayName: DisplayName,
                    password: password
                });
            alert(t('Registration successful! Please log in.'));
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const logout = async () => {
        try {
            await API.post('/api/auth/logout', {}, { withCredentials: true });
            setUser(null);
            alert(t('Logged out successfully.'));
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
        // fetch('/api/auth/check', {
        //     method: 'POST',
        //     credentials: 'include',  
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //   });
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, QRCode_Login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
