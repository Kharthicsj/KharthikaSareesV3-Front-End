import React, { useEffect, useState } from 'react';
import OrderPlaced from '../components/OrderPlaced';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";

const OrderSuccessful = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionId, setTransactionId] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.selling * item.quantity_present, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionIdFromUrl = queryParams.get('transactionId');
    if (transactionIdFromUrl) {
      setTransactionId(transactionIdFromUrl);
    } else {
      alert("No transaction ID found! You cannot proceed with the order.");
      navigate("/");
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-cart`, { withCredentials: true });
        const data = response.data.data;
        setCartItems(data);
        calculateTotalPrice(data);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
        setErrorMessage("Failed to load cart items. Please try again.");
      }
    };

    fetchCartItems();
  }, [location.search, navigate]);

  useEffect(() => {
    if (
      transactionId &&
      cartItems.length > 0 &&
      totalPrice > 0 &&
      !isOrderPlaced &&
      !isRequestSent
    ) {
      const storedAddress = JSON.parse(localStorage.getItem('selectedAddress'));

      if (storedAddress) {
        const productsWithDetails = cartItems.map((item) => ({
          _id: item.productId,
          quantity: item.quantity_present,
          productName: item.productName,
          category: item.category || "Unknown Category",
          fabric: item.fabric || "Unknown Fabric",
          productImage: item.productImage,
          description: item.description,
          price: item.price,
          selling: item.selling,
        }));

        const orderData = {
          products: productsWithDetails,
          totalPrice: totalPrice,
          address: storedAddress,
          transactionId: transactionId || "",
        };

        console.log("Order Data Payload:", orderData);

        setIsRequestSent(true);

        axios.post(`${process.env.REACT_APP_API_URL}/new-order`, orderData, { withCredentials: true })
          .then((response) => {
            console.log("Order placed successfully:", response.data);
            setIsOrderPlaced(true);
          })
          .catch((error) => {
            console.error("Error while placing the order:", error);
            setIsRequestSent(false);
            setErrorMessage("There was an issue placing your order. Please try again.");
          });
      }
    }
  }, [cartItems, totalPrice, transactionId, isOrderPlaced, isRequestSent]);

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className='bg-white'>
      {isOrderPlaced ? (
        <div>
          <OrderPlaced />
          <Link to={"/my-orders"} 
          className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2">My orders page</Link>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default OrderSuccessful;
