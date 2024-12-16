import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import SliderCard from "./SliderCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import axios from "axios";

const EthnicHandloomSarees = ({ heading }) => {
  const [sarees, setSarees] = useState([]);

  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-0 transform bg-white -translate-y-1/2 shadow-md rounded-full p-2 z-10 hover:bg-gray-200"
      style={{ marginLeft: "10px" }}
    >
      <FaAngleLeft size={20} />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute bg-opacity-15 bg-white top-1/2 right-0 transform -translate-y-1/2 shadow-md rounded-full p-2 z-10 hover:bg-gray-200"
      style={{ marginRight: "10px" }}
    >
      <FaAngleRight size={20} />
    </button>
  );

  const getSareeElements = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/saree-slider`
      );
      const filteredSarees = response.data.filter(saree => saree.quantity > 0);
      setSarees(filteredSarees);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSareeElements();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="my-12 px-8 relative">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        {heading ? heading : "Ethnic Handloom Sarees"}
      </h2>
      <div className="p-4">
        <Slider {...settings}>
          {sarees.map((saree) => (
            <SliderCard key={saree._id} product={saree} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EthnicHandloomSarees;
