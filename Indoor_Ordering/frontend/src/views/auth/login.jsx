import React, { useState, useContext } from 'react';
import AuthContext from '../../utils/auth/AuthContext';
import Sider from '../../component/Sider';
import { useTranslation } from "react-i18next";

function Login() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <>
            <Sider></Sider>
            <form className='LoginForm' onSubmit={handleSubmit}>
                <h2> {t('User.Login')} </h2>
                <div>
                    <input
                    type="text"
                    placeholder={t('User.Username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required/>
                </div>
                <div>
                    <input
                    type="password"
                    placeholder={t('User.Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                </div>
                <div>

                    <button type="submit">{t('User.Login')}</button>
                    <a href="/register">{t('TopNavBar.Register')}</a>
                </div>
                
                
            </form>
        </>
    );
}

export default Login;
