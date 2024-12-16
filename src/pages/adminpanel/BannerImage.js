import React, { useState, useEffect } from 'react';
import BannerUploadPopup from './BannerUploadPopup';
import axios from 'axios';
import { FaTrash, FaPencil } from 'react-icons/fa6';
import BannerEditPopup from './BannerEditPopup';

const BannerImage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [banners, setBanners] = useState({
    activeBanners: [],
    inactiveBanners: [],
  });
  const [filter, setFilter] = useState('active');
  const [screenFilter, setScreenFilter] = useState('all');
  const [hoveredBanner, setHoveredBanner] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-banner`);
      setBanners({
        activeBanners: response.data.activeBanners,
        inactiveBanners: response.data.inactiveBanners,
      });
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleScreenFilterChange = (event) => {
    setScreenFilter(event.target.value);
  };

  const handleBannerUpload = (newBanner) => {
    setBanners((prevState) => {
      const updatedBanners =
        filter === 'active'
          ? [...prevState.activeBanners, newBanner]
          : [...prevState.inactiveBanners, newBanner];
      return filter === 'active'
        ? { ...prevState, activeBanners: updatedBanners }
        : { ...prevState, inactiveBanners: updatedBanners };
    });
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-banner/${bannerId}`);
      setBanners((prevState) => {
        const updatedActiveBanners = prevState.activeBanners.filter((banner) => banner._id !== bannerId);
        const updatedInactiveBanners = prevState.inactiveBanners.filter((banner) => banner._id !== bannerId);
        return {
          activeBanners: updatedActiveBanners,
          inactiveBanners: updatedInactiveBanners,
        };
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner); // Set the selected banner data
    setEditOpen(true); // Open the edit popup
  };

  const renderBanners = () => {
    const bannersToDisplay = (filter === 'active' ? banners.activeBanners : banners.inactiveBanners).filter(
      (banner) => screenFilter === 'all' || banner.screen === screenFilter
    );

    return bannersToDisplay.length > 0 ? (
      bannersToDisplay.map((banner) => (
        <div
          key={banner._id}
          className="relative p-2 flex justify-center items-center"
          onMouseEnter={() => setHoveredBanner(banner._id)}
          onMouseLeave={() => setHoveredBanner(null)}
        >
          <div className="w-full h-0 pb-[100%] relative">
            <img
              src={banner.banner}
              alt={banner.name}
              className="absolute inset-0 w-full h-full object-cover rounded-md border"
            />
          </div>
          {hoveredBanner === banner._id && (
            <>
              <button
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                onClick={() => handleDeleteBanner(banner._id)}
              >
                <FaTrash />
              </button>
              <button
                className="absolute top-2 left-2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                onClick={() => handleEditBanner(banner)}
              >
                <FaPencil />
              </button>
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-transparent to-transparent text-white text-center">
            <h3 className="text-sm font-semibold">{banner.name}</h3>
            <p className="text-xs">{banner.active ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center py-4">No banners available</p>
    );
  };

  return (
    <div className="relative">
      {open && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <BannerUploadPopup close={() => setOpen(false)} onUpload={handleBannerUpload} fetchData={fetchBanners} />
        </div>
      )}
      {editOpen && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <BannerEditPopup
            bannerData={selectedBanner} // Pass the selected banner data as a prop
            close={() => setEditOpen(false)}
            fetchData={fetchBanners}
          />
        </div>
      )}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold text-center flex-1">Banner Image Management</h2>
        <button
          className="py-2 px-4 rounded-full bg-orange-500 text-white hover:bg-red-800 hover:transition-all"
          onClick={() => setOpen(true)}
        >
          Upload Banner
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <label htmlFor="bannerFilter" className="font-semibold">
              Filter Banners:
            </label>
            <select
              id="bannerFilter"
              className="p-2 border-2 border-black"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="active">Active Banners</option>
              <option value="inactive">Inactive Banners</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="screenFilter" className="font-semibold">
              Filter by Screen Type:
            </label>
            <select
              id="screenFilter"
              className="p-2 border-2 border-black"
              value={screenFilter}
              onChange={handleScreenFilterChange}
            >
              <option value="all">All</option>
              <option value="mobile">Mobile</option>
              <option value="computer">Computer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {renderBanners()}
        </div>
      </div>
    </div>
  );
};

export default BannerImage;
