import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const FilterMenu = ({ 
  sortBy, 
  setSortBy, 
  fabricFilters, 
  setFabricFilters, 
  categoryFilters, 
  setCategoryFilters 
}) => {
  const [filterSectionOpen, setFilterSectionOpen] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);

  const handleArrowClick = () => {
    setFilterSectionOpen(!filterSectionOpen);
    setArrowRotated(!arrowRotated);
  };

  const handleCloseMenu = () => {
    setFilterSectionOpen(false);
    setArrowRotated(false);
  };

  const handleFabricChange = (fabric) => {
    setFabricFilters((prevFilters) =>
      prevFilters.includes(fabric)
        ? prevFilters.filter((f) => f !== fabric)
        : [...prevFilters, fabric]
    );
  };

  const handleCategoryChange = (category) => {
    setCategoryFilters((prevFilters) =>
      prevFilters.includes(category)
        ? prevFilters.filter((c) => c !== category)
        : [...prevFilters, category]
    );
  };

  return (
    <>
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
              <option value="sellingAsc">Selling Price (Low to High)</option>
              <option value="sellingDesc">Selling Price (High to Low)</option>
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
    </>
  );
};

export default FilterMenu;
