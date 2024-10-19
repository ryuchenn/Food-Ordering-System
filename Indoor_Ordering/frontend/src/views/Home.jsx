import '../style/global.css';
import React, { useState, useEffect} from 'react';
import Header from '../component/Header';
import CategoryBar from '../component/CategoryBar';
import Menu from '../container/Menu';
import API from '../API/backend';
// import AuthContext from '../utils/auth/AuthContext';

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  // const { QRCode_Login } = useContext(AuthContext);
  const [TableNumber, setTableNumber] = useState(() => {});

  useEffect(() => {
    const t = localStorage.getItem('TableNumber') ? localStorage.getItem('TableNumber') : '0';
    setTableNumber(localStorage.getItem('TableNumber') ? localStorage.getItem('TableNumber') : '0');

    // Fetch menu items from backend
    API.get('/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <Header TableNumber={TableNumber? TableNumber : '0'}/>
      <CategoryBar />
      <Menu menuItems={menuItems} />
    </div>
  );
}

export default Home;
