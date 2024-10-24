import React, { createContext, useState, useEffect } from 'react';
import API from '../../API/backend';
import { useTranslation } from "react-i18next";
const AuthContext = createContext();

function setToken(res){
    if(res){
        sessionStorage.setItem('_id', res.data.user.id);
        sessionStorage.setItem('id', res.data.user.id);
        sessionStorage.setItem('ID', res.data.user.id);
        sessionStorage.setItem('SessionID', res.data.user.SessionID);
        sessionStorage.setItem('Username', res.data.user.Username);
        sessionStorage.setItem('DisplayName', res.data.user.DisplayName);
    }
}

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

            setToken(res)
            setUser(res.data.user);
            alert(t('Login successfully.'));
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const QRCode_Login = async (TableName) => {
        try {
            const res = await API.post(`/api/auth/login/QRCode/${TableName}`, {}, { withCredentials: true });
            
            setToken(res)
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
            sessionStorage.removeItem("_id");
            sessionStorage.removeItem("id");
            sessionStorage.removeItem("ID");
            sessionStorage.removeItem("SessionID");
            sessionStorage.removeItem("Username");
            sessionStorage.removeItem("DisplayName");

            alert(t('Logged out successfully.'));
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // useEffect(() => {
        // if(!user){
            // API.get('/api/auth/check', { withCredentials: true })
            // .then(res => {
            //     setUser(res.data.user);
            // })
            // .catch(() => {
            //     setUser(null);
            // });
        // }
    // }, []);

    useEffect(() => {
        if(!user){
            if(sessionStorage.getItem("_id"))
            {
                const UserData = {
                    _id: sessionStorage.getItem("_id"),
                    id: sessionStorage.getItem("id"),
                    ID: sessionStorage.getItem("ID"),
                    SessionID: sessionStorage.getItem("SessionID"),
                    Username: sessionStorage.getItem("Username"),
                    DisplayName: sessionStorage.getItem("DisplayName"),
                }
                const userDataJSON = JSON.stringify(UserData)
                setUser(userDataJSON)
            }
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, login, QRCode_Login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
