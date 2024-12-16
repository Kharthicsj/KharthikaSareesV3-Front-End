import React, { useContext } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import context from "../context";
import toast from "react-hot-toast";
import {
  addProductToCart,
  removeProductFromCart,
} from "../helpers/cartHelper";
import {
  addProductToWishList,
  removeProductFromWishList,
} from "../helpers/wishListHelper";

const SliderCard = ({ product }) => {
  const Context = useContext(context);

  if (!product) {
    return null;
  }

  const { productName, description, price, selling, productImage, _id } =
    product;

  const isInCart = (productId) => {
    return Context.cartItems.some(
      (cartItem) => cartItem.productId === productId
    );
  };

  const isInWishlist = (productId) => {
    return Context.wishListItems.some(
      (wishlistItem) => wishlistItem.productId === productId
    );
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    try {
      await addProductToCart(productId);
      Context.fetchCartItems();
    } catch (error) {
      console.error("Failed to add product to cart", error);
      toast.error("⚠️ Oops! Could not add item to cart. Try again!");
    }
  };

  const handleRemoveFromCart = async (e, productId) => {
    e.preventDefault();
    try {
      await removeProductFromCart(productId);
      Context.fetchCartItems();
      toast.success("🚮 Item removed from cart! ✌️");
    } catch (error) {
      console.error("Failed to remove product from cart", error);
      toast.error("⚠️ Oops! Could not remove item. Try again!");
    }
  };

  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault();
    try {
      await addProductToWishList(productId);
      Context.fetchWishlistItems();
    } catch (error) {
      console.error("Failed to add product to wishlist", error);
      toast.error("⚠️ Oops! Could not add item to wishlist. Try again!");
    }
  };

  const handleRemoveFromWishlist = async (e, productId) => {
    e.preventDefault();
    try {
      await removeProductFromWishList(productId);
      Context.fetchWishlistItems();
    } catch (error) {
      console.error("Failed to remove product from wishlist", error);
      toast.error("⚠️ Oops! Could not remove item. Try again!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex items-center mx-2 gap-4 p-4 relative">
      {/* Wishlist Icon */}
      <button
        className={`absolute top-2 right-2 w-8 h-8 rounded-full ${
          isInWishlist(_id)
            ? "bg-red-500 text-white"
            : "bg-white border-2 border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white"
        } flex items-center justify-center transition-all shadow-md`}
        onClick={(e) =>
          isInWishlist(_id)
            ? handleRemoveFromWishlist(e, _id)
            : handleAddToWishlist(e, _id)
        }
      >
        <FaHeart />
      </button>

      <img
        src={productImage?.[0] || "https://via.placeholder.com/150"}
        alt={productName || "Product Image"}
        className="w-1/3 h-40 rounded-lg object-cover"
      />
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {productName || "Unnamed Product"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {description || "No description available."}
          </p>
          <div className="mt-2">
            <span className="text-gray-500 font-bold text-sm line-through">
              ₹{price || "N/A"}
            </span>
            <span className="text-orange-600 font-bold text-lg ml-2">
              ₹{selling || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Link
            to={"/product/" + _id}
            className="bg-orange-500 text-white font-bold py-1 px-4 rounded-lg hover:bg-orange-600 transition-all"
          >
            Explore
          </Link>
          <button
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              isInCart(_id)
                ? "border-green-500 text-green-500 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                : "border-orange-500 text-orange-500 hover:bg-green-500 hover:text-white hover:border-green-500"
            } text-xl transition-all transform hover:scale-110 shadow-lg`}
            onClick={(e) =>
              isInCart(_id)
                ? handleRemoveFromCart(e, _id)
                : handleAddToCart(e, _id)
            }
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
