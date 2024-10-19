import React, { useEffect, useState } from 'react';
import API from '../../API/backend';

function OrderSearch() {
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
        <div>
            <h2>Order Search</h2>
            <div>
                <label>
                    Type:
                    <select onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
                        <option value="">All</option>
                        <option value="1">Dine-in</option>
                        <option value="2">Take-out</option>
                        <option value="3">Delivery</option>
                    </select>
                </label>
                <label>
                    Order Date:
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
                        <th>OrderDate</th>
                        <th>Type</th>
                        <th>DisplayName/TableName</th>
                        <th>Items</th>
                        <th>ItemOptions</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>TotalPrice</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order._id}>
                            <td>{formatDate(order.OrderDate)}</td>
                            <td>
                                {order.Type === 1 ? 'Dine-in' :
                                order.Type === 2 ? 'Take-out' :
                                'Delivery'}
                            </td>
                            <td>{order.AccountDisplayName}</td>
                            <td>
                                {order.Items.map(item =>
                                    <div id={item._id}>
                                        {item.MenuID.Name}
                                    </div>
                                )}
                            </td>
                            <td>
                                {order.Items.map((item, index) => (
                                    <div key={index}>
                                        {item.ItemOptions.map(option => (
                                            <div key={option.Name}>{option.Name}: {option.Value}</div>
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
    );
}

export default OrderSearch;
