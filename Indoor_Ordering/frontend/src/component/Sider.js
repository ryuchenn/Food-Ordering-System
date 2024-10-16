import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AddMenuItem from '../views/auth/AddMenuItem';
import AuthContext from '../utils/auth/AuthContext';

function Sider() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register'); 
    };

    return (
        <div className="sider">
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            <button>Language Switch</button>
            {user ? (
                <>
                    <span>Welcome, {user.UserName}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <span>Please log in</span>
            )}

            <AddMenuItem/>
        </div>
    );
}

export default Sider;
