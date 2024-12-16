import React, { useState, useEffect } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import EditProductsPopUp from "../pages/adminpanel/EditProductsPopUp";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { DeleteConfirmationPopup } from "./DeleteConfirmationPopup";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";

const AdminProductCard = ({ product, fetchData }) => {
  const [editProduct, setEditProduct] = useState(false);
  const [showProductId, setShowProductId] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delLoading, delSetLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".product-card")) {
        setShowProductId(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIconClick = () => {
    setShowProductId(!showProductId);
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    delSetLoading(true);

    if (!product?._id) {
      toast.error("Invalid product ID");
      return;
    }

    try {
      const imageDeletionPromises = product.productImage.map((imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        return axios.post(
          `${process.env.REACT_APP_API_URL}/delete-image`,
          { publicId },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });

      await Promise.all(imageDeletionPromises);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/delete-product`,
        { _id: product?._id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Successfully deleted product and associated images");
      fetchData();
    } catch (err) {
      console.error(
        "Error deleting product or images:",
        err.response?.data || err
      );
      toast.error(
        err.response?.data?.message || "Failed to delete product or images"
      );
    } finally {
      delSetLoading(false);
      closeDeleteModal();
    }
  };

  if (delLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* Product Card */}
      <div
        className={`relative product-card ${
          product?.quantity === 0 ? "grayscale" : ""
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-100 hover:shadow-2xl">
          <div className="relative">
            <img
              className={`object-cover w-64 h-64 rounded-t-lg transition-all duration-500 ease-in-out 
              ${product?.quantity === 0 ? "filter grayscale" : ""} `}
              src={product?.productImage[0]}
              alt={product?.productName || "Product image"}
            />

            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
              <h2 className="text-white text-lg font-semibold">
                {product?.productName || "Product Name"}
              </h2>
            </div>
            <div
              className="absolute top-2 right-2 text-gray-100 cursor-pointer"
              onClick={handleIconClick}
            >
              <IoIosInformationCircleOutline size={24} className="z-50" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                {product?.category || "Category"}
              </span>
              <span className="text-xl font-semibold text-orange-600 line-through">
                ₹{product?.price || "Price"}
              </span>
              <span className="text-xl font-semibold text-orange-600">
                ₹{product?.selling || "Price"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-1">
              {product?.description ||
                "This is a brief description of the product."}
            </p>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            {/* Edit Button */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white text-2xl hover:bg-orange-600 transition-all transform hover:scale-110 shadow-lg"
              onClick={() => setEditProduct(true)}
            >
              <CiEdit />
            </button>

            {/* Delete Button */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white text-2xl hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
              onClick={openDeleteModal}
            >
              <RiDeleteBin2Fill />
            </button>
          </div>
        </div>

        {/* Display Product ID on Click */}
        {showProductId && (
          <div className="absolute top-0 left-0 bg-black text-white p-2 opacity-75 rounded-br-lg">
            Product ID: {product?._id}
          </div>
        )}
      </div>

      {/* Modals - Outside the Card */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <EditProductsPopUp
            close={() => setEditProduct(false)}
            productData={product}
            fetchData={fetchData}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationPopup
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
};

export default AdminProductCard;
