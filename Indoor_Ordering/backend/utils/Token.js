const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const VerifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.LOGGING_JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

/**
 * Verify the user have the privilege to do the checkout, order, update the users information or other actions that need to login in our system.
 * @returns error message
 */
const VerifyTokenFromCookie = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token){
        res.locals.IsLoggedIn = false;
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.LOGGING_JWT_SECRET);
        req.UserID = decoded.ID;
        req.UserName = decoded.UserName;
        req.IsRestaurant = decoded.IsRestaurant;
        req.IsDriver = decoded.IsDriver;
        req.IsCustomer = decoded.IsCustomer;
        res.locals.IsLoggedIn = true;
        next();
    } catch (error) {
        res.locals.IsLoggedIn = false;
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

/**
 * This function can use in GET but some features don't need the privilege. For setting the token or setting the UserID.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const SetUserInformation = (req, res, next) => {
    const token = req.cookies.token;

    try {
        if(token){
            const decoded = jwt.verify(token, process.env.LOGGING_JWT_SECRET);
            req.UserID = decoded.ID;
            req.UserName = decoded.UserName;
            req.IsRestaurant = decoded.IsRestaurant;
            req.IsDriver = decoded.IsDriver;
            req.IsCustomer = decoded.IsCustomer;
            res.locals.IsLoggedIn = true;
        }
        else
            res.locals.IsLoggedIn = false;

    } catch (error) {
        res.locals.IsLoggedIn = false;
    }
    next();

}

module.exports = {VerifyToken, VerifyTokenFromCookie, SetUserInformation};