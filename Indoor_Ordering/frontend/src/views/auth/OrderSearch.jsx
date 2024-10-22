import React, { useEffect, useState } from 'react';
import API from '../../API/backend';
import { useTranslation } from "react-i18next";
import Sider from '../../component/Sider';

function OrderSearch() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // (MM/DD, HH:MM:SS AM,PM）
    const formatDate = (dateString) => {
        const options = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Get the Data by filter
    const filteredOrders = orders.filter(order => {
        // Type Filter
        const matchType = typeFilter ? order.Type === parseInt(typeFilter) : true;
        // Date Filter
        const matchDate = dateFilter ? new Date(order.OrderDate).toISOString().split('T')[0] === dateFilter : true;
        return matchType && matchDate;
    });

    useEffect(() => {
        // Fetch all orders
        API.get('/api/order/ordercheck')
            .then(res => setOrders(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
       <>
            <Sider></Sider>
            <div className='OrderSearch'>
                <h2>{t('Order.Order Search')}</h2>
                <h3><a href="/UnPaidOrder">{t('TopNavBar.UnPaidOrder')}</a></h3>
                <div>
                    <label>
                        {t('Order.Type')}:
                        <select onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
                            <option value="">{t('Order.All')}</option>
                            <option value="1">{t('Order.Dine-in')}</option>
                            <option value="2">{t('Order.Take-out')}</option>
                            <option value="3">{t('Order.Delivery')}</option>
                        </select>
                    </label>
                    <label>
                        {t('Order.Order Date')}:
                        <input
                            type="date"
                            onChange={(e) => setDateFilter(e.target.value)}
                            value={dateFilter}
                        />
                    </label>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>{t('Order.OrderDate')}</th>
                            <th>{t('Order.Type')}</th>
                            <th>{t('Order.DisplayName/TableName')}</th>
                            <th>{t('Order.Items')}</th>
                            <th>{t('Order.ItemOptions')}</th>
                            <th>{t('Order.Quantity')}</th>
                            <th>{t('Order.Price')}</th>
                            <th>{t('Order.TotalPrice')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                <td>{formatDate(order.OrderDate)}</td>
                                <td>
                                    {order.Type === 1 ? t('Order.Dine-in') :
                                     order.Type === 2 ? t('Order.Take-out') :
                                                       t('Order.Delivery')}
                                </td>
                                <td>{order.AccountDisplayName}</td>
                                <td>
                                    {order.Items.map(item =>
                                        <div id={item._id}>
                                            {t(`Food.${item.MenuID.Name}`)}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {order.Items.map((item, index) => (
                                        <div key={index}>
                                            {item.ItemOptions.map(option => (
                                                <div key={option.Name}>{t(`FoodOptions.${option.Name}`)}: {t(`FoodOptions.${option.Value}`)}</div>
                                            ))}
                                        </div>
                                    ))}
                                </td>
                                <td>{order.Items.map(item => <div>{item.Quantity}</div>)}</td>
                                <td>{order.Items.map(item => <div>{item.Price.toFixed(2)}</div>)}</td>
                                <td>${order.TotalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </> 
    );
}

export default OrderSearch;
