import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CancelOrderPopup from './CancelOrderPopup';
import Loading from '../components/Loading';

const Orders = () => {
    const [orderData, setOrderData] = useState([]);
    const [openCancel, setOpenCancel] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Define the selected order ID
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrderData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/my-orders`, { withCredentials: true });
                setOrderData(response?.data?.data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, []);

    const handleCancelSuccess = (orderId) => {
        setOrderData((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId
                    ? { ...order, orderStatus: "Cancelled" }
                    : order
            )
        );
    };

    if(loading) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <h1 className="text-2xl font-semibold text-center mb-6">Your Order History</h1>
            <div className="container mx-auto px-4">
                {orderData.length > 0 ? (
                    orderData.map((order) => (
                        <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Order ID: <span className="font-medium">{order._id}</span></p>
                                    <p className="text-gray-500 text-sm">
                                        Ordered On: <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Cancel Order Button */}
                                    {order.orderStatus === 'Pending' && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrderId(order._id); // Set the selected order ID
                                                setOpenCancel(true);
                                            }}
                                            className="px-4 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {/* Order Status */}
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${order.orderStatus === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : order.orderStatus === 'Cancelled'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600'
                                            }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                                <p className="text-gray-500 text-sm">{order.address.fullname}</p>
                                <p className="text-gray-500 text-sm">{order.address.addressContent}</p>
                                <p className="text-gray-500 text-sm">{order.address.landmark}</p>
                                <p className="text-gray-500 text-sm">Pincode: {order.address.pincode}</p>
                                <p className="text-gray-500 text-sm">Phone: {order.address.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Products</h3>
                                {order.product.map((product) => (
                                    <div key={product._id} className="flex items-center gap-4 mb-3">
                                        <img
                                            src={product.productImage[0]}
                                            alt={product.productName}
                                            className="w-20 h-20 object-cover rounded-md border"
                                        />
                                        <div>
                                            <h4 className="font-medium text-gray-800">{product.productName}</h4>
                                            <p className="text-gray-500 text-sm">Price: ₹{product.selling}</p>
                                            <p className="text-gray-500 text-sm">Quantity: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t pt-4 mt-4">
                                <p className="text-gray-700 font-medium">Total: ₹{order.total}</p>
                                {order.transactionId && (
                                    <p className="text-sm text-gray-500">Transaction ID: {order.transactionId}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-10">
                        <p className="text-lg">Oops! No orders found.</p>
                    </div>
                )}
            </div>
            {/* Cancel Order Popup */}
            {openCancel && selectedOrderId && (
                <CancelOrderPopup
                    close={() => setOpenCancel(false)}
                    orderId={selectedOrderId}
                    onCancelSuccess={handleCancelSuccess} // Notify parent on success
                />
            )}
        </div>
    );
};

export default Orders;
