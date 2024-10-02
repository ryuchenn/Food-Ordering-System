const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../../model/core/Account_md');
const Customer = require('../../model/core/Customer_md');
const Driver = require('../../model/driver/Driver_md');
const Restaurant = require('../../model/restaurant/Restaurant_md');
const { ValidateFormData } = require('../../controller/core/Account_con')
const router = express.Router();

//////////// API Routes && Input Validation && Error Handling ////////////

// Register Page
router.get("/register", (req, res) => {
    return res.render("core/Register.ejs")
});

router.post('/register', async (req, res, next) => {
    try {
        const { UserName, Password, ConfirmPassword, Email, Phone, Address, Role } = req.body; 
        const { RestaurantName, OpenHours, Cuisine } = req.body; // Restaurant
        const { DriverFirstName, DriverMiddleName, DriverLastName, VehicleBrand, VehicleModel, VehicleColor, VehicleLicense } = req.body; // Driver
        const { CustomerFirstName, CustomerMiddleName, CustomerLastName} = req.body; // Customer
        const IsRestaurant = (Role === 'Restaurant');
        const IsDriver = (Role === 'Driver');
        const IsCustomer = (Role === 'Customer');

        const Data = {
            Username: UserName,
            Password: Password,
            ConfirmPassword: ConfirmPassword,
            Email: Email,
            Phone: Phone,
            Address: Address,
            Role: Role,
            IsRestaurant: IsRestaurant,
            IsDriver: IsDriver,
            IsCustomer: IsCustomer
        };
        
        if (IsRestaurant) {
            Data.RestaurantName = RestaurantName;
            Data.OpenHours = OpenHours;
            Data.Cuisine = Cuisine;
        }
        
        if (IsDriver) {
            Data.FirstName = DriverFirstName;
            Data.MiddleName = DriverMiddleName;
            Data.LastName = DriverLastName;
            Data.VehicleBrand = VehicleBrand;
            Data.VehicleModel = VehicleModel;
            Data.VehicleColor = VehicleColor;
            Data.VehicleLicense = VehicleLicense;
        }
        
        if (IsCustomer) {
            Data.FirstName = CustomerFirstName;
            Data.MiddleName = CustomerMiddleName;
            Data.LastName = CustomerLastName;
        }

        const Result = await Account.findOne({
            $or: [
                { UserName: UserName }
            ]
        });
        
        if (Result) {
            console.log("Username already exist!")
            return res.render('core/Register.ejs', { errorMessage: "Username already exist!"});;
        }

        const ValidationResult = ValidateFormData(Data)
        if (!ValidationResult.valid) {
            return res.render('core/Register.ejs', { errorMessage: ValidationResult.message, formData: Data });;
        }
        else{
            // Password encryption
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);
            // Create user
            const UserData = new Account({
                UserName,
                Password: hashedPassword,
                IsRestaurant,
                IsDriver,
                IsCustomer
            });
            
            const FinalResult = await UserData.save();// Save user in MongoDB
            
            if (FinalResult){
                if (IsRestaurant){
                    const RestaurantData = new Restaurant({
                        AccountID: FinalResult._id,
                        Name: RestaurantName,
                        Address,
                        Email,
                        Phone,
                        OpenHours,
                        Cuisine,
                        // LocationLongitude,
                        // LocationLatitude
                    });
                    await RestaurantData.save();// Save user in MongoDB
                }
                else if (IsDriver){
                    const DriverData = new Driver({
                        AccountID: FinalResult._id,
                        FirstName: DriverFirstName,
                        MiddleName: DriverMiddleName,
                        LastName: DriverLastName,
                        Address,
                        Phone,
                        Email,
                        VehicleBrand,
                        VehicleModel,
                        VehicleColor,
                        VehicleLicense
                    });
                    await DriverData.save();// Save user in MongoDB
                }else if (IsCustomer){
                    const CustomerData = new Customer({
                        AccountID: FinalResult._id,
                        FirstName: CustomerFirstName,
                        MiddleName: CustomerMiddleName,
                        LastName: CustomerLastName,
                        Address,
                        Phone,
                        Email,
                    });
                    await CustomerData.save();// Save user in MongoDB
                }
            }else
                res.status(500).send('Error registering!');
        }
        res.status(201).send('Registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user: ' + error.message);
    }
});

// Login
router.get("/login", (req, res) => {
    return res.render("core/Login.ejs")
});

router.post('/login', async (req, res, next) => {
    try {
        const { UserName, Password } = req.body;

        // Check if user exists
        const user = await Account.findOne({ UserName });
        if (!user)
            return res.render('core/Login.ejs', { errorMessage: "Error username or password" });;

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch)
            return res.render('core/Login.ejs', { errorMessage: "Error username or password" });;

        // Generate JWT
        const token = jwt.sign({ id: user._id, UserName: user.UserName }, process.env.LOGGING_JWT_SECRET, { expiresIn: '1h' });
        // res.status(200).send("success");
        res.cookie('token', token, { httpOnly: true, secure: true });
        return res.render("restaurant/RestaurantHome.ejs")
    } catch (error) {
        res.status(500).send('Error logging in: ' + error.message);
    }
});

// Logout
router.get('/logout', (req, res) => {
    // Invalidate JWT in client side (handled in view or frontend)
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(200).send('Logged out successfully');
});

module.exports = router;