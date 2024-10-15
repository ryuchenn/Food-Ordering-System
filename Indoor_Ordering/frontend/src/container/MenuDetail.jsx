import React, { useState } from 'react';

function MenuDetail({ menuItem, onAddToCart }) {
    const [quantity, setQuantity] = useState(0);
    const [spiceLevel, setSpiceLevel] = useState('Mild');

    const handleAddToCart = () => {
        onAddToCart(menuItem._id, quantity, spiceLevel);
        alert(`${menuItem.Name} added to cart!`);
    };

    return (
        <div className="menu-detail">
            <h2>{menuItem.Name}</h2>
            <p>{menuItem.Description}</p>
            <p>Price: ${menuItem.Price}</p>
            <img src={`data:image/png;base64,${Buffer.from(menuItem.Image).toString('base64')}`} alt={menuItem.Name} />
            <div className="customization">
                <label>
                    Spice Level:
                    <select value={spiceLevel} onChange={(e) => setSpiceLevel(e.target.value)}>
                        <option value="Not Spicy">Not Spicy</option>
                        <option value="Mild">Mild</option>
                        <option value="Hot">Hot</option>
                        <option value="Extra Hot">Extra Hot</option>
                    </select>
                </label>
            </div>
            <div className="quantity">
                <button onClick={() => setQuantity(Math.max(quantity - 1, 0))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

export default MenuDetail;
