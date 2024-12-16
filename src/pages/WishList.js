import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import EmptyWishlist from "../components/EmptyCart";
import toast from "react-hot-toast";
import WishListBg from "../components/WishlistBg";

const WishList = () => {
    const [wishListItems, setWishListItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSort, setSelectedSort] = useState("price");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedFabric, setSelectedFabric] = useState("all");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-wishlist`, { withCredentials: true });
                const data = response.data.data;
                setWishListItems(data);
                setFilteredItems(data);  // Set initial filteredItems to all wishlist items
            } catch (error) {
                console.error("Failed to fetch wishlist items", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistItems();
    }, []);

    useEffect(() => {
        let updatedItems = [...wishListItems];

        if (selectedCategory !== "all") {
            updatedItems = updatedItems.filter(item => item.category === selectedCategory);
        }

        if (selectedFabric !== "all") {
            updatedItems = updatedItems.filter(item => item.fabric === selectedFabric);
        }

        if (selectedSort === "price") {
            updatedItems = updatedItems.sort((a, b) => a.selling - b.selling);
        } else if (selectedSort === "name") {
            updatedItems = updatedItems.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (selectedSort === "priceAsc") {
            updatedItems = updatedItems.sort((a, b) => a.selling - b.selling);
        } else if (selectedSort === "priceDsc") {
            updatedItems = updatedItems.sort((a, b) => b.selling - a.selling);
        }

        setFilteredItems(updatedItems);
    }, [selectedCategory, selectedFabric, selectedSort, wishListItems]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/remove-from-wishlist`, { productId }, { withCredentials: true });
            const updatedWishListItems = wishListItems.filter(item => item.productId !== productId);
            setWishListItems(updatedWishListItems);
        } catch (error) {
            toast.error("Failed to remove product from wishlist", error);
            console.error("Failed to remove product from wishlist", error);
        } finally {
            toast.success("💔 Product removed from Wishlist")
            setInterval(() => {
                window.location.reload()
            }, 2000);
        }
    };

    const handleSortChange = (e) => {
        setSelectedSort(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleFabricChange = (e) => {
        setSelectedFabric(e.target.value);
    };

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            {/* Toggle Menu Button (Center Aligned on All Screens) */}
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex justify-center items-center z-30">
                <button
                    onClick={handleToggleMenu}
                    className={`toggle-menu-btn p-2 bg-white border-orange-500 border text-orange-500 rounded-full ${isMenuOpen ? 'bg-red-500' : 'bg-green-500'} ${!isMenuOpen ? '' : 'ml-52'}`}
                >
                    {isMenuOpen ? (
                        <div>
                            <FaArrowLeft className="w-6 h-6" />
                        </div>
                    ) : (
                        <div>
                            <FaArrowRight className="w-6 h-6" />
                        </div>
                    )}
                </button>
            </div>

            <div className="relative bg-[#f0f4f8] min-h-screen overflow-hidden">
                <div className="top-0 left-0 w-full h-full z-0">
                    <WishListBg />
                </div>
                {/* Main content */}
                <div className="container mx-auto px-6 py-12 relative z-10">
                    {/* Side Menu */}
                    <div className={`side-menu transition-all duration-300 fixed top-0 left-0 bg-white text-black h-full p-6 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} z-50`}>
                        <h3 className="text-xl font-semibold mb-4">Filters</h3>
                        <div className="category-filter mb-4">
                            <label className="block mb-2">Category</label>
                            <select value={selectedCategory} onChange={handleCategoryChange} className="w-full p-2 border rounded-md">
                                <option value="all">All</option>
                                <option value="Saree">Saree</option>
                                <option value="Chudithar">Chudithar</option>
                            </select>
                        </div>
                        <div className="fabric-filter mb-4">
                            <label className="block mb-2">Fabric</label>
                            <select value={selectedFabric} onChange={handleFabricChange} className="w-full p-2 border rounded-md">
                                <option value="all">All</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Silk Cotton">Silk Cotton</option>
                                <option value="Pochampalli">Pochampalli</option>
                                <option value="Soft Silk">Soft Silk</option>
                            </select>
                        </div>
                        <div className="sort-filter mb-4">
                            <label className="block mb-2">Sort By</label>
                            <select value={selectedSort} onChange={handleSortChange} className="w-full p-2 border rounded-md">
                                <option value="name">Name</option>
                                <option value="priceAsc">Price (Low - High)</option>
                                <option value="priceDsc">Price (High - Low)</option>
                            </select>
                        </div>
                    </div>

                    {/* Wishlist Items */}
                    <div className="wishlist-items-container mt-8">
                        {filteredItems.length === 0 ? (
                            <div className="text-center">
                                <EmptyWishlist />
                                <div className="text-xl text-gray-500 mb-4">Your wishlist is empty!</div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-semibold text-center mb-6 text-b">Your Wishlist</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="card bg-white rounded-lg p-4 shadow-lg border border-gray-200 relative overflow-hidden w-full transform transition-all duration-300 ease-in-out group hover:scale-105 hover:shadow-2xl"
                                        >
                                            <div className="card-image group-hover:scale-105 transition-transform duration-300 ease-in-out">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-48 object-cover rounded-lg md:h-56 lg:h-64"
                                                />
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(item.productId)}
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-full transition duration-200"
                                                >
                                                    <AiOutlineDelete className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <div className="card-content mt-4 text-center">
                                                <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                                                <p className="text-md text-gray-700 mt-2">₹{item.selling}</p>
                                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                            </div>
                                            <div className="mt-4 text-center">
                                                <Link
                                                    to={`/product/${item.productId}`}
                                                    className="bg-orange-500 text-white px-4 py-1 rounded-full hover:bg-orange-700 transition duration-300"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishList;
