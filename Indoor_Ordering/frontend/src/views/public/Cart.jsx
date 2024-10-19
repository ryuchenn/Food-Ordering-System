import React, { useEffect, useState, useContext } from 'react';
import API from '../../API/backend';
import AuthContext from '../../utils/auth/AuthContext';
import { useTranslation } from "react-i18next";
import Sider from '../../component/Sider';

function Cart() {
    const { t } = useTranslation();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const { user } = useContext(AuthContext);
    const [customOptions, setCustomOptions] = useState({});
    const TAX_RATE = 0.13;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Get the Items by AccountID
    useEffect(() => {

        if(user){
            API.get(`/api/cart/${user._id}`)
            .then(res => {
                setCartItems(res.data.items);
                calculateSubtotal(res.data.items);

                const item = res.data;
                
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
        }
    }, [user]);

    // Calculate Subtotal
    const calculateSubtotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.Quantity * item.Price, 0);
        setSubtotal(total);
    };

    // Edit the foods quantity
    const handleUpdateQuantity = (menuId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedItems = cartItems.map(item => 
            item.MenuID === menuId ? { ...item, Quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateSubtotal(updatedItems);

        API.post(`/api/cart/update`, {
            AccountID: user._id,
            MenuID: menuId,
            Quantity: newQuantity,
        }).catch(err => console.log(err));
    };

    // Delete Items from Database
    const handleDeleteItem = (menuId) => {
        const updatedItems = cartItems.filter(item => item.MenuID !== menuId);
        setCartItems(updatedItems);
        calculateSubtotal(updatedItems);

        API.delete(`/api/cart/delete`, {
            data: { 
                    AccountID: user._id,
                    MenuID: menuId, 
                  },
        }).catch(err => console.log(err));
    };

    // Submit the Order
    const handleCheckout = () => {
        
        const selectedOptions = Object.entries(customOptions).map(([name, value]) => ({ Name: name, Value: value }));
        API.post('/api/order/submit', { 
                                        Type: 1, 
                                        AccountID: user._id, 
                                        Items: cartItems,
                                        Drivers: null,
                                        TotalPrice: parseFloat(total.toFixed(2)),
                                       })
            .then(() => {
                alert(t('Order placed successfully!'));
                setCartItems([]); // clear the cart
                setSubtotal(0);
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <Sider></Sider>
            <div className="cart">
                <h2>{t('Cart.Cart')}</h2>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.MenuID} className="cart-item">
                            <span>{t(`Food.${item.Name}`)} </span>
                            <span>{t('Cart.Quantity')}
                                <button onClick={() => handleUpdateQuantity(item.MenuID, item.Quantity - 1)}>-</button>
                                    {item.Quantity}
                                <button onClick={() => handleUpdateQuantity(item.MenuID, item.Quantity + 1)}>+</button>
                            </span>
                            <span>{t('Cart.Price')}: ${item.Price.toFixed(2)}</span>
                            <button onClick={() => handleDeleteItem(item.MenuID)}>{t('Cart.Delete')}</button>
                        </li>
                    ))}
                </ul>
                <div className="cart-summary">
                    <div>{t('Cart.SubTotal')}: ${subtotal.toFixed(2)}</div>
                    <div>{t('Cart.Tax')}: ${tax.toFixed(2)}</div>
                    <div>{t('Cart.Total')}: ${total.toFixed(2)}</div>
                    <button onClick={handleCheckout}>{t('Cart.Place Order')}</button>
                </div>
            </div>
        </>
        
    );
}

export default Cart;
