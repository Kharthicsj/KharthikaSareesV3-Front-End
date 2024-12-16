import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/adminpanel/AllUsers';
import Products from '../pages/adminpanel/Products';
import FabricProduct from '../pages/FabricProduct';
import Dashboard from '../pages/adminpanel/Dashboard';
import OutofStock from '../pages/adminpanel/OutofStock';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SearchProducts from '../pages/SearchProducts';
import WishList from '../pages/WishList';
import BannerImage from '../pages/adminpanel/BannerImage';
import Account from '../pages/Account';
import Orders from '../pages/Orders';
import OrderPreparation from '../pages/OrderPreparation';
import OrderSuccessful from '../pages/OrderSuccessful';
import AllOrders from '../pages/adminpanel/AllOrders';
import ForgotPassword from '../pages/ForgotPassword';
import ShippingPolicy from '../pages/ShippingPolicy';
import RefundAndCancellation from '../pages/Refund&Cancellation';
import TermsAndConditions from '../pages/TermsAndConditions';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children : [
            {
                path : "",
                element : <Home />
            },
            {
                path : "/login",
                element : <Login />
            },
            {
                path : "/signup",
                element : <Signup />
            },
            {
                path : "/search-results",
                element : <SearchProducts />
            },
            {
                path : "/product-fabric/:fabric",
                element : <FabricProduct />
            },
            {
                path : "/product/:id",
                element : <ProductDetails />
            },
            {
                path : "/admin-panel",
                element : <AdminPanel />,
                children : [
                    {
                        path : "all-users",
                        element : <AllUsers />
                    },
                    {
                        path : "products",
                        element : <Products />
                    },
                    {
                        path : "dashboard",
                        element : <Dashboard />
                    },
                    {
                        path : "out-of-stock",
                        element : <OutofStock />
                    },
                    {
                        path : "banner",
                        element : <BannerImage />
                    },
                    {
                        path: "all-orders",
                        element: <AllOrders />
                    }
                ]
            },
            {
                path : "/cart",
                element : <Cart />
            },
            {
                path : "/wishlist",
                element : <WishList />
            },
            {
                path : "/my-account",
                element : <Account />
            },
            {
                path : "/my-orders",
                element : <Orders />
            },
            {
                path : "/order-preparation",
                element : <OrderPreparation />
            },
            {
                path : "/order-successful",
                element: <OrderSuccessful />
            },
            {
                path : "forgot-password",
                element : <ForgotPassword />
            },
            {
                path : "/Shippingpolicy",
                element: <ShippingPolicy />
            },
            {
                path : "/refundpolicy",
                element: <RefundAndCancellation />
            },
            {
                path: "/terms&conditions",
                element: <TermsAndConditions />
            }
        ]
    }
]);

export default router;