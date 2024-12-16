import React, { useEffect, useState, useCallback } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import axios from "axios";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState({
    desktop: [],
    mobile: []
  });

  const fetchBannerImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch-banner`);
      const bannerData = response.data.activeBanners;

      const desktopImages = bannerData.filter(image => image.screen === "computer");
      const mobileImages = bannerData.filter(image => image.screen === "mobile");

      setImages({
        desktop: desktopImages,
        mobile: mobileImages
      });
    } catch (error) {
      console.error("Error fetching banner images", error);
    }
  };

  const nextImage = useCallback(() => {
    setCurrentImage(prev => (prev < images.desktop.length - 1 ? prev + 1 : 0));
  }, [images.desktop.length]);

  const prevImage = () => {
    setCurrentImage(prev => (prev > 0 ? prev - 1 : images.desktop.length - 1));
  };

  useEffect(() => {
    fetchBannerImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3500);

    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <div className="w-screen mx-auto rounded">
      <div className="h-56 md:h-72 w-full bg-slate-200 relative">
        <div className="absolute z-10 h-full w-full md:flex items-center hidden">
          <div className="flex justify-between w-full text-2xl">
            <button onClick={prevImage} className="bg-white shadow-md rounded-full p-1">
              <FaAngleLeft />
            </button>
            <button onClick={nextImage} className="bg-white shadow-md rounded-full p-1">
              <FaAngleRight />
            </button>
          </div>
        </div>

        <div className="hidden md:flex h-full w-full overflow-hidden">
          {images.desktop.length > 0 &&
            images.desktop.map((image, index) => (
              <div
                className="w-full h-full flex-shrink-0 transition-all"
                key={image._id}
                style={{
                  transform: `translateX(-${currentImage * 100}%)`,
                }}
              >
                <img
                  src={image.banner}
                  className="w-full h-full object-cover"
                  alt="banner-img"
                />
              </div>
            ))}
        </div>

        <div className="flex h-full w-full overflow-hidden md:hidden">
          {images.mobile.length > 0 &&
            images.mobile.map((image, index) => (
              <div
                className="w-full h-full flex-shrink-0 transition-all"
                key={image._id}
                style={{
                  transform: `translateX(-${currentImage * 100}%)`,
                }}
              >
                <img
                  src={image.banner}
                  className="w-full h-full object-cover"
                  alt="banner-img"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
