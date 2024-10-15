import Home from "../views/Home"
import Cart from "../views/public/Cart"
import View404 from "../views/public/View404"
import Login from "../views/auth/login"
import Logout from "../views/auth/logout"
import Register from "../views/auth/register"
import AddMenuItem from "../views/auth/AddMenuItem"
import Account from "../views/auth/Account"

export const mainRoutes = [
    {
        path: "/",
        component: Home
    },{
        path: "/login",
        component: Login
    },{
        path: "/register",
        component: Register
    },{
        path: "/logout",
        component: Logout
    },{
        path: "/account",
        component: Account
    },{
        path: "/error404",
        component: View404
    }
]

export const userRoutes = [
    {
        path: "/cart",
        component: Cart
    }
]

export const adminRoutes = [
    {
        path: "/AddMenuItem",
        component: AddMenuItem
    }
]