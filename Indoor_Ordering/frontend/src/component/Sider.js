import React, { useContext, useState } from 'react';
import AuthContext from '../utils/auth/AuthContext';
import { useTranslation } from "react-i18next";
import '../style/global.css'

function SiderBar() {
    const { t, i18n } = useTranslation();
    const { logout, user } = useContext(AuthContext);
    // const [isSiderOpen, setSiderOpen] = useState(false);

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        console.log(selectedLanguage)
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <>
            <div>
                {/* Desktop & Tablet*/}
                <div class="Sider-Des">
                    <a href="/">{t('TopNavBar.Home')}</a>
                    <a href='/cart'>{t('TopNavBar.Cart')}</a>

                    <a href="/AddMenuItem">{t('TopNavBar.AddMenuItem')}</a>
                    <a href="/UnPaidOrder">{t('TopNavBar.UnPaidOrder')}</a>

                    {user ? (
                        <>
                            {/* <span>{t('Common.hello')}, {user.DisplayName}</span> */}
                            <a href="/" onClick={logout}>{t('TopNavBar.Logout')}</a>
                        </>
                    ) : (
                        <>
                            <a id="sider-Des-lang" href="/login">{t('TopNavBar.Login')}</a>
                        </>
                    )}

                    <select onChange={handleLanguageChange} defaultValue="en">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="zh_tw">繁體中文</option>
                    </select>
                </div>

                {/* Mobile */}

            </div>
            
            
        </>
    );
}

export default SiderBar;
