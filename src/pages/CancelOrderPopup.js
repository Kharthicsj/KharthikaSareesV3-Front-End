import React, { useState } from 'react';
import { RiCloseLargeLine } from "react-icons/ri";
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const CancelOrderPopup = ({ close, orderId, onCancelSuccess }) => {
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        reason: "",
        why: "",
        howCanWeImprove: "",
        confirmCancel: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (data.confirmCancel.toLowerCase() !== "confirm cancel") {
            toast.error('You must type "confirm cancel" exactly to proceed.');
            return;
        }

        setLoading(true);
        try {
            // Step 1: Cancel Order
            const cancelResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/cancel-order`,
                { orderId, ...data },
                { withCredentials: true }
            );

            if (!cancelResponse.data.success) {
                toast.error("Failed to cancel the order.");
                return;
            }

            // Step 2: Update Order Status in DB
            const updateResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/update-order`,
                { orderId, orderStatus: "Cancelled" }, // Send the order ID and new status
                { withCredentials: true }
            );

            if (updateResponse.data.success) {
                toast.success("Order successfully canceled and updated.");
                onCancelSuccess(orderId); // Notify parent component
                close();
            } else {
                toast.error("Failed to update the order status in the database.");
            }
        } catch (err) {
            console.error("Error in handleSubmit:", err.response || err);
            toast.error("An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed bg-gray-500 bg-opacity-30 w-full h-full top-0 left-0 flex justify-center items-center z-50">
            {loading && (
                <div className="absolute inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white bg-opacity-0 p-4">
                        <Loading />
                    </div>
                </div>
            )}

            <div className="p-6 bg-white w-full max-w-lg rounded-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Cancel Order</h2>
                    <div
                        className="cursor-pointer hover:text-orange-500"
                        onClick={close}
                    >
                        <RiCloseLargeLine size={24} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <label htmlFor="reason" className="font-medium">
                        Reason for Cancellation:
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={data.reason}
                        onChange={handleChange}
                        placeholder="Please provide the reason for canceling the order"
                        className="p-2 border border-gray-300 rounded-md w-full"
                        rows="3"
                        required
                    />

                    <label htmlFor="why" className="font-medium">
                        Why did you decide to cancel?
                    </label>
                    <textarea
                        id="why"
                        name="why"
                        value={data.why}
                        onChange={handleChange}
                        placeholder="Explain the reason for cancellation in more detail"
                        className="p-2 border border-gray-300 rounded-md w-full"
                        rows="3"
                        required
                    />

                    <label htmlFor="howCanWeImprove" className="font-medium">
                        How can we improve our service?
                    </label>
                    <textarea
                        id="howCanWeImprove"
                        name="howCanWeImprove"
                        value={data.howCanWeImprove}
                        onChange={handleChange}
                        placeholder="Share your suggestions to help us improve"
                        className="p-2 border border-gray-300 rounded-md w-full"
                        rows="3"
                        required
                    />

                    <label htmlFor="confirmCancel" className="font-medium">
                        Type "confirm cancel" to confirm cancellation:
                    </label>
                    <input
                        type="text"
                        id="confirmCancel"
                        name="confirmCancel"
                        value={data.confirmCancel}
                        onChange={handleChange}
                        placeholder="Type 'Confirm Cancel' exactly"
                        className="p-2 border border-gray-300 rounded-md w-full"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-orange-500 px-4 py-2 text-white rounded-md hover:bg-red-700 transition"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin border-t-4 border-b-4 border-white w-6 h-6 rounded-full border-t-transparent mx-auto"></div>
                        ) : (
                            "Submit Cancellation"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CancelOrderPopup;
