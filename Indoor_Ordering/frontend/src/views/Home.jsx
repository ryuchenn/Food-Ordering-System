import '../style/global.css';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../component/Header';
import CategoryBar from '../component/CategoryBar';
import Menu from '../container/Menu';
import API from '../API/backend';
// import AuthContext from '../utils/auth/AuthContext';

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  // const { QRCode_Login } = useContext(AuthContext);

  useEffect(() => {
    // Fetch menu items from backend
    API.get('/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <Header />
      <CategoryBar />
      <Menu menuItems={menuItems} />
    </div>
  );
}

export default Home;
