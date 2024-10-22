import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
function Menu({ menuItems }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Sort the Category 1~5
    const sortedMenuItems = [...menuItems].sort((a, b) => a.Category - b.Category);

    const handleItemClick = (id) => {
        navigate(`/menu/${id}`);
    };

    // Function to get category title based on Category
    const getCategoryTitle = (category) => {
        switch (category) {
            case 1:
                return t('Common.Main Course');
            case 2:
                return t('Common.Side');
            case 3:
                return t('Common.Drink');
            case 4:
                return t('Common.Other');
            default:
                return "";
        }
    };
    const getCategoryId = (category) => {
        switch (category) {
            case 1:
                return "main-course";
            case 2:
                return "side";
            case 3:
                return "drink";
            case 4:
                return "other";
            default:
                return "";
        }
    };

    let displayedCategories = [];
    return (
        <>
            <div>
                {sortedMenuItems.map(item => {
                    const categoryTitle = getCategoryTitle(item.Category);
                    const shouldDisplayTitle = !displayedCategories.includes(item.Category);

                    if (shouldDisplayTitle) {
                        displayedCategories.push(item.Category);
                    }

                    return (
                        <>
                            {shouldDisplayTitle && <h2 className='MenuTitle'>{categoryTitle}</h2>}
                            <div className='Menu' key={item._id} id={getCategoryId(item.Category)}>
                            {/* Only display the title once when output all result */}
                                <div className="MenuItem" onClick={() => handleItemClick(item._id)}>
                                    <img src={item.Image} alt={item.Name} />
                                    <div>
                                        <h3>{t(`Food.${item.Name}`)}</h3>
                                        <p>{t('Common.Price')}: ${item.Price}</p>
                                        <p>{item.Description}</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </>
                        
                    );
                })}
            </div>
        </>
    );
}

export default Menu;