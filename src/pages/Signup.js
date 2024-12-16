import React, { useState } from 'react';
import LoginGif from '../assets/User.gif';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';
import imageTobase64 from '../components/imageTobase64';
import OtpValidatorPopup from './OtpValidatorPopup';
import axios from 'axios';

const Signup = () => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // For button loading state

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    profilepic: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPic = async (event) => {
    const file = event.target.files[0];
    const image = await imageTobase64(file);

    setData((prev) => ({
      ...prev,
      profilepic: image
    }));
  };

  const checkPassword = () => data.password === data.confirm_password;

  const handleNext = async (event) => {
    event.preventDefault();
    if (!checkPassword()) {
      toast.error("Entered Password didn't match");
    } else {
      setLoading(true);
      try {
        // Send OTP request to the backend
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/otp?action=send`, {
          email: data.email,
          username: data.username,
        });

        if (response.status === 200) {
          toast.success("OTP sent successfully!");
          setOpen(true); // Open popup
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const closePopup = () => {
    setOpen(false); // Close popup
  };

  return (
    <section id="signup" className="mt-12">
      <div className="mx-auto container p-5">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden">
            <form>
              <label className="cursor-pointer">
                <input type="file" className="hidden" onChange={handleUploadPic} />
                <img
                  src={data.profilepic || LoginGif}
                  alt="LoginGif"
                  className="cursor-pointer rounded-full"
                />
                <div className="text-xs text-center bg-orange-400 p-0.5 absolute bottom-0 w-full text-white opacity-90">
                  Upload Pic
                </div>
              </label>
            </form>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleNext}>
            <div className="grid gap-3">
              <label className="font-semibold">Username:</label>
              <div className="bg-slate-100 p-2">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  type="text"
                  placeholder="Your username"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3">
              <label className="font-semibold">Email id:</label>
              <div className="bg-slate-100 p-2">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  type="email"
                  placeholder="Your mail id"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3">
              <label className="font-semibold">Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <label className="font-semibold">Confirm Password:</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  className="w-full h-full outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Your Password"
                  name="confirm_password"
                  value={data.confirm_password}
                  onChange={handleChange}
                  required
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button
              className={`bg-orange-500 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 ${loading ? 'cursor-wait' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Next"}
            </button>
          </form>

          <div className="mt-5 font-thin">
            <p>
              Already have an Account?{" "}
              <Link
                to={"/login"}
                className="text-orange-500 hover:text-red-700 hover:font-bold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Popup Component */}
      {open && <OtpValidatorPopup close={closePopup} formData={data} />}
    </section>
  );
};

export default Signup;
