import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useCallback, useRef, useState } from "react";
import Context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails, setSessionExpired } from "./redux/slices/userSlice";
import axios from "axios";

function App() {
    const dispatch = useDispatch();
    const isErrorLogged = useRef(false);
    const [count, setCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [wishListCount, setWishListCount] = useState(0);
    const [wishListItems, setWishListItems] = useState([]);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/account-details`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    dispatch(setUserDetails(data));
                    const storedStartTime = localStorage.getItem("sessionStartTime");
                    if (!storedStartTime) {
                        const currentTime = Date.now();
                        localStorage.setItem("sessionStartTime", currentTime);
                        setSessionStartTime(currentTime);
                    } else {
                        setSessionStartTime(Number(storedStartTime));
                    }
                }
            } else if (response.status === 401) {
                if (!isErrorLogged.current) {
                    isErrorLogged.current = true;
                    console.log("No active session detected. User is not logged in.");
                    dispatch(setSessionExpired());
                    localStorage.removeItem("sessionStartTime");
                }
            } else {
                const errorData = await response.json();
                console.error(`Error ${response.status}: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Network error:", err.message);
        }
    }, [dispatch]);

    const fetchUserAddtoCart = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/count-cart`, { withCredentials: true });
            setCount(response?.data?.data?.count || 0);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-cart`, { withCredentials: true });
            setCartItems(response?.data?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchWishlistCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/count-wishlist`, { withCredentials: true });
            setWishListCount(response?.data?.data?.count || 0);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchWishlistItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-wishlist`, { withCredentials: true });
            setWishListItems(response?.data?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (sessionStartTime) {
            const sessionDuration = 1 * 60 * 60 * 1000;
            const timerInterval = setInterval(() => {
                const currentTime = Date.now();
                const remainingTime = sessionStartTime + sessionDuration - currentTime;

                if (remainingTime > 0) {
                    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
                    const seconds = Math.floor((remainingTime / 1000) % 60);

                    setRemainingTime({ hours, minutes, seconds });
                    const updatedRemainingTime = { hours, minutes, seconds };

                    localStorage.setItem("remainingTime", JSON.stringify(updatedRemainingTime));
                    
                } else {
                    dispatch(setSessionExpired());
                    localStorage.removeItem("sessionStartTime");
                    localStorage.removeItem("remainingTime");

                    toast.error("Your session has expired. Please log in again.", {
                        style: { fontSize: "14px", width: "700px" },
                    });

                    setTimeout(() => {
                        toast.loading("Refreshing...", {
                            style: { fontSize: "14px", width: "700px" },
                            duration: 3000,
                        });
                    }, 1000);

                    setTimeout(() => {
                        window.location.reload();
                    }, 4000);

                    clearInterval(timerInterval);
                }
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [sessionStartTime, dispatch]);

    useEffect(() => {
        fetchUser();
        fetchUserAddtoCart();
        fetchCartItems();
        fetchWishlistCount();
        fetchWishlistItems();
    }, [fetchUser]);

    return (
        <Context.Provider
            value={{
                fetchUser,
                count,
                fetchUserAddtoCart,
                cartItems,
                fetchCartItems,
                wishListCount,
                wishListItems,
                fetchWishlistItems,
                remainingTime
            }}
        >
            <Toaster position="top-center" />
            <Header />
            <main className="min-h-[calc(100vh)] pt-16">
                <Outlet />
            </main>
            <Footer />
        </Context.Provider>
    );
}

export default App;
