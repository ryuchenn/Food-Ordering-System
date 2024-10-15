import React from 'react';

function Cart({ cartItems }) {
    return (
        <div className="cart">
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                cartItems.map(item => (
                    <div key={item.MenuID}>
                        <h3>{item.Name}</h3>
                        <p>${item.Price} x {item.Quantity}</p>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                ))
            )}
            <div>
                SubTotal:
                Tax:
                Total:
            </div>
            <footer>
                <button>Checkout</button>
            </footer>
        </div>

    );
}

export default Cart;
