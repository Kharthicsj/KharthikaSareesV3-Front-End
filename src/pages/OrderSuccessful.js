import React, { useEffect, useState } from 'react';
import OrderPlaced from '../components/OrderPlaced';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessful = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionId, setTransactionId] = useState(null); 
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false); 
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
          });
      }
    }
  }, [cartItems, totalPrice, transactionId, isOrderPlaced, isRequestSent]);

  return (
    <div className='bg-white'>
      <OrderPlaced />
    </div>
  );
};

export default OrderSuccessful;
