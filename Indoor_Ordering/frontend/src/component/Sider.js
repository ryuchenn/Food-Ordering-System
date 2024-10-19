import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../utils/auth/AuthContext';
import { useTranslation } from "react-i18next";

function Sider() {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        console.log(selectedLanguage)
        i18n.changeLanguage(selectedLanguage);
    };
    const handleHome = () => {
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register'); 
    };

    const handleCart = () => {
        navigate(`/cart`); 
    };
    const handleAddMenu = () => {
        navigate('/AddMenuItem'); 
    };
    const handleUnPaidOrder = () => {
        navigate('/UnPaidOrder'); 
    };
    const handleOrderSearch = () => {
        navigate('/OrderSearch'); 
    };

    return (
        <div className="sider">
            <select onChange={handleLanguageChange} defaultValue="en">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="zh_tw">繁體中文</option>
            </select>
            <button onClick={handleHome}>{t('TopNavBar.Home')}</button>
            <button onClick={handleCart}>{t('TopNavBar.Cart')}</button>
            <button onClick={handleAddMenu}>{t('TopNavBar.AddMenuItem')}</button>
            <button onClick={handleUnPaidOrder}>{t('TopNavBar.UnPaidOrder')}</button>
            <button onClick={handleOrderSearch}>{t('TopNavBar.OrderSearch')}</button>
            <button onClick={handleRegister}>{t('TopNavBar.Register')}</button>
            
            {user ? (
                <>
                    <span>{t('Common.hello')}, {user.DisplayName}</span>
                    <button onClick={logout}>{t('TopNavBar.Logout')}</button>
                </>
            ) : (
                <>
                <button onClick={handleLogin}>{t('TopNavBar.Login')}</button>
                </>
                
            )}
        </div>
    );
}

export default Sider;
