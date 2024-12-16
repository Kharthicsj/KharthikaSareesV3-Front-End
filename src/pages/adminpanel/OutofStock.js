import React, { useEffect, useState } from 'react';
import Uploadpopup from './Uploadpopup';
import axios from 'axios';
import AdminProductCard from '../../components/adminProductCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Loading from '../../components/Loading';

const OutofStock = () => {
    const [open, setOpen] = useState(false);
    const [filterSectionOpen, setFilterSectionOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [arrowRotated, setArrowRotated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fabricFilters, setFabricFilters] = useState([]);
    const [categoryFilters, setCategoryFilters] = useState([]);

    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/product-fetch`);
            setProducts(response?.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        let results = products
            .filter((product) => product.quantity === 0)
            .filter(
                (product) =>
                    product.productName.toLowerCase().includes(lowerCaseQuery) ||
                    product.category.toLowerCase().includes(lowerCaseQuery) ||
                    product.fabric.toLowerCase().includes(lowerCaseQuery) ||
                    product.price.toString().includes(lowerCaseQuery) ||
                    product.selling.toString().includes(lowerCaseQuery) ||
                    product._id.toLowerCase().includes(lowerCaseQuery)
            );

        if (fabricFilters.length > 0) {
            results = results.filter((product) =>
                fabricFilters.includes(product.fabric.toLowerCase())
            );
        }

        if (categoryFilters.length > 0) {
            results = results.filter((product) =>
                categoryFilters.includes(product.category.toLowerCase())
            );
        }

        if (sortBy === 'priceAsc') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceDesc') {
            results.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'sellingAsc') {
            results.sort((a, b) => a.selling - b.selling);
        } else if (sortBy === 'sellingDsc') {
            results.sort((a, b) => b.selling - a.selling);
        } else if (sortBy === 'A-Z') {
            results.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortBy === 'Z-A') {
            results.sort((a, b) => b.productName.localeCompare(a.productName));
        }

        setFilteredProducts(results);
    }, [searchQuery, products, sortBy, fabricFilters, categoryFilters]);

    const handleArrowClick = () => {
        setFilterSectionOpen(!filterSectionOpen);
        setArrowRotated(!arrowRotated);
    };

    const handleFabricChange = (fabric) => {
        setFabricFilters((prevFilters) =>
            prevFilters.includes(fabric)
                ? prevFilters.filter((f) => f !== fabric)
                : [...prevFilters, fabric]
        );
    };

    const handleCloseMenu = () => {
        setFilterSectionOpen(false);
        setArrowRotated(false);
    };

    const handleCategoryChange = (category) => {
        setCategoryFilters((prevFilters) =>
            prevFilters.includes(category)
                ? prevFilters.filter((c) => c !== category)
                : [...prevFilters, category]
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="relative">
            {open && (
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Uploadpopup close={() => setOpen(false)} fetchData={fetchAllProducts} />
                </div>
            )}

            <div className="flex items-center justify-between p-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-lg p-2 w-80"
                />
                <h2 className="text-2xl font-bold text-center flex-1">
                    Out of Stock Products
                </h2>
            </div>

            <div className={`px-12 mt-8 ${open ? 'pt-24' : ''}`}>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] overflow-y-scroll scrollbar-hide">
                        {filteredProducts.map((element, index) => (
                            <div key={index}>
                                <AdminProductCard product={element} fetchData={fetchAllProducts}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No products found</p>
                )}
            </div>

            <div
                className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg cursor-pointer border border-orange-500 transition-all duration-300"
                onClick={handleArrowClick}
            >
                <FaArrowLeft
                    className={`text-orange-500 text-lg transition-transform duration-300 ${arrowRotated ? 'rotate-90' : ''}`}
                />
            </div>

            {filterSectionOpen && (
                <div
                    className="fixed right-80 z-50 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg cursor-pointer border border-orange-500 transition-all duration-300"
                    onClick={handleCloseMenu}
                >
                    <FaArrowRight
                        className={`text-orange-500 text-lg transition-transform duration-300 ${arrowRotated ? 'rotate-30' : ''}`}
                    />
                </div>
            )}

            {filterSectionOpen && (
                <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-300 p-6 z-40 transition-transform duration-300 transform ease-in-out">
                    <h3 className="text-2xl font-bold text-orange-600 mb-6">Filter & Sort</h3>

                    <div className="mb-6">
                        <label className="block font-semibold text-lg mb-3">Sort by Price</label>
                        <select
                            className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-orange-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="priceAsc">Price (Low to High)</option>
                            <option value="priceDesc">Price (High to Low)</option>
                            <option value="sellingAsc">Selling Price (Low to High)</option>
                            <option value="sellingDsc">Selling Price (High to Low)</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold text-lg mb-3">Sort by Name</label>
                        <select
                            className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-orange-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-lg text-orange-600 mb-3">Filter by Fabric</h4>
                        {['cotton', 'silk cotton', 'pochampalli', 'soft silk'].map((fabric) => (
                            <div key={fabric} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={fabric}
                                    value={fabric}
                                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                    checked={fabricFilters.includes(fabric)}
                                    onChange={() => handleFabricChange(fabric)}
                                />
                                <label htmlFor={fabric} className="ml-3 text-gray-700 capitalize">
                                    {fabric}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-lg text-orange-600 mb-3">Filter by Category</h4>
                        {['chudithar', 'saree'].map((category) => (
                            <div key={category} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={category}
                                    value={category}
                                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                    checked={categoryFilters.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                <label htmlFor={category} className="ml-3 text-gray-700 capitalize">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setFabricFilters([]);
                            setCategoryFilters([]);
                            setSortBy('');
                        }}
                        className="w-full py-3 text-center bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default OutofStock;
