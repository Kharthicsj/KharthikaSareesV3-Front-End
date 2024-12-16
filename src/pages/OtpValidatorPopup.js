import React, { useState, useEffect } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpValidatorPopup = ({ close, formData }) => {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(120);
    const [resendCount, setResendCount] = useState(0);
    const [resendDisabled, setResendDisabled] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval); // Cleanup interval
        } else {
            setResendDisabled(false); // Enable resend button after timer ends
        }
    }, [timer]);

    const handleResendOtp = async () => {
        if (resendCount >= 5) {
            toast.error("You have reached the maximum resend attempts.");
            return;
        }

        setLoading(true);
        try {
            // Resend OTP API call
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/otp?action=resend`, {
                email: formData.email,
                username: formData.username,
            });

            if (response.status === 200) {
                toast.success("OTP resent successfully!");
                setResendCount((prev) => prev + 1); // Increment resend count
                setTimer(120); // Reset timer
                setResendDisabled(true); // Disable resend button until timer ends
            }
        } catch (err) {
            console.error("Error resending OTP:", err);
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/otp?action=validate`,
                { otp },
                { withCredentials: true }
            );

            // If OTP is validated successfully, submit the form data
            if (response.status === 200) {
                toast.success("OTP Verified Successfully!");

                // Now send formData to signup API
                handleFormSubmit();
                close();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP validation failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async () => {
        const userData = {
            name: formData.username,
            email: formData.email,
            password: formData.password,
            profilepic: formData.profilepic
        };
    
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, userData);
            if (res.status === 201) {
                toast.success("User created Successfully");
    
                let countdown = 3;  // Timer countdown for the redirect
                const toastId = toast.loading("Redirecting to Login page...");
    
                // Update the toast every second
                const intervalId = setInterval(() => {
                    if (countdown > 0) {
                        toast.dismiss(toastId);  // Dismiss previous toast
                        toast.loading(`Redirecting to Login page in ${countdown}...`, { id: toastId });  // Show updated toast with countdown
                        countdown--;
                    } else {
                        clearInterval(intervalId);  // Stop the interval when the countdown reaches 0
                        nav("/login");  // Navigate to login
                        toast.dismiss(toastId);  // Dismiss the toast
                    }
                }, 1000);  // Update every second
            }
        } catch (err) {
            const msg = err.response?.data?.message;
            if (msg?.includes("User already exists, Kindly Login.")) {
                toast.error("User already exists, Kindly Login.");
            }
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <div className="fixed bg-black bg-opacity-50 w-full h-full top-0 left-0 flex justify-center items-center z-50">
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Validate OTP</h2>
                    <button onClick={close} className="text-gray-500 hover:text-gray-700">
                        <RiCloseLargeLine size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            Enter OTP:
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="Enter the OTP sent to your email"
                            required
                        />
                    </div>

                    <div className="text-sm text-gray-600">
                        {timer > 0 ? (
                            <p>Request a new OTP in: <span className="font-bold">{`${Math.floor(timer / 60)}:${timer % 60}`}</span></p>
                        ) : (
                            <button
                                type="button"
                                className="text-orange-500 hover:text-orange-700"
                                onClick={handleResendOtp}
                                disabled={loading || resendDisabled}
                            >
                                Resend OTP
                            </button>
                        )}
                        {resendCount >= 5 && (
                            <p className="text-red-500">You have reached the maximum resend attempts.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin border-t-4 border-b-4 border-white w-5 h-5 rounded-full mx-auto"></div>
                        ) : (
                            "Validate OTP"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpValidatorPopup;
