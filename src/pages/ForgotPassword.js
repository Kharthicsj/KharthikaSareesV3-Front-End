import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginGif from '../assets/User.gif';
import Logo from "../assets/KS-Detailed Logo.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get("email");
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // Check if passwords match
        if (passwordData.newPassword === passwordData.confirmNewPassword) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const email = urlParams.get('email'); // Get email from URL query parameter

                // Sending password reset request to backend
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, {
                    email,
                    newPassword: passwordData.newPassword,
                });

                if (response.status === 200) {
                    toast.success("Password has been successfully updated!");
                    navigate('/login'); // Redirect to login page after successful password reset
                }
            } catch (err) {
                toast.error("Error resetting password. Please try again.");
            }
        } else {
            toast.error("Passwords do not match!");
        }
    };

    let passwordIcon = showPassword ? <FaEyeSlash /> : <FaEye />;
    let confirmPasswordIcon = showConfirmPassword ? <FaEyeSlash /> : <FaEye />;

    return (
        <section id="forgot-password" className="mt-20 h-[75vh]">
            <div className="mx-auto container p-4">
                <div className="bg-white p-5 w-full max-w-sm mx-auto">
                    <div className="w-10 h-10 absolute">
                        <img src={LoginGif} alt="LoginGif" />
                    </div>

                    <div className="h-20 ml-14 w-56 mx-auto">
                        <img src={Logo} alt="logo" />
                    </div>

                    <form className="pt-6 flex flex-col gap-2 mt-20" onSubmit={handleFormSubmit}>
                        {emailFromUrl && (
                            <div className="text-center mb-4">
                                <h2 className="font-poppins mt-6">Reset Password for {emailFromUrl}</h2>
                            </div>
                        )}

                        <div className="grid gap-3">
                            <label className="font-semibold">New Password:</label>
                            <div className="bg-slate-100 p-2 flex">
                                <input
                                    className="w-full h-full outline-none bg-transparent"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handleFormChange}
                                    required
                                />
                                <div
                                    className="cursor-pointer text-xl"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {passwordIcon}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <label className="font-semibold">Confirm New Password:</label>
                            <div className="bg-slate-100 p-2 flex">
                                <input
                                    className="w-full h-full outline-none bg-transparent"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    name="confirmNewPassword"
                                    value={passwordData.confirmNewPassword}
                                    onChange={handleFormChange}
                                    required
                                />
                                <div
                                    className="cursor-pointer text-xl"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {confirmPasswordIcon}
                                </div>
                            </div>
                        </div>

                        <button
                            className="bg-orange-500 hover:bg-red-700 text-white py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
                            onClick={handleFormSubmit}
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
