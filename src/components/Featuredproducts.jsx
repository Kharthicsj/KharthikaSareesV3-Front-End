import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";
import { addProductToCart, removeProductFromCart } from "../helpers/cartHelper";
import { addProductToWishList, removeProductFromWishList } from "../helpers/wishListHelper";
import context from "../context";
import toast from "react-hot-toast";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const Context = useContext(context);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/featured-products`
        );
        const availableProducts = response.data.filter(
          (product) => product.quantity > 0
        );

        const shuffledProducts = availableProducts.sort(
          () => Math.random() - 0.5
        );

        const productsToShow = [];

        for (
          let i = 0;
          productsToShow.length < 10 && i < shuffledProducts.length;
          i++
        ) {
          const product = shuffledProducts[i];
          if (product.quantity > 0) {
            productsToShow.push(product);
          }
        }

        setFeaturedProducts(productsToShow);
      } catch (error) {
        console.log("Error fetching featured products", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

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
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
    <div className="featured-products-section my-8 px-6 lg:px-24 xl:px-32">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Featured Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
        {featuredProducts.map((product) => (
          <div
            key={product._id}
            className="relative bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-2xl border border-gray-200"
          >
            <div className="relative">
              <img
                className="object-cover w-full h-40 sm:h-44 md:h-48 lg:h-64 xl:h-72 rounded-t-lg transition-all duration-500"
                src={product.productImage[0]}
                alt={product.productName || "Product image"}
              />
              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
                <h2 className="text-white text-lg font-semibold truncate">
                  {product.productName || "Product Name"}
                </h2>
              </div>
              <div className="absolute top-2 right-2">
                {isInWishlist(product._id) ? (
                  <IoIosHeart
                    className="text-red-500 text-2xl cursor-pointer"
                    onClick={(e) => handleRemoveFromWishlist(e, product._id)}
                  />
                ) : (
                  <IoIosHeartEmpty
                    className="text-gray-500 text-2xl hover:text-red-500 cursor-pointer"
                    onClick={(e) => handleAddToWishlist(e, product._id)}
                  />
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="text-sm font-poppins">
                <p>{product.category}</p>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <span className="text-sm font-medium text-gray-500 line-through">
                  ₹{product.price || "Price"}
                </span>
                <span className="text-xl font-bold text-orange-600">
                  ₹{product.selling || "Selling Price"}
                </span>
              </div>
              <div className="line-clamp-1 text-md font-poppins">
                <p>{product.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isInCart(product._id)
                      ? "border-green-500 text-green-500 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                      : "border-orange-500 text-orange-500 hover:bg-green-500 hover:text-white hover:border-green-500"
                  } text-xl transition-all transform hover:scale-110 shadow-lg`}
                  onClick={(e) =>
                    isInCart(product._id)
                      ? handleRemoveFromCart(e, product._id)
                      : handleAddToCart(e, product._id)
                  }
                >
                  <FaShoppingCart />
                </button>
                <Link
                  to={"/product/" + product._id}
                  className="py-2 px-4 bg-orange-600 text-white text-xs md:text-sm rounded-md hover:bg-orange-700 transition-all duration-300 transform hover:scale-110"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
