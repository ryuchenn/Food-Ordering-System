import React from 'react';
import SiderBar from './Sider';
import CategoryBar from '../component/CategoryBar';

function Header() {
    return (
        <header>
            <SiderBar />
            <CategoryBar/>
        </header>
    );
}

export default Header;
