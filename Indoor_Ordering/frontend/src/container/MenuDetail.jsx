import React, { useState, useEffect, useContext } from 'react';
import API from '../API/backend';
import { useParams } from 'react-router-dom';
import AuthContext from '../utils/auth/AuthContext';

function MenuDetail() {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [customOptions, setCustomOptions] = useState({});
    const [addons, setAddons] = useState([]);
    const [addonQuantities, setAddonQuantities] = useState({});
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        // Fetch add-ons (Category = 5)
        API.get('/api/menu/category5')
            .then(res => setAddons(res.data))
            .catch(err => console.log(err));

        // Fetch the selected menu item
        API.get(`/api/menu/${id}`)
            .then(res => {
                const item = res.data;
                setMenuItem(item);

                // Initial the ItemOptions begin value
                const defaultOptions = {};
                if (item.Options) {
                    item.Options.forEach(option => {
                        defaultOptions[option.Name] = option.Default || option.Values[0];
                    });
                }
                setCustomOptions(defaultOptions); 
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleOptionChange = (optionName, value) => {
        setCustomOptions(prev => ({
            ...prev,
            [optionName]: value,
        }));
    };

    const handleAddonQuantityChange = (addonId, change) => {
        setAddonQuantities(prev => ({
            ...prev,
            [addonId]: Math.max(0, (prev[addonId] || 0) + change),
        }));
    };

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    const handleAddToCart = () => {
        const selectedOptions = Object.entries(customOptions).map(([name, value]) => ({ Name: name, Value: value }));

        const cartItems = [
            {
                MenuID: menuItem._id,
                ItemOptions: selectedOptions,
                Quantity: quantity,
            },
            ...addons
                .filter(addon => addonQuantities[addon._id] > 0)
                .map(addon => ({
                    MenuID: addon._id,
                    ItemOptions: [],
                    Quantity: addonQuantities[addon._id],
                })),
        ];

        if (user){
            API.post('/api/cart/add', { AccountID: user._id, Items: cartItems })
               .then(() => alert('Items added to cart'))
               .catch(err => alert('Failed to add items to cart'));
        }
        else{
            alert('Please Login!')
        }
    };

    if (!menuItem) return <div>Loading...</div>;

    return (
        <div className="menu-detail">
            <h2>{menuItem.Name}</h2>
            <p>{menuItem.Description}</p>
            <p>Price: ${menuItem.Price}</p>
            <img src={`data:image/png;base64,${menuItem.Image}`} alt={menuItem.Name} />

            <div className="customization">
                {menuItem.Options.map(option => (
                    <div key={option.Name}>
                        <label>{option.Name}:</label>
                        <select
                            value={customOptions[option.Name] || option.Default}
                            onChange={(e) => handleOptionChange(option.Name, e.target.value)}
                        >
                            {option.Values.map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="quantity">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <div className="addons">
                <h3>Add-ons</h3>
                {addons.map(addon => (
                    <div key={addon._id} className="addon-item">
                        <span>{addon.Name} ${addon.Price}</span>
                        <button onClick={() => handleAddonQuantityChange(addon._id, -1)}>-</button>
                        <span>{addonQuantities[addon._id] || 0}</span>
                        <button onClick={() => handleAddonQuantityChange(addon._id, 1)}>+</button>
                    </div>
                ))}
            </div>

            <footer className="menu-footer">
                <button onClick={handleAddToCart}>Add To Cart</button>
            </footer>
        </div>
    );
}

export default MenuDetail;
