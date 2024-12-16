import React, { useContext, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { LiaUserCheckSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "./Logo";
import toast from "react-hot-toast";
import axios from "axios";
import { setUserDetails } from "../redux/slices/userSlice";
import Context from "../context";
import { PiHeartStraight } from "react-icons/pi";

const Header = () => {
  const userData = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const nav = useNavigate();
  const context = useContext(Context);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (searchText.trim()) {
      nav(`/search-results?query=${searchText}`);
    }
  };

  const handleLogout = async () => {
    localStorage.clear()
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/logout`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Logout Successful");
        dispatch(setUserDetails(null));
        localStorage.removeItem("sessionStartTime");
        localStorage.removeItem("remainingTime");
        
        // setInterval(() => {
        //   nav("/");
        //   window.location.reload();
        // }, 3000);
        
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#f8f9fa] h-16 shadow-md flex items-center px-4 lg:px-8 z-50">
      <div className="container flex items-center justify-between mx-auto w-full max-w-screen-xl">
        {/* Logo Section */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => nav("/")}
        >
          <Logo w={60} h={60} />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center w-full max-w-lg rounded-full shadow-md bg-white px-3 py-2">
          <input
            className="w-full outline-none text-sm text-gray-700 px-3"
            type="text"
            placeholder="Find your Ethnic Elegance..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div
            className="text-xl bg-orange-500 text-white rounded-full p-2 cursor-pointer"
            onClick={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          >
            <IoIosSearch />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`lg:hidden fixed bottom-0 left-0 w-full bg-white p-4 transition-all duration-300 transform ${
            isSearchOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center rounded-full shadow-md bg-white">
            <input
              className="w-full outline-none text-sm text-gray-700 px-3"
              type="text"
              placeholder="Find your Ethnic Elegance..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <div
              className="text-xl bg-[#ff6f61] text-white rounded-full p-2 cursor-pointer"
              onClick={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            >
              <IoIosSearch />
            </div>
          </div>
        </div>

        {/* Mobile Search Icon */}
        <div
          className="lg:hidden text-2xl text-[#333] cursor-pointer"
          onClick={() => setIsSearchOpen((prev) => !prev)}
        >
          <IoIosSearch />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Profile Menu */}
          <div className="relative" onClick={() => setMenu((prev) => !prev)}>
            {userData?.data?._id && (
              <div className="text-3xl cursor-pointer">
                {userData?.data?.profilepic ? (
                  <img
                    src={userData?.data?.profilepic}
                    alt="profile-pic"
                    className="w-10 h-10 rounded-full shadow-md"
                  />
                ) : (
                  <LiaUserCheckSolid className="text-black" />
                )}
              </div>
            )}

            {menu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-4 z-50 w-48">
                <nav>
                  {userData?.data?.role === "admin" && (
                    <Link
                      to="/admin-panel/dashboard"
                      className="block py-2 px-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-[#333] rounded transition"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/"
                    className="block py-2 px-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-[#333] rounded transition"
                  >
                    Home
                  </Link>
                  <Link
                    to="/my-account"
                    className="block py-2 px-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-[#333] rounded transition"
                  >
                    Account
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block py-2 px-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-[#333] rounded transition"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-[#333] rounded transition w-full text-left"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="text-3xl relative cursor-pointer">
            {userData?.data?._id && (
              <>
                <div onClick={() => nav("/cart")}>
                  <MdOutlineShoppingCart className="text-[#333]" />
                </div>
                <div className="bg-orange-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center absolute -top-1 -right-2">
                  <p className="text-sm">{context.count}</p>
                </div>
              </>
            )}
          </div>

          {/* WishList Icon */}
          <div className="text-3xl relative cursor-pointer">
            {userData?.data?._id && (
              <>
                <div onClick={() => nav("/wishlist")}>
                  <PiHeartStraight className="text-[#333]" />
                </div>
                <div className="bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center absolute -top-1 -right-2">
                  <p className="text-sm">{context.wishListCount}</p>
                </div>
              </>
            )}
          </div>

          {/* Login/Logout Button */}
          <div>
            {userData?.data?._id ? (
              <button
                className="bg-orange-500 text-white rounded-full px-5 py-2 text-sm hover:bg-[#ff574d] transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="bg-orange-500 text-white rounded-full px-5 py-2 text-sm hover:bg-[#ff574d] transition"
                onClick={() => nav("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
