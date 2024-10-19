import React from 'react';
import Sider from './Sider';
import { useTranslation } from "react-i18next";

function Header( {TableNumber} ) {
    const { t } = useTranslation();

    return (
        <header className="header">
            <Sider />
            <div className="table-info">
                <h2>{t('Common.RestaurantName')} </h2>
                <span>{t('Common.Table')} {TableNumber ? TableNumber : 0}</span>
            </div>
        </header>
    );
}

export default Header;
