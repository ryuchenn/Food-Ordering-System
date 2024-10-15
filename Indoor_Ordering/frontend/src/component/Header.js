import React from 'react';
import Sider from './Sider';

function Header() {
    return (
        <header className="header">
            <Sider />
            <div className="table-info">
                <h2>OMG Japanese Restaurant</h2>
                <span>Table 12</span>
            </div>
            <div className="search-cart">
                <i className="search-icon">🔍</i>
                <i className="cart-icon">🛒</i>
            </div>
        </header>
    );
}

export default Header;
