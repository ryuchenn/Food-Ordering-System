import Home from "../views/Home"
import Cart from "../views/public/Cart"
import View404 from "../views/public/View404"
import Login from "../views/auth/Login"
import Register from "../views/auth/Register"
import AddMenuItem from "../views/auth/AddMenuItem"
import Account from "../views/auth/Account"
import MenuDetail from "../container/MenuDetail"
import OrderSearch from "../views/auth/OrderSearch"
import UnPaidOrder from "../views/auth/UnPaidOrder"
import QRCodeLogin from "../views/auth/QRCodeLogin"
import TestLayout from "../views/TestLayout"

export const mainRoutes = [
    {
        path: "/",
        component: Home
    },{
        path: "/QRCodeLogin",
        component: QRCodeLogin
    },{
        path: "/login",
        component: Login
    },{
        path: "/register",
        component: Register
    },{
        path: "/account",
        component: Account
    },{
        path: "/error404",
        component: View404
    },
    
    {
        path: "/cart",
        component: Cart
    },{
        path: "/menu/:id",
        component: MenuDetail
    },

    {
        path: "/AddMenuItem",
        component: AddMenuItem
    },{
        path: "/OrderSearch",
        component: OrderSearch
    },{
        path: "/UnPaidOrder",
        component: UnPaidOrder
    },

    {
        path: "/test",
        component: TestLayout
    }
]

export const userRoutes = [
    
]

export const adminRoutes = [
   
]