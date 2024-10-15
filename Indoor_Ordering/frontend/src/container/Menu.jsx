import React from 'react';

function Menu({ menuItems }) {
    return (
        <div className="menu">
            {menuItems.map(item => (
                <div key={item._id} className="menu-item">
                    <img src={item.Image} alt={item.Name} />
                    <h3>{item.Name}</h3>
                    <p>{item.Description}</p>
                    <p>${item.Price}</p>
                </div>
            ))}
        </div>
    );
}

export default Menu;
