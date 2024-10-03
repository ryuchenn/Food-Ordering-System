const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../../model/core/Account_md');
const Customer = require('../../model/core/Customer_md');
const Driver = require('../../model/driver/Driver_md');
const Restaurant = require('../../model/restaurant/Restaurant_md');
const { ValidateInsertFormData, ValidateUpdateFormData } = require('../../controller/core/Account_con')
const VerifyTokenFromCookie = require('../../utils/core/Token')
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
            return res.render('core/Register.ejs', { ErrorMessage: "Username already exist!"});;
        }

        const ValidationResult = ValidateInsertFormData(Data)
        if (!ValidationResult.valid) {
            return res.render('core/Register.ejs', { ErrorMessage: ValidationResult.message});;
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
            return res.render('core/Login.ejs', { ErrorMessage: "Error username or password" });;

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch)
            return res.render('core/Login.ejs', { ErrorMessage: "Error username or password" });;

        // Generate JWT
        const token = jwt.sign({ ID: user._id, UserName: user.UserName, IsRestaurant: user.IsRestaurant, IsDriver: user.IsDriver, IsCustomer: user.IsCustomer }, process.env.LOGGING_JWT_SECRET, { expiresIn: '1h' });
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

// Update
router.get('/update', VerifyTokenFromCookie, async (req, res) => {
    try {
        const UserData = await Account.findById(req.UserID);
        let RoleData = {};
        
        if (!UserData)
            return res.status(404).send("User not found");

        if (UserData.IsRestaurant)
            RoleData = await Restaurant.findOne({ AccountID: UserData._id });
        else if (UserData.IsDriver)
            RoleData = await Driver.findOne({ AccountID: UserData._id });
        else if (UserData.IsCustomer)
            RoleData = await Customer.findOne({ AccountID: UserData._id });

        if (RoleData)
            return res.render("core/UserUpdate.ejs", { UserData, RoleData });
        else
            res.status(500).send('Error retrieving user data: ');
    } catch (error) {
        res.status(500).send('Error retrieving user data: ' + error.message);
    }
});

router.post('/update', VerifyTokenFromCookie, async (req, res, next) => {
    try {
        const { UserName, Email, Phone, Address, IsRestaurant, IsDriver, IsCustomer } = req.body; // Basic Information
        const { RestaurantName, OpenHours, Cuisine } = req.body; // Restaurant
        const { DriverFirstName, DriverMiddleName, DriverLastName, VehicleBrand, VehicleModel, VehicleColor, VehicleLicense } = req.body; // Driver
        const { CustomerFirstName, CustomerMiddleName, CustomerLastName} = req.body; // Customer
        let RoleData = {};

        const User = await Account.findById(req.UserID);
        if (!User) {
            return res.status(404).send("User not found");
        }

        const UserData = {
            UserName: UserName,
            Email: Email,
            Phone: Phone,
            Address: Address,
            IsRestaurant: req.IsRestaurant,
            IsDriver: req.IsDriver,
            IsCustomer: req.IsCustomer
        };
        
        if (req.IsRestaurant) {
            UserData.Name = RestaurantName;
            UserData.OpenHours = OpenHours;
            UserData.Cuisine = Cuisine;
        }
        else if (req.IsDriver) {
            UserData.FirstName = DriverFirstName;
            UserData.MiddleName = DriverMiddleName;
            UserData.LastName = DriverLastName;
            UserData.VehicleBrand = VehicleBrand;
            UserData.VehicleModel = VehicleModel;
            UserData.VehicleColor = VehicleColor;
            UserData.VehicleLicense = VehicleLicense;
        }   
        else if (req.IsCustomer) {
            UserData.FirstName = CustomerFirstName;
            UserData.MiddleName = CustomerMiddleName;
            UserData.LastName = CustomerLastName;
        }

        const ValidationResult = ValidateUpdateFormData(UserData)
        if (!ValidationResult.valid) {
            RoleData = UserData;
            return res.render('core/UserUpdate.ejs', { UserData, RoleData, ErrorMessage: ValidationResult.message, SuccessMessage: undefined});;
        }
        else{
            RoleData = {} // clear when have error situation last time
            if (req.IsRestaurant) {
                const RestaurantData = await Restaurant.findOne({ AccountID: req.UserID });
                RestaurantData.Phone = Phone;
                RestaurantData.Address = Address;
                RestaurantData.Name = RestaurantName;
                RestaurantData.OpenHours = OpenHours;
                RestaurantData.Cuisine = Cuisine;
                RoleData = RestaurantData;
                await RestaurantData.save();
            }else if (req.IsDriver) {
                const DriverData = await Driver.findOne({ AccountID: req.UserID });
                DriverData.Phone = Phone;
                DriverData.Address = Address;
                DriverData.FirstName = DriverFirstName;
                DriverData.MiddleName = DriverMiddleName;
                DriverData.LastName = DriverLastName;
                DriverData.VehicleBrand = VehicleBrand;
                DriverData.VehicleModel = VehicleModel;
                DriverData.VehicleColor = VehicleColor;
                DriverData.VehicleLicense = VehicleLicense;
                RoleData = DriverData;
                await DriverData.save();
            }else if (req.IsCustomer) {
                const CustomerData = await Customer.findOne({ AccountID: req.UserID });
                CustomerData.Phone = Phone;
                CustomerData.Address = Address;
                CustomerData.FirstName = CustomerFirstName;
                CustomerData.MiddleName = CustomerMiddleName;
                CustomerData.LastName = CustomerLastName;
                RoleData = CustomerData;
                await CustomerData.save();
            }
            return res.render('core/UserUpdate.ejs', {UserData, RoleData, SuccessMessage: "Updated Success", ErrorMessage: undefined});;
        }
    } catch (error) {
        res.status(500).send("Error updating user: " + error.message);
    }
});



module.exports = router;