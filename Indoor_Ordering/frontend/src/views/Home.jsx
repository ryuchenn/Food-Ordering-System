import '../style/global.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../component/Header';
import CategoryBar from '../component/CategoryBar';
import Menu from '../container/Menu';
import Cart from './public/Cart';

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch menu items from backend
    axios.get('/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <Header />
      <CategoryBar />
      <Menu menuItems={menuItems} />
      <Cart cartItems={cartItems} /> 
    </div>
  );
}

export default Home;
