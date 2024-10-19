import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../utils/auth/AuthContext';

function Sider() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register'); 
    };

    const handleCart = () => {
        navigate(`/cart`); 
    };
    const handleAddMenu = () => {
        navigate('/AddMenuItem'); 
    };
    const handleUnPaidOrder = () => {
        navigate('/UnPaidOrder'); 
    };
    const handleOrderSearch = () => {
        navigate('/OrderSearch'); 
    };

    return (
        <div className="sider">
            <button>Language Switch</button>
            <button onClick={handleCart}>Cart</button>
            <button onClick={handleAddMenu}>AddMenuItem</button>
            <button onClick={handleUnPaidOrder}>UnPaidOrder</button>
            <button onClick={handleOrderSearch}>OrderSearch</button>
            <button onClick={handleRegister}>Register</button>

            {user ? (
                <>
                    <span>Welcome, {user.DisplayName}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                <button onClick={handleLogin}>Login</button>
                </>
                
            )}
        </div>
    );
}

export default Sider;
