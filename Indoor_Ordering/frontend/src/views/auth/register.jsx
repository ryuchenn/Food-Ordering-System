import React, { useState, useContext } from 'react';
import AuthContext from '../../utils/auth/AuthContext';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        register(username, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
