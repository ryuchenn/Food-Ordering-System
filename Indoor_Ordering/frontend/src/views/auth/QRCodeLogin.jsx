import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../utils/auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const QRCodeLogin = () => {
    const search = new URLSearchParams(useLocation().search)
    const navigate = useNavigate();
    const { QRCode_Login } = useContext(AuthContext);
    const [TableNumber, setTableNumber] = useState('');

    useEffect(() => {
        const tableNo = search.get('TableName')?.replace('TableNo', '');  
        if (tableNo)
            setTableNumber(tableNo); 
        //TEST on PC: http://localhost:3000/QRCodeLogin?TableName=TableNo1
        //TEST on Mobile: http://Your Local IPv4 address:3000/QRCodeLogin?TableName=TableNo1 
        //                => http://192.168.2.20:3000/QRCodeLogin?TableName=TableNo1
        // QRCode_Login(search.get('TableName')) 
        localStorage.setItem('TableNumber', tableNo);
        navigate('/');
    }, []);

  return (
    <>
      <div>QRCodeLogin</div>
    </>
    
  )
}

export default QRCodeLogin