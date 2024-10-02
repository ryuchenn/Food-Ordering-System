const jwt = require('jsonwebtoken');

const UserAuthCheck = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

/**
 * Check registration fields
 * @param {form}  - input form data
 * @returns  - error message or success message
 */
function ValidateFormData(data) {
    if (!data.Username || data.Username.trim() === '')
        return { valid: false, message: 'Username is required.' };

    if (data.Username.length > 15 || data.Username.length < 5)
        return { valid: false, message: 'Username number must greater than 5 and lower than 15 digits.' };

    if (!data.Password || data.Password.trim() === '')
        return { valid: false, message: 'Password is required.' };
    
    if (data.Password != data.ConfirmPassword)
        return { valid: false, message: 'Passwords do not match.' };

    const result = validatePassword(data.Password)
    if (!result.valid)
        return { valid: result.valid, message: result.message }

    if (!data.ConfirmPassword || data.ConfirmPassword.trim() === '')
        return { valid: false, message: 'Confirm password is required.' };

    if (data.Email.length > 80)
        return { valid: false, message: 'Email number must lower than 80 digits. Choose another one.' };

    if (data.IsRestaurant){
        if (!data.RestaurantName || data.RestaurantName === "")
            return { valid: false, message: 'Restaurant Name is required' };
        if (!data.OpenHours || data.OpenHours === "")
            return { valid: false, message: 'OpenHours is required' };
        if (!data.Cuisine || data.Cuisine === "")
            return { valid: false, message: 'Cuisine is required' };
    }else if (data.IsDriver){
        if (!data.FirstName || data.FirstName === "")
            return { valid: false, message: 'First Name is required' };
        if (!data.LastName || data.LastName === "")
            return { valid: false, message: 'Last Name is required' };
        if (!data.VehicleBrand || data.VehicleBrand === "")
            return { valid: false, message: 'Vehicle Brand is required' };
        if (!data.VehicleModel || data.VehicleModel === "")
            return { valid: false, message: 'Vehicle Model is required' };
        if (!data.VehicleColor || data.VehicleColor === "")
            return { valid: false, message: 'Vehicle Color is required' };
        if (!data.VehicleLicense || data.VehicleLicense === "")
            return { valid: false, message: 'Vehicle License is required' };
    }else if (data.IsCustomer){
        if (!data.FirstName || data.FirstName === "")
            return { valid: false, message: 'First Name is required' };
        if (!data.LastName || data.LastName === "")
            return { valid: false, message: 'Last Name is required' };
    }

    return { valid: true, message: 'Validation successful.' }; // return true if all pass
}

/**
 * 1. At least 8～15 characters 
 * 2. At least a uppercase, a lowercase, a number, and a special character.
 * @param {form}  - input password
 * @returns  - error message or success message
 */
function validatePassword(Password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;

    if (!passwordRegex.test(Password)) {
        return {
            valid: false,
            message: 'Password must be at least 8～15 characters and include uppercase, lowercase, a number, and a special character.',
        };
    }

    return {
        valid: true,
        message: 'Password is valid.',
    };
}

module.exports = { UserAuthCheck, ValidateFormData };

