import React, { useState, useEffect } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordValidator = ({ close }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(120);
    const [resendCount, setResendCount] = useState(0);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [isOtpSent, setIsOtpSent] = useState(false); 
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

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            // Send OTP API call
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgot-password-otp?action=send`, { email });

            if (response.status === 200) {
                toast.success("OTP sent successfully!");
                setIsOtpSent(true); 
                setTimer(120); 
                setResendDisabled(true);
            }
        } catch (err) {
            console.error("Error sending OTP:", err);
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCount >= 5) {
            toast.error("You have reached the maximum resend attempts.");
            return;
        }

        setLoading(true);
        try {
            // Resend OTP API call
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgot-password-otp?action=resend`, { email });

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
                `${process.env.REACT_APP_API_URL}/forgot-password-otp?action=validate`,
                { otp, email },
                { withCredentials: true }
            );

            // If OTP is validated successfully
            if (response.status === 200) {
                toast.success("OTP Verified Successfully!");

                // Redirect to Forgot Password page with email for security
                nav(`/forgot-password?email=${encodeURIComponent(email)}`);
                close();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP validation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bg-black bg-opacity-50 w-full h-full top-0 left-0 flex justify-center items-center z-50">
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Forgot Password</h2>
                    <button onClick={close} className="text-gray-500 hover:text-gray-700">
                        <RiCloseLargeLine size={24} />
                    </button>
                </div>

                {!isOtpSent ? (
                    // Show email input form
                    <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Enter your Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin border-t-4 border-b-4 border-white w-5 h-5 rounded-full mx-auto"></div>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </form>
                ) : (
                    // Show OTP input form after OTP is sent
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
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordValidator;
