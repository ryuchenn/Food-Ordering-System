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
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={t('User.Username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder={t('User.Display Name(Preffered Name)')}
                    value={DisplayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('User.Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{t('User.Register')}</button>
            </form>
        </>
    );
}

export default Register;
