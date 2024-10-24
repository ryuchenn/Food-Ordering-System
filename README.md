# Food Ordering System
## Introduction
[Quick Demo in Dine-In System](https://youtu.be/yPkwjGVgtlk)
This project aims to simulate the commercial application of Uber Eats and mobile ordering for dine-in service. 
This project uses `React.js`, `Node.js`, `Express`, `EJS`, and `MongoDB` with `Mongoose`.

- Dine-in Ordering (Path: `./Indoor_Ordering`): 
When customers arrive at the restaurant, they can use their phones to scan the QR code corresponding to their table and place an order. Once the order is placed, the data is sent to MongoDB, where it presents the corresponding order, table number, and meals to the kitchen for preparation.

- Food Delivery (Path: `./server`): 
Simulating the operational model of Uber's commercial application, we have built a restaurant and an ordering website similar to Uber Eats. We simulate the entire process of delivering food, from placing orders on a delivery platform to having the delivery personnel bring the meals to customers.



## Features
- Basic RESTful API demonstration
- Dine-In (`React`, `Node.js`, `MongoDB`) - Full-end Structure. 
<div align="center">
    <img src="Indoor_Ordering/git_image/readme/home.png" alt=“Home” />
</div>
- Food Delivery (`EJS`, `Node.js`, `MongoDB`) - One-page website, menu page, and add menu page
<div align="center">
    <img src="server/public/other/basic_structure/Restaurant.png" alt=“Home” />
</div>
- Food Delivery - Ordering systen: (login & registration, cart & checkout, order status)
<div align="center">
    <img src="server/public/other/basic_structure/Order.png" alt=“Order” />
</div>
<div align="center">
    <img src="server/public/other/basic_structure/Order2.png" alt=“Order Detail” />
</div>
<div align="center">
    <img src="server/public/other/basic_structure/Order3.png" alt=“Delivery1” />
</div>
<div align="center">
    <img src="server/public/other/basic_structure/Order4.png" alt=“Delivery2” />
</div>


## Workflow
- Dine-in System
<div align="center">
    <img src="Indoor_Ordering/git_image/readme/workflow.png" alt=“workflow” height="500" width="500"/>
</div>

- Food Delivery
<div align="center">
    <img src="server/public/other/basic_structure/Workflow.png" alt=“Workflow” height="500" width="500"/>
</div>


## Quick Start

1. 
- Dine-in Ordering

    `React`
    ```bash
    npm install axios i18next react react-dom react-i18next react-router-dom react-scripts web-vitals
    ```
    
    `Node.js`
    ```bash
    npm install dotenv bcrypt body-parser cookie-parser cors express jsonwebtoken mongoose morgan multer node-cron nodemon
    ```
    
- Food Delivery
    ```bash
    npm install dotenv express mongoose nodemon jest supertest bcrypt jsonwebtoken ejs cookie-parser multer
    ```

2. Set up environment variables:
- Dine-In: 
   - Create a `.env` file in the project root. Check `Folder Structure` topic at bottom.
   - Add the following environment variables: You can add the IPv4 address rather than localhost (EX: `http://192.168.1.37:3000`) . Make sure close your VPN.
    `React`
     ```
     REACT_APP_Backend_Host=http://YourIPAddress:Port
     REACT_APP_Auth_API_Prefix=/auth
     ```
    
  - Add the following environment variables:
    `Node.js`
     ```
     DB_ConnectionString=YOUR_MongoDB_ConnectionString
     DB_DEFAULT_PORT=YOUR_PORT
     DB_USE=YOUR_DATABAS_ENAME
     LOGGING_JWT_SECRET=Your_Secret_Key
     NODE_ENV=production
     Frontend_Setting=YourFrontEndAddressAndPort
     ```
     
- Food Delivery:
   - Create a `.env` file in the project root. Check `Folder Structure` topic at bottom.
   - Add the following environment variables:
     ```
     DB_USER=yourMongoDBUsername
     DB_PASSWORD=yourMongoDBPassword
     DB_NAME=yourMongoDBClusterName
     DB_USE=yourDatabaseName
     DB_DEFAULT_PORT=3005
     LOGGING_JWT_SECRET=YourSecretKey
     DB_ACCOUNT_PREFIX=/account
     DB_RESTAURANT_PREFIX=/restaurant
     DB_ORDER_PREFIX=/order
     DB_DRIVER_PREFIX=/driver
     GOOGLE_MAP_KEY=Your_Google_MAP_KEY
     ```

3. Make sure MongoDB is running (either locally or via MongoDB Atlas).

4.  Running the Project. Make sure can run the server and unit testing:
    ```bash
    cd server
    npm test
    crtl+C
    npm start
    ```

5. Basic Router
-   Dine-In: The server will run at `http://YourIPAddress:Port`. 
    - Home: `/`
    - Cart: `/Cart`
    - Unpaid Order: `/UnPaidOrder`
-   Food Delivery: The server will run at `http://localhost:3005`. You can use a tool like `Postman` to interact with the API.
    - Account: `/account/register`
    - Restaurant: `/restaurant/home`
    - Order: `/order/OrderHome`

6. Register your account. There is sample at below.
- `Dine-In`: Use register or QR Code login
    ```
    UserName: "a1"
    Preferred Name: "Test"
    Password: "Test@123"
    ```
<div align="center">
    <img src="Indoor_Ordering/git_image/testing_image/TableNo1.png" alt=“Table” height="250" width="250"/>
</div>

- `Food Delivery`
    ```
    UserName: "TestTestTest"
    Password: "Test@123"
    Email: "Test@GBCEats.com"
    Phone: "437-123-4567"
    Address: "123 Dundas St, Toronto, ON"
    ```

7. Enjoy!


## API Endpoints
Check more API detail at `./API_DOCS`
#### 1. **POST: /account/login**
Login router

- **URL**: `/account/login`
- **Method**: `POST`
- **Response**:
    - Status: `200`
    - Body: An array of tasks in JSON format.
```json
[
  {
    "username": "TestTestTest",
    "password": "Test@123", 
}
]
```

## Database Schema
Using `MongoDB` for building collections. Check more database schema detail at `./API_DOCS`

```sql
Table	"FatherField"	Field	    "ChildField"	DataType	Required	Default	 Remark
Cart	                AccountID	            	ObjectId    TRUE                 Account._id
Cart	 Items	        MenuID		                ObjectId    TRUE                 Menu._id
Cart	 Items	        Quantity                    Number      TRUE		            
Cart                    UpdateAt                    Date        TRUE        new Date()	
```

## Folder Structure
The basic structure in my project.
```
├── API_Docs     # API Router and Database Schema
├── Indoor_Ordering/  # Focusing on the in-house dining. It can also use in take-out situation.
│    ├── backend             # Node.js
│    │   ├── model           # The collections of MongoDB
│    │   ├── routes          # Endpoints
│    │   ├── service         # Daily or Timer mission
│    │   └── utils           # Common Function
│    ├── frontend/src        # React
│    │   ├── API             # API Frontend to Backend 
│    │   ├── asset           # Font, Image, Language translation(Enlish, French, Chinese)
│    │   ├── component       # Embed Form in Home page 
│    │   ├── container       # Embed UI
│    │   ├── routes          # Different kinds of endpoints
│    │   ├── style           # Global CSS
│    │   ├── utils           # Common Function
│    │   ├── views           # Form
│    │   ├── App.js          # Main
│    │   ├── .env            # Environment Parameter
│    │   ├── i18n.js         # Language Change Setting
│    │   └── index.js  
│    └── git_image          # Git Image
└── OrderFlowManager/ #(Develop Order: Model -> Controller -> Routes -> app)
    ├── component       # UI element
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant
    ├── config          # Config Setting
    ├── controller      # Responsible for handling user input and application logic.
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant
    ├── model       # The collections of MongoDB
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant
    ├── public      # Local Image
    │   ├── core
    │   ├── driver
    │   ├── order
    │   ├── restaurant
    │   └── style
    │       ├──  ......css
    │       └──  App.css    # Global CSS
    ├── routes   
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant
    ├── tests       # Unit Testing File
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant
    ├── utils       #  Useful Function(Verify Token, Calculation, String Split.....)
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant
    ├── views        # UI
    │   ├── core
    │   ├── driver
    │   ├── order
    │   └── restaurant  
    ├── .env            # Environment Parameter
    ├── App.js          # Main
    └── package.json
```

