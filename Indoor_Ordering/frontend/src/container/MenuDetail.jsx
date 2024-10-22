import React, { useState, useEffect, useContext } from 'react';
import API from '../API/backend';
import { useParams } from 'react-router-dom';
import AuthContext from '../utils/auth/AuthContext';
import { useTranslation } from "react-i18next";
import Sider from '../component/Sider';

function MenuDetail() {
    const { t } = useTranslation();
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
               .then(() => alert(t('Items added to cart')))
               .catch(err => alert(t('Failed to add items to cart')));
        }
        else{
            alert(t('Please Login!'))
        }
    };

    if (!menuItem) return <div>Loading...</div>;

    return (
        <>
            <Sider></Sider>
            <div className="MenuDetail">
                <h2>{t(`Food.${menuItem.Name}`)}</h2>
                <p>{t('MenuDetail.Price')}: ${menuItem.Price}</p>
                <div>{menuItem.Description}</div>
                <img src={`data:image/png;base64,${menuItem.Image}`} alt={menuItem.Name} />

                <div className="Customization">
                    {menuItem.Options.map(option => (
                        <div className="Customization2" key={option.Name}>
                            <div>
                                <label>{t(`FoodOptions.${option.Name}`)}:</label>
                            </div>
                            <div>
                                <select
                                    value={customOptions[option.Name] || option.Default}
                                    onChange={(e) => handleOptionChange(option.Name, e.target.value)}>
                                    {option.Values.map(value => (
                                        <option key={value} value={value}>{t(`FoodOptions.${value}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className='NenuDetailQuantity'>
                    <div>
                        {t('MenuDetail.Quantity')}:
                    </div>
                    <div>
                        <button onClick={() => handleQuantityChange(-1)}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                    
                </div>
                

                <div className="Addons">
                    <h3>{t('MenuDetail.Add-ons')}</h3>
                    {addons.map(addon => (
                        <div key={addon._id} className="AddonItem">
                            <span>{t(`Food.${addon.Name}`)} ${addon.Price}</span>
                            <div>
                                <button onClick={() => handleAddonQuantityChange(addon._id, -1)}>-</button>
                                <span>{addonQuantities[addon._id] || 0}</span>
                                <button onClick={() => handleAddonQuantityChange(addon._id, 1)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="MenuFooter">
                        <button onClick={handleAddToCart}>{t('MenuDetail.Add To Cart')}</button>
                </footer>
            </div>
        </>
    );
}

export default MenuDetail;
