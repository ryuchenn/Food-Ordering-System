import React, { useEffect, useState } from 'react';
import API from '../../API/backend';

function UnpaidOrder() {
    const [orders, setOrders] = useState([]); // This form

     // (MM/DD, HH:MM:SS AM,PM）
     const formatDate = (dateString) => {
        const options = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    useEffect(() => {
        // Fetch orders with Status = 1 (Unpaid)
        API.get('/api/order/unpaid')
           .then(res => 
               setOrders(res.data)
           )
           .catch(err => console.log(err));    
        
        // Per 30 sec refresh 1 time to get the lastest data from Order collection
        const interval = setInterval(() => {
            window.location.reload();
        }, 30000);
        
        // clear timer and also release cache
        return () => clearInterval(interval);
    }, []);

    // Mark as Paid Button
    const handleMarkAsPaid = (orderId) => {
       
        API.post(`/api/order/${orderId}/markAsPaid`)
            .then(() => {
                // Update unpaid order form
                setOrders(orders.filter(order => order._id !== orderId));
            })
            .catch(err => console.log(err));
    };

    // Mark as Done when the food has already given to the customer
    const handleCheckboxChange = (itemId, isChecked) => {
        const updatedOrders = orders.map(order => {
                const updatedItems = order.Items.map(item => {
                    if (item._id === itemId) {
                        return { ...item, Done: isChecked ? 1 : 0 };
                    }
                    return item;
                });
                return { ...order, Items: updatedItems };
        });

        setOrders(updatedOrders); 

        API.post(`/api/order/item/${itemId}/UpdateDone`, { Done: isChecked ? 1 : 0 })
            .then(() => {
                console.log(`Item ${itemId} updated with Done = ${isChecked ? 1 : 0}`);
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2>Unpaid Orders</h2>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{formatDate(order.OrderDate)}</td>
                            <td>
                                {order.Type === 1 ? 'Dine-in' :
                                order.Type === 2 ? 'Take-out' :
                                'Delivery'}
                            </td>
                            <td>{order.AccountDisplayName}</td>
                            <td>
                                {order.Items.map(item => (
                                    <div id={item._id}>
                                        <input
                                            type="checkbox"
                                            checked={item.Done} 
                                            onChange={(e) => handleCheckboxChange(item._id, e.target.checked)}
                                        />
                                        {item.MenuID.Name}
                                    </div>
                                ))}
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
                            <td>
                                <button onClick={() => handleMarkAsPaid(order._id)}>Mark as Paid</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UnpaidOrder;
