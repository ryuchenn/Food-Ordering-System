import React, { useState } from 'react';
import API from '../../API/backend';
import { useTranslation } from "react-i18next";
import Sider from '../../component/Sider';

function AddMenuItem() {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [category, setCategory] = useState(1);
    const [quantity, setQuantity] = useState(100);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [options, setOptions] = useState([]);

    // Add a new option
    const addOption = () => {
        setOptions([...options, { Name: '', Values: [''], Default: '' }]);
    };

    // Update option details
    const updateOption = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };

    // Add a new value to an option
    const addOptionValue = (index) => {
        const updatedOptions = [...options];
        updatedOptions[index].Values.push('');
        setOptions(updatedOptions);
    };

    // Update a specific value in an option
    const updateOptionValue = (index, valueIndex, value) => {
        const updatedOptions = [...options];
        updatedOptions[index].Values[valueIndex] = value;
        setOptions(updatedOptions);
    };

    // Remove an option
    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Category', category);
        formData.append('Quantity', quantity);
        formData.append('Price', price);
        formData.append('Description', description);
        formData.append('Image', image);
        formData.append('Options', JSON.stringify(options));

        try {
            await API.post('/api/menu/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(t('Menu item added successfully!'));
        } catch (error) {
            alert(t('Failed to add menu item!'));
        }
    };

    return (
        <>
            <Sider></Sider>
            <form className='AddMenuItem' onSubmit={handleSubmit}>
                <h2>{t('AddMenuItem.Add Menu Item')}</h2>
                <input type="text" placeholder={t('AddMenuItem.Name')} value={name} onChange={(e) => setName(e.target.value)} required />
                <select value={category} onChange={(e) => setCategory(Number(e.target.value))}>
                    <option value={1}>{t('AddMenuItem.Main Course')}</option>
                    <option value={2}>{t('AddMenuItem.Side')}</option>
                    <option value={3}>{t('AddMenuItem.Drink')}</option>
                    <option value={4}>{t('AddMenuItem.Other')}</option>
                    <option value={5}>{t('AddMenuItem.Add-On')}</option>
                </select>
                <input type="number" placeholder={t('AddMenuItem.Quantity')} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
                <input type="number" placeholder={t('AddMenuItem.Price')} value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                <textarea placeholder={t('AddMenuItem.Description')} value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} required />

                <h3>{t('AddMenuItem.Options')}</h3>
                {options.map((option, index) => (
                    <div key={index} className="option">
                        <input
                            type="text"
                            placeholder={t('AddMenuItem.Option Name')}
                            value={option.Name}
                            onChange={(e) => updateOption(index, 'Name', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder={t('AddMenuItem.Default Value')}
                            value={option.Default}
                            onChange={(e) => updateOption(index, 'Default', e.target.value)}
                        />
                        <button type="button" onClick={() => addOptionValue(index)}>
                            {t('AddMenuItem.Add Value')}
                        </button>
                        <button type="button" onClick={() => removeOption(index)}>
                            {t('AddMenuItem.Remove Option')}
                        </button>
                        <div className="option-values">
                            {option.Values.map((value, valueIndex) => (
                                <input
                                    key={valueIndex}
                                    type="text"
                                    placeholder={t('AddMenuItem.Value')}
                                    value={value}
                                    onChange={(e) => updateOptionValue(index, valueIndex, e.target.value)}
                                    required
                                />
                            ))}
                        </div>
                    </div>
                ))}
                <div className='AddMenuItemButton'>
                    <button type="button" onClick={addOption}>
                        {t('AddMenuItem.Add Option')}
                    </button>
                </div>

                <button type="submit">{t('AddMenuItem.Add Menu Item')}</button>
            </form>
        </>
    );
}

export default AddMenuItem;
