import React from 'react';
import { useTranslation } from "react-i18next";

function CategoryBar() {
    const { t } = useTranslation();

    return (
        
        <nav class="CategoryBar">
            <a href="#main-course">{t('Common.Main Course')}</a>
            <a href="#side">{t('Common.Side')}</a>
            <a href="#drink">{t('Common.Drink')}</a>
            <a href="#other">{t('Common.Other')}</a>
        </nav>
    );
}

export default CategoryBar;
