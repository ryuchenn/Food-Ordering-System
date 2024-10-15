import React, { useState } from 'react';
import axios from 'axios';

function AddMenuItem() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(1);
    const [quantity, setQuantity] = useState(100);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Category', category);
        formData.append('Quantity', quantity);
        formData.append('Price', price);
        formData.append('Description', description);
        formData.append('Image', image);

        try {
            await axios.post('/api/menu/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Menu item added successfully!');
        } catch (error) {
            alert('Failed to add menu item!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <select value={category} onChange={(e) => setCategory(Number(e.target.value))}>
                <option value={1}>Main Course</option>
                <option value={2}>Side</option>
                <option value={3}>Drink</option>
                <option value={4}>Other</option>
            </select>
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
            <button type="submit">Add Menu Item</button>
        </form>
    );
}

export default AddMenuItem;
