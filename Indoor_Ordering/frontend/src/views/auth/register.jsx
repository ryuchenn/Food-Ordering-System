import React, { useState, useContext } from 'react';
import AuthContext from '../../utils/auth/AuthContext';
import { useTranslation } from "react-i18next";
import Sider from '../../component/Sider';

function Register() {
    const { t } = useTranslation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [DisplayName, setDisplayName] = useState('');

    const { register } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        register(username, DisplayName, password);
    };

    return (
        <>
            <Sider></Sider>
            <form className='RegisterForm' onSubmit={handleSubmit}>
                <h2> {t('User.Register')} </h2>
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
                    type="text"
                    placeholder={t('User.Display Name(Preffered Name)')}
                    value={DisplayName}
                    onChange={(e) => setDisplayName(e.target.value)}
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
                    <button type="submit">{t('User.Register')}</button>
                </div>
                
            </form>
        </>
    );
}

export default Register;
