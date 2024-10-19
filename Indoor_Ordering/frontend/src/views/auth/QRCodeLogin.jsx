import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '../../utils/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const QRCodeLogin = () => {
    const search = new URLSearchParams(useLocation().search)
    const { QRCode_Login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        //TEST on PC: http://localhost:3000/QRCodeLogin?TableName=TableNo1
        //TEST on Mobile: http://Your Local IPv4 address:3000/QRCodeLogin?TableName=TableNo1 
        //                => http://192.168.2.20:3000/QRCodeLogin?TableName=TableNo1
        QRCode_Login(search.get('TableName')) 
        navigate('/')
    }, []);

  return (
    <div>QRCodeLogin</div>
  )
}

export default QRCodeLogin