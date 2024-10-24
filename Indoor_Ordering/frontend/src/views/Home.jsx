import '../style/global.css';
import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import Menu from '../container/Menu';
import API from '../API/backend';
import Logo from '../asset/image/Logo.png'
import { useTranslation } from "react-i18next";
// import AuthContext from '../utils/auth/AuthContext';

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  // const { QRCode_Login } = useContext(AuthContext);
  const [TableNumber, setTableNumber] = useState(() => { });
  const { t } = useTranslation();

  useEffect(() => {
    const t = localStorage.getItem('TableNumber') ? localStorage.getItem('TableNumber') : '0';
    setTableNumber(localStorage.getItem('TableNumber') ? localStorage.getItem('TableNumber') : '0');

    // Fetch menu items from backend
    API.get('/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <div className="Main">
        <Header />
        <div className="Table_Title">
          <img src={Logo} alt="Logo"></img>
          <h2>{t('Common.RestaurantName')} </h2>
          <span>{t('Common.Table')} {TableNumber ? TableNumber : 0}</span>
        </div>
        <Menu menuItems={menuItems} />
      </div>
    </>

  );
}

export default Home;
