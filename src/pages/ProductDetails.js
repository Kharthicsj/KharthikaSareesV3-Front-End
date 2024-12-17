import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { AiOutlineHeart } from 'react-icons/ai';
import EthnicHandloomSarees from '../components/EthnicHandloomSarees';
import EthnicHandloomChudis from '../components/EthnicHandloomChudis';
import context from '../context';
import toast from 'react-hot-toast';
import { addProductToCart, removeProductFromCart } from "../helpers/cartHelper";
import { addProductToWishList, removeProductFromWishList } from '../helpers/wishListHelper';


const ProductDetails = () => {

  const Context = useContext(context);
  const nav = useNavigate();

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
    setLoading(true);
    try {
      await addProductToCart(productId);
      Context.fetchCartItems();
    } catch (error) {
      console.error("Failed to add product to cart", error);
      toast.error("⚠️ Oops! Could not add item to cart. Try again!");
    } finally {
      setLoading(false)
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleRemoveFromCart = async (e, productId) => {
    setLoading(true)
    e.preventDefault();
    try {
      await removeProductFromCart(productId);
      Context.fetchCartItems();
      toast.success("🚮 Item removed from cart! ✌️");
    } catch (error) {
      console.error("Failed to remove product from cart", error);
      toast.error("⚠️ Oops! Could not remove item. Try again!");
    } finally {
      setLoading(false)
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleAddToWishlist = async (e, productId) => {
    setLoading(true);
    e.preventDefault();
    try {
      await addProductToWishList(productId);
      Context.fetchWishlistItems();
    } catch (error) {
      console.error("Failed to add product to wishlist", error);
      toast.error("⚠️ Oops! Could not add item to wishlist. Try again!");
    } finally {
      setLoading(false)
    }
  };

  const handleRemoveFromWishlist = async (e, productId) => {
    setLoading(true)
    e.preventDefault();
    try {
      await removeProductFromWishList(productId);
      Context.fetchWishlistItems();
    } catch (error) {
      console.error("Failed to remove product from wishlist", error);
      toast.error("⚠️ Oops! Could not remove item. Try again!");
    } finally {
      setLoading(false)
    }
  };

  const [product, setProduct] = useState({
    productName: "",
    category: "",
    fabric: "",
    productImage: [],
    description: "",
    price: "",
    selling: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const params = useParams();
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  })
  const [zoomImage, setZoomImage] = useState(false)
  const [activeTab, setActiveTab] = useState('Sizing');

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/getProductDetails`, params);
        const data = response?.data;
        const product = data?.data;
        setProduct(product);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params]);

  const handleImageClick = (index) => {
    setActiveImage(index); // Change active image on click
  };

  const handleZoomImage = useCallback((e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({
      x,
      y
    });

    setZoomImage(true);
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Section: Image Gallery */}
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-lg mb-6">
            <img
              src={product.productImage[activeImage]}
              alt="Main Product"
              className="w-full h-[500px] object-cover rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              style={{ cursor: 'crosshair' }}
            />
          </div>

          {zoomImage && (
            <div
              className="hidden lg:block absolute min-w-[300px] min-h-[300px] p-1 right-[230px] top-[120px] z-50 scale-125 overflow-hidden"
              style={{
                transform: 'scale(1.7)',
                transition: 'transform 0.2s ease',
              }}
            >
              <div
                className="w-full h-full min-h-[300px] min-w-[300px] bg-slate-200 mix-blend-multiply"
                style={{
                  backgroundImage: `url(${product.productImage[activeImage]})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                  backgroundSize: '250%',
                }}
              ></div>
            </div>
          )}

          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {product.productImage.map((image, index) => (
              <div key={index} onClick={() => handleImageClick(index)} className="cursor-pointer flex-shrink-0">
                <div className="w-24 h-24 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  <img src={image} alt={`product-thumb-${index}`} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="flex flex-col gap-4 relative">
          <div className="absolute right-0 top-0 lg:static lg:ml-auto">
            {isInWishlist(product._id) ? (
              <div
                className="bg-red-500 p-3 rounded-full shadow-lg cursor-pointer hover:bg-red-600 transition duration-300 transform hover:scale-105"
                onClick={(e) => handleRemoveFromWishlist(e, product._id)}
              >
                <AiOutlineHeart className="text-white w-6 h-6" />
              </div>
            ) : (
              <div
                className="bg-gray-100 p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-200 transition duration-300 transform hover:scale-105"
                onClick={(e) => handleAddToWishlist(e, product._id)}
              >
                <AiOutlineHeart className="text-gray-500 w-6 h-6" />
              </div>
            )}
          </div>


          <div>
            <h1 className="text-4xl font-bold text-gray-800">{product.productName}</h1>
            <h3 className="text-xl text-gray-500">{product.category}</h3>
            <p className="text-lg text-gray-600 mt-6">Fabric - {product.fabric}</p>
          </div>

          <div className="flex gap-4 items-center">
            <p className="text-3xl font-semibold text-gray-800">₹{product.selling}</p>
            <span className="text-xl text-red-500 line-through">₹{product.price}</span>
            <span className="text-xl text-green-600">{((product.selling - product.price) / product.selling * 100).toFixed(0)}% OFF</span>
          </div>

          <div className="flex gap-6">
            <button
              className={`px-8 py-2 text-lg font-semibold rounded-lg transition-all transform duration-300 ease-in-out shadow-lg ${isInCart(product._id)
                ? "bg-green-500 text-white hover:bg-red-500 hover:text-white hover:scale-105"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                }`}
              onClick={(e) =>
                isInCart(product._id)
                  ? handleRemoveFromCart(e, product._id)
                  : handleAddToCart(e, product._id)
              }
            >
              <span className="flex items-center justify-center">
                {isInCart(product._id) ? "Remove from Cart" : "Add to Cart"}
              </span>
            </button>
            <button
              className="px-6 py-3 bg-gray-300 text-gray-700 text-lg rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
              onClick={(e) => {
                handleAddToCart(e, product._id)
                nav("/order-preparation")
              }
              }
            >
              Buy Now
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="text-lg font-semibold text-gray-700">Product Description</p>
            <p className="text-base text-gray-600">{product.description}</p>
          </div>

          <div className="pt-6 border-t">
            <div className="flex gap-6">
              <Tab label="Sizing" isActive={activeTab === 'Sizing'} onClick={handleTabClick} />
              <Tab label="Fabric Care" isActive={activeTab === 'Fabric Care'} onClick={handleTabClick} />
            </div>
            <div className="mt-4">
              {activeTab === 'Sizing' && (
                <p className="text-base text-gray-600">
                  This is the sizing information for the product. Length of the saree is 216-inch, Length of the blouse is 30-inch.
                </p>
              )}
              {activeTab === 'Fabric Care' && (
                <p className="text-base text-gray-600">
                  This product should be washed at 30°C. Avoid bleach and tumble drying for better durability.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        {
          product.category === "Saree"
            ? <EthnicHandloomSarees heading={"More Similar Products"} />
            : product.category === "Chudithar"
              ? <EthnicHandloomChudis heading={"More Similar Products"} />
              : null
        }
      </div>
    </div>
  );

};

// Tab Component
const Tab = ({ label, isActive, onClick }) => {
  return (
    <div
      className={`cursor-pointer py-2 px-4 text-lg ${isActive ? 'text-blue-500 font-semibold' : 'text-gray-700'
        } hover:text-blue-500 transition-all`}
      onClick={() => onClick(label)}
    >
      {label}
    </div>
  );
};
export default ProductDetails;
