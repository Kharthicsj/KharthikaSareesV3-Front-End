import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import EmptyCart from "../components/EmptyCart";
import BackgroundAnimation from "../components/CartAnimatedBG";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-cart`, { withCredentials: true });
        const data = response.data.data;

        const filteredItems = data.filter((item) => item.total_quantity > 0);
        setCartItems(filteredItems);

        calculateTotalPrice(data);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/remove-from-cart`, { productId }, { withCredentials: true });
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
    } catch (error) {
      console.error("Failed to remove product from cart", error);
    } finally {
      window.location.reload()
    }
  };

  const handleQuantityChange = async (productId, action, availableStock) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        if (action === "increase" && item.quantity_present < availableStock) {
          item.quantity_present += 1;
        } else if (action === "decrease" && item.quantity_present > 1) {
          item.quantity_present -= 1;
        }
      }
      return item;
    });

    setCartItems(updatedItems);

    try {
      const updatedItem = updatedItems.find(item => item.productId === productId);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-cart`,
        {
          productId: updatedItem.productId,
          quantity_present: updatedItem.quantity_present
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        calculateTotalPrice(updatedItems);
      }
    } catch (error) {
      console.error("Failed to update product quantity", error);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.selling * item.quantity_present, 0);
    setTotalPrice(total);
  };

  const handleContinueShopping = () => {
    navigate("/"); // Redirect to the home page
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <BackgroundAnimation />
      <div className="container mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EmptyCart />
            </div>
            <div className="text-xl text-gray-500 mb-4">Your cart is empty!</div>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleContinueShopping}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800">Your Shopping Cart</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="transition-transform transform hover:scale-105 hover:shadow-2xl bg-white rounded-lg p-6 shadow-xl relative group"
                >
                  <div className="overflow-hidden rounded-lg mb-4 transition-all duration-500 transform group-hover:scale-110">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-72 object-cover rounded-lg group-hover:opacity-80 transition-opacity duration-300"
                    />
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="text-red-600 hover:text-red-800 transition duration-200 p-2 rounded-full"
                    >
                      <AiOutlineDelete className="w-6 h-6" />
                    </button>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-4">{item.productName}</h3>
                  <p className="text-gray-600 mt-2">Actual Price: <span className="font-bold text-gray-800">₹{item.price}</span></p>
                  <p className="text-gray-600">Selling Price: <span className="font-bold text-gray-800">₹{item.selling}</span></p>
                  <p className="text-gray-600">Available: <span className="font-semibold">{item.total_quantity}</span></p>
                  <div className="flex justify-between items-center mt-4">
                    <h2>Quantity</h2>
                    <div className="flex items-center gap-4">
                      {item.quantity_present > 1 && (
                        <button
                          onClick={() => handleQuantityChange(item.productId, "decrease", item.total_quantity)}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                          -
                        </button>
                      )}
                      <span className="text-lg font-semibold">{item.quantity_present}</span>
                      {item.quantity_present < item.total_quantity && (
                        <button
                          onClick={() => handleQuantityChange(item.productId, "increase", item.total_quantity)}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                          +
                        </button>
                      )}
                    </div>
                    <span className="text-lg font-semibold">₹{item.selling * item.quantity_present}</span>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      to={`/product/${item.productId}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between items-center border-t pt-4">
              <div className="text-xl font-semibold">Total Price:</div>
              <div className="text-3xl text-green-600">₹{totalPrice}</div>
            </div>
            {cartItems.length > 0 && (
              <div className="mt-6 flex justify-center gap-6">
                <button
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={() => navigate("/order-preparation")}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
