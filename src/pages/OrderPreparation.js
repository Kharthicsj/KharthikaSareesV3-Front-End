import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import EditAddressPopup from "./EditAddressPopup";
import AddAddressPopup from "./addAddressPopup";

const OrderPreparation = () => {
    const [cartItems, setCartItems] = useState([]);
    const [editOpen, setEditOpen] = useState(false); //Edit Address Popup menu
    const [open, setOpen] = useState(false) // Add new Address Popup menu
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        profilepic: "",
        address: [],
    });
    const [step, setStep] = useState(1); // Step 1 = Cart Items, Step 2 = Addresses
    const [selectedAddress, setSelectedAddress] = useState(null);

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.selling * item.quantity_present, 0);
        setTotalPrice(total);
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-cart`, {
                    withCredentials: true,
                });
                const data = response.data.data;
                setCartItems(data);
                calculateTotalPrice(data);
            } catch (error) {
                console.error("Failed to fetch cart items", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/account-details`,
                { withCredentials: true }
            );
            setUserData(response?.data?.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddressSelect = (address) => {
        if (selectedAddress === address) {
            setSelectedAddress(null);
            localStorage.removeItem('selectedAddress');
        } else {
            setSelectedAddress(address);
            localStorage.setItem('selectedAddress', JSON.stringify(address));
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            alert("Please select an address before proceeding to payment.");
            return;
        }

        const data = {
            name: userData.name,
            amount: totalPrice * 100,
            number: userData.phone,
            MID: "MID" + Date.now(),
            transactionId: "T" + Date.now(),
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment`, data);
            if (response.data && response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            } else {
                console.error("Redirect URL not found in response", response);
                alert("Something went wrong with the payment. Please try again.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Error occurred during checkout. Please try again later.");
        }
    };

    return (
        <div className="order-preparation-page flex flex-col md:flex-row gap-4 px-4 py-6">
            {loading ? (
                <div className="w-full text-center text-gray-700">Loading data...</div>
            ) : (
                <>
                    {step === 1 ? (
                        <>
                            {/* Cart Items Section */}
                            <div className="cart-items-section flex-grow bg-gray-100 rounded-lg p-8">
                                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                                {cartItems.length === 0 ? (
                                    <p>No items in the cart.</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="cart-item flex items-center border-b border-gray-300 pb-4 mb-4"
                                        >
                                            <div className="item-image w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="item-details flex-grow ml-4">
                                                <h3 className="font-semibold text-lg">{item.productName}</h3>
                                                <p className="text-gray-900 font-sans text-lg">
                                                    Price: ₹{item.selling}
                                                </p>
                                                <p className="text-gray-900 font-sans text-lg">
                                                    Quantity: {item.quantity_present}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Total Price Section */}
                            <div className="total-price-section w-full md:w-1/3 bg-white rounded-lg p-8">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="mb-4">
                                    <p className="text-gray-600 text-lg">Total Price:</p>
                                    <p className="text-2xl font-bold">₹{totalPrice}</p>
                                </div>
                                <button
                                    className="w-full mt-6 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
                                    onClick={() => setStep(2)}
                                >
                                    Proceed to Address Selection
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {open && (
                                <div className="absolute top-0 left-0 right-0 z-50">
                                    <AddAddressPopup close={() => setOpen(false)} fetchData={fetchUser} />
                                </div>
                            )}

                            {/* Address Section */}
                            <div className="address-section flex-grow bg-gray-100 rounded-lg p-8">
                                <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
                                {userData.address.length === 0 ? (
                                    <p>No saved addresses found.</p>
                                ) : (
                                    userData.address.map((address, index) => (
                                        <div
                                            key={index}
                                            className={`address-card bg-white shadow-lg rounded-lg p-6 mb-6 relative cursor-pointer ${selectedAddress === address ? "border-2 border-blue-500" : ""
                                                }`}
                                            onClick={() => handleAddressSelect(address)}
                                        >
                                            {editOpen && editOpen.id === address._id && (
                                                <div className="absolute top-0 left-0 right-0 z-50">
                                                    <EditAddressPopup
                                                        close={() => setEditOpen(null)}
                                                        fetchData={fetchUser}
                                                        userData={{
                                                            addressName: address.addressName || "",
                                                            type: address.type || "",
                                                            fullname: address.fullname || "",
                                                            phone: address.phone || "",
                                                            addressContent: address.addressContent || "",
                                                            state: address.state || "",
                                                            pincode: address.pincode || "",
                                                            email: address.email || "",
                                                            landmark: address.landmark || "",
                                                        }}
                                                        id={address._id}
                                                    />
                                                </div>
                                            )}
                                            {/* Pencil Icon at Top Right */}
                                            <FaPencilAlt
                                                className="absolute top-2 right-2 text-gray-600 cursor-pointer"
                                                size={16}
                                                onClick={() => setEditOpen({ id: address._id, data: address })}
                                            />
                                            <h3 className="font-semibold text-lg">{address.addressName}</h3>
                                            <p className="text-gray-900">{address.fullname}</p>
                                            <p className="text-gray-600">{address.addressContent}</p>
                                            <p className="text-gray-600">Landmark: {address.landmark}</p>
                                            <p className="text-gray-600">Pincode: {address.pincode}</p>
                                            <p className="text-gray-600">State: {address.state}</p>
                                            <p className="text-gray-600">Phone: {address.phone}</p>
                                            <p className="text-gray-600">Type: {address.type}</p>
                                        </div>
                                    ))
                                )}
                                {/* Add New Address Button */}
                                <div className="add-address-button w-full md:w-1/3 bg-gray-100 rounded-lg p-8 md:mt-6">
                                    <button
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                                        onClick={() => setOpen(true)}
                                    >
                                        + New Address
                                    </button>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="action-section w-full md:w-1/3 bg-white rounded-lg p-8">
                                <h2 className="text-xl font-semibold mb-4">Address Summary</h2>
                                {selectedAddress ? (
                                    <div>
                                        <h3 className="font-semibold text-lg">{selectedAddress.addressName}</h3>
                                        <p className="text-gray-900">{selectedAddress.fullname}</p>
                                        <p className="text-gray-600">{selectedAddress.addressContent}</p>
                                        <p className="text-gray-600">Landmark: {selectedAddress.landmark}</p>
                                        <p className="text-gray-600">Pincode: {selectedAddress.pincode}</p>
                                        <p className="text-gray-600">State: {selectedAddress.state}</p>
                                        <p className="text-gray-600">Phone: {selectedAddress.phone}</p>
                                        <p className="text-gray-600">Type: {selectedAddress.type}</p>
                                    </div>
                                ) : (
                                    <p>Please select an address.</p>
                                )}
                                {/* Total Price Section */}
                                <h2 className="text-xl font-semibold mt-10">Order Summary</h2>
                                <div className="mb-4">
                                    <p className="text-gray-600 text-lg">Total Price:</p>
                                    <p className="text-2xl font-bold">₹{totalPrice}</p>
                                </div>

                                <button
                                    className="w-full mt-6 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Payment
                                </button>
                                <button
                                    className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                                    onClick={() => setStep(1)}
                                >
                                    Back to Cart
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderPreparation;
